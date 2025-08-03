// Game update loop and entity update functions

const { CONFIG } = require('./config');

/**
 * Main update loop for the game
 */
function update(game) {
    let stateChanged = false;
    const destroyedEntities = new Set();

    // --- Player Attack Logic ---
    stateChanged = updatePlayers(game, stateChanged, destroyedEntities) || stateChanged;

    // --- Object & Mob Logic ---
    stateChanged = updateObjects(game, stateChanged, destroyedEntities) || stateChanged;

    // --- Crafting Queue Processing ---
    const craftingSystem = require('./crafting');
    stateChanged = craftingSystem.processCraftingQueues(game) || stateChanged;

    // --- Fake Player AI ---
    stateChanged = updateFakePlayers(game, stateChanged) || stateChanged;

    // Remove destroyed entities
    if (destroyedEntities.size > 0) {
        // Store entity positions before removing them
        const entitiesToRemove = [];
        game.state.objects.forEach(obj => {
            if (destroyedEntities.has(obj.id)) {
                entitiesToRemove.push({ id: obj.id, x: obj.x, y: obj.y });
            }
        });
        
        // Remove from main objects array
        game.state.objects = game.state.objects.filter(o => !destroyedEntities.has(o.id));
        
        // Remove from world grid
        entitiesToRemove.forEach(entity => {
            const cell = game.state.world[entity.y][entity.x];
            if (cell && cell.objects) {
                cell.objects = cell.objects.filter(o => o.id !== entity.id);
            }
        });
        
        stateChanged = true;
    }

    if (stateChanged) game.updateWorldState();
}

/**
 * Updates all online players' buffs and combat status
 */
function updatePlayers(game, stateChanged, destroyedEntities) {
    let hasChanges = false;
    const now = Date.now();
    
    game.state.players.forEach(player => {
        if (!player.isOnline || player.isDead) return;

        // Handle buff expirations
        const previousBuffCount = player.buffs.length;
        player.buffs = player.buffs.filter(buff => buff.expiresAt > now);
        if (player.buffs.length < previousBuffCount) {
            game.logEvent("A buff has worn off.", game.getClientByPlayerId(player.id));
            game.markPlayerStatsDirty(player.id);
            game.recalculatePlayerStats(player);
            hasChanges = true;
        }

        // Handle combat
        const targetId = player.attackingPlayer || player.attacking;
        if (!targetId) return;

        const target = game.findEntityById(targetId);
        if (!target || (target.stats && target.stats.hp <= 0) || (target.isDead)) {
            game.stopCombat(player);
            hasChanges = true;
            return;
        }

        if (player.x === target.x && player.y === target.y && (target.type === CONFIG.ENTITY_TYPES.PLAYER || !target.respawnUntil)) {
            // Check if it's time for the next attack
            if (now >= (player.nextAttackTime || 0)) {
                hasChanges = true;
                // Check for accuracy
                if (Math.random() * 100 > player.stats.accuracy) {
                    game.logCombat(`${player.name} missed an attack on ${target.name || target.id}.`);
                }
                else if (target.type === CONFIG.ENTITY_TYPES.PLAYER && shouldDodge(target)) {
                    game.logCombat(`${target.name} dodges an attack from ${player.name}.`);
                } else {
                    let damage = calculateDamage(player, target);
                    game.logCombat(`${player.name} deals ${damage.toFixed(1)} damage to ${target.name || target.id}.`);
                    // Ensure target stats exist
                    if (!target.stats) target.stats = {};
                    const currentHp = target.stats.hp || 0;
                    target.stats.hp = Math.max(0, currentHp - damage);
                    
                    // Log damage to cell objects
                    logDamageToCell(game, target, damage, player.name);
                    
                    // Track damage dealt by player for drop calculations
                    if (target.type === CONFIG.ENTITY_TYPES.MOB) {
                        if (!player.damageDealt) player.damageDealt = {};
                        if (!player.damageDealt[target.id]) player.damageDealt[target.id] = 0;
                        player.damageDealt[target.id] += damage;
                    }
                }

                if ((target.stats?.hp || 0) <= 0) {
                    game.handleTargetDefeated(player, target);
                    
                    // Handle construction site destruction immediately
                    if (target.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE) {
                        destroyedEntities.add(target.id);
                        game.logEvent(`${target.id} has been destroyed by ${player.name}!`);
                        
                        // Remove all siege machines targeting this castle
                        game.state.objects.forEach(siege => {
                            if (siege.type === CONFIG.ENTITY_TYPES.SIEGE_MACHINE && siege.targetId === target.id) {
                                destroyedEntities.add(siege.id);
                            }
                        });
                    }
                }
                const safeSpeed = player.stats?.speed || 1;
                player.nextAttackTime = now + (1000 / safeSpeed);
            }
        }
    });
    return hasChanges;
}

/**
 * Updates all game objects (mobs, construction sites, siege machines)
 */
function updateObjects(game, stateChanged, destroyedEntities) {
    let hasChanges = false;
    game.state.objects.forEach(obj => {
        // Handle mob combat
        if (obj.type === CONFIG.ENTITY_TYPES.MOB && obj.attackers.length > 0 && obj.stats.hp > 0 && !obj.respawnUntil) {
            hasChanges = updateMobCombat(game, obj, stateChanged) || hasChanges;
        }

        // Handle mob respawning
        if (obj.type === CONFIG.ENTITY_TYPES.MOB && obj.respawnUntil && Date.now() >= obj.respawnUntil) {
            obj.respawnUntil = null;
            obj.stats.hp = obj.stats.maxHp;
            obj.attackers = []; // Reset attackers
            obj.nextAttackTime = Date.now(); // Reset attack timestamp
            obj.damageDealt = {}; // Reset damage tracking
            game.logEvent(`${obj.id} has respawned!`);
            hasChanges = true;
        }

        // Handle construction completion
        if (obj.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE && obj.constructionCompleteUntil && Date.now() >= obj.constructionCompleteUntil) {
            obj.constructionCompleteUntil = null;
            hasChanges = true;
            obj.level++;
            obj.materials.bricks = 0;
            obj.requiredMaterials.bricks = CONFIG.CONSTRUCTION_BASE_BRICKS_REQUIRED * obj.level;
            obj.stats.maxHp = CONFIG.CONSTRUCTION_BASE_HP * obj.level;
            obj.stats.hp = obj.stats.maxHp;
            game.logEvent(`Construction site ${obj.id} has been upgraded to Level ${obj.level}!`);
        }

        // Handle castle destruction
        if (obj.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE && (obj.stats?.hp || 0) <= 0) {
            destroyedEntities.add(obj.id);
            game.logEvent(`${obj.id} has been destroyed!`);
            
            // Remove all siege machines targeting this castle
            game.state.objects.forEach(siege => {
                if (siege.type === CONFIG.ENTITY_TYPES.SIEGE_MACHINE && siege.targetId === obj.id) {
                    destroyedEntities.add(siege.id);
                }
            });
            
            hasChanges = true;
        }

        // Handle siege machine attacks
        if (obj.type === CONFIG.ENTITY_TYPES.SIEGE_MACHINE) {
            hasChanges = updateSiegeMachine(game, obj, stateChanged, destroyedEntities) || hasChanges;
        }
    });
    return hasChanges;
}

/**
 * Updates a mob's combat status
 */
function updateMobCombat(game, mob, stateChanged) {
    let hasChanges = false;
    const now = Date.now();
    
    // Check if it's time for the next attack
    if (now >= (mob.nextAttackTime || 0) && mob.stats?.dmg > 0) {
        hasChanges = true;
        const randomAttackerId = mob.attackers[Math.floor(Math.random() * mob.attackers.length)];
        const playerToAttack = game.findPlayerById(randomAttackerId);
        
        if (playerToAttack && !playerToAttack.isDead) {
            // Ensure player stats exist
            if (!playerToAttack.stats) playerToAttack.stats = {};
            const safeDodge = playerToAttack.stats.dodge || 0;
            const safeHp = playerToAttack.stats.hp || 0;
            const mobDmg = mob.stats?.dmg || 0;
            
            // Check for accuracy
            if (Math.random() * 100 > mob.stats.accuracy) {
                game.logCombat(`${mob.id} missed an attack on ${playerToAttack.name}.`);
            }
            else if (!(Math.random() * 100 < safeDodge)) {
                game.logCombat(`${mob.id} deals ${mobDmg.toFixed(0)} damage to ${playerToAttack.name}.`);
                playerToAttack.stats.hp = Math.max(0, safeHp - mobDmg);
                game.markPlayerStatsDirty(playerToAttack.id);
                
                // Log damage to cell objects
                logDamageToCell(game, playerToAttack, mobDmg, mob.id);
                
                if (playerToAttack.stats.hp <= 0) {
                    game.handleTargetDefeated(mob, playerToAttack);
                }
            } else {
                game.logCombat(`${playerToAttack.name} dodges an attack from ${mob.id}.`);
            }
        }
        const safeSpeed = mob.stats?.speed || 1;
        mob.nextAttackTime = now + (1000 / safeSpeed);
    }
    return hasChanges;
}

/**
 * Updates a siege machine's status
 */
function updateSiegeMachine(game, siege, stateChanged, destroyedEntities) {
    let hasChanges = false;
    const now = Date.now();
    
    // Check if it's time for the next attack
    if (now >= (siege.nextAttackTime || 0)) {
        siege.nextAttackTime = now + 1000; // Set next attack time to 1 second from now
        hasChanges = true;
        const targetSite = game.findEntityById(siege.targetId);

        if (targetSite && (targetSite.stats?.hp || 0) > 0) {
            // Ensure stats exist
            if (!targetSite.stats) targetSite.stats = {};
            if (!siege.stats) siege.stats = {};
            
            const siegeDmg = siege.stats.dmg || 0;
            const siegeSelfDmg = siege.stats.selfDmg || 0;
            
            targetSite.stats.hp = Math.max(0, (targetSite.stats.hp || 0) - siegeDmg);
            siege.stats.hp = Math.max(0, (siege.stats.hp || 0) - siegeSelfDmg);
            
            // Log damage to cell objects
            logDamageToCell(game, targetSite, siegeDmg, siege.id);
            logDamageToCell(game, siege, siegeSelfDmg, siege.id);
            
            game.logEvent(`${siege.id} dealt ${siegeDmg} damage to ${targetSite.id} and took ${siegeSelfDmg} damage.`);

            if (targetSite.stats.hp <= 0) {
                game.logEvent(`${targetSite.id} has been destroyed by siege engines!`);
                destroyedEntities.add(targetSite.id);
                game.state.objects.forEach(m => {
                    if (m.type === CONFIG.ENTITY_TYPES.SIEGE_MACHINE && m.targetId === targetSite.id) {
                        destroyedEntities.add(m.id);
                    }
                });
            }
        } else {
            destroyedEntities.add(siege.id);
        }

        if ((siege.stats?.hp || 0) <= 0) {
            destroyedEntities.add(siege.id);
            game.logEvent(`${siege.id} has been destroyed.`);
        }
    }
    return hasChanges;
}

/**
 * Calculates damage for an attack
 */
function calculateDamage(attacker, target) {
    // Ensure attacker stats exist
    if (!attacker.stats) attacker.stats = {};
    let damage = attacker.stats.dmg || 0;
    
    // Check for critical hit
    const safeCritical = attacker.stats.critical || 0;
    if (Math.random() * 100 < safeCritical) {
        damage *= CONFIG.CRITICAL_DAMAGE_MULTIPLIER;
    }
    
    // Apply defense reduction
    if (target.stats && target.stats.def) {
        const defense = Math.min(target.stats.def, 60); // Cap defense at 60%
        damage *= (1 - defense / 100);
    }

    // Apply weakness bonus
    if (target.type === CONFIG.ENTITY_TYPES.MOB && target.weakness && attacker.skills?.[target.weakness]) {
        const skillBonus = 1 + (attacker.skills[target.weakness].level * CONFIG.SKILL_DAMAGE_BONUS_PER_LEVEL);
        damage *= skillBonus;
    }
    
    return damage;
}

/**
 * Determines if a target should dodge an attack
 */
function shouldDodge(target) {
    // Ensure target stats exist
    if (!target.stats) target.stats = {};
    const safeDodge = target.stats[CONFIG.DODGE_CHANCE_STAT] || 0;
    return Math.random() * 100 < safeDodge;
}

/**
 * Updates fake player AI behavior
 */
function updateFakePlayers(game, stateChanged) {
    if (!game.fakePlayers || game.fakePlayers.length === 0) {
        return stateChanged;
    }

    let hasChanges = false;
    const now = Date.now();

    game.fakePlayers.forEach(fakePlayer => {
        if (fakePlayer.isDead) return;

        // Check if it's time for this fake player to act
        if (now - fakePlayer.lastAction < fakePlayer.actionInterval) {
            return;
        }

        // Update last action time
        fakePlayer.lastAction = now;
        fakePlayer.actionInterval = Math.random() * 5000 + 2000; // Random interval 2-7 seconds

        // Random AI behavior
        const action = Math.random();
        
        if (action < 0.3) {
            // 30% chance to move randomly
            hasChanges = moveFakePlayerRandomly(game, fakePlayer) || hasChanges;
        } else if (action < 0.6) {
            // 30% chance to attack nearby enemies
            hasChanges = attackNearbyEnemies(game, fakePlayer) || hasChanges;
        } else if (action < 0.8) {
            // 20% chance to send a chat message
            hasChanges = sendFakePlayerChat(game, fakePlayer) || hasChanges;
        } else {
            // 20% chance to do nothing (idle)
            // This creates more realistic behavior
        }
    });

    return hasChanges;
}

/**
 * Moves a fake player to a random adjacent location
 * OPTIMIZED: Uses efficient grid updates
 */
function moveFakePlayerRandomly(game, fakePlayer) {
    const directions = [
        { dx: 0, dy: -1 }, // North
        { dx: 1, dy: 0 },  // East
        { dx: 0, dy: 1 },  // South
        { dx: -1, dy: 0 }  // West
    ];

    const direction = directions[Math.floor(Math.random() * directions.length)];
    const newX = Math.max(0, Math.min(CONFIG.MAP_SIZE - 1, fakePlayer.x + direction.dx));
    const newY = Math.max(0, Math.min(CONFIG.MAP_SIZE - 1, fakePlayer.y + direction.dy));

    if (newX !== fakePlayer.x || newY !== fakePlayer.y) {
        // OPTIMIZATION: Store old position before updating
        const oldX = fakePlayer.x;
        const oldY = fakePlayer.y;

        // Update player position
        fakePlayer.x = newX;
        fakePlayer.y = newY;

        // OPTIMIZATION: Use efficient grid update function
        const worldSystem = require('./world');
        worldSystem.updatePlayerPosition(game, fakePlayer, oldX, oldY, newX, newY);

        // Log movement (but not too frequently to avoid spam)
        if (Math.random() < 0.1) { // 10% chance to log
            game.logEvent(`${fakePlayer.name} moved to (${newX}, ${newY})`);
        }

        return true;
    }

    return false;
}

/**
 * Makes a fake player attack nearby enemies
 */
function attackNearbyEnemies(game, fakePlayer) {
    const cell = game.state.world[fakePlayer.y][fakePlayer.x];
    
    // Look for enemies in the same cell
    const enemies = game.state.objects.filter(obj => 
        obj.type === CONFIG.ENTITY_TYPES.MOB && 
        obj.x === fakePlayer.x && 
        obj.y === fakePlayer.y &&
        obj.stats.hp > 0 &&
        !obj.respawnUntil
    );

    if (enemies.length > 0) {
        const target = enemies[Math.floor(Math.random() * enemies.length)];
        
        // Start combat with the enemy
        const combatSystem = require('./combat');
        const result = combatSystem.startPvECombat(game, fakePlayer, target, null);
        
        if (result) {
            game.logEvent(`${fakePlayer.name} started attacking ${target.id}`);
            return true;
        }
    }

    return false;
}

/**
 * Makes a fake player send a chat message
 */
function sendFakePlayerChat(game, fakePlayer) {
    const chatMessages = [
        "Hello everyone!",
        "How's the game going?",
        "Anyone want to team up?",
        "I found some good loot!",
        "The enemies are getting tougher...",
        "Anyone seen any rare items?",
        "This area is pretty crowded!",
        "I need to rest for a bit.",
        "Great teamwork everyone!",
        "Watch out for that boss!",
        "I'm heading to safety.",
        "Anyone have extra healing items?",
        "The construction is coming along nicely!",
        "I love this game!",
        "Anyone want to trade?"
    ];

    const message = chatMessages[Math.floor(Math.random() * chatMessages.length)];
    
    // Use the chat system to send the message
    const chatSystem = require('./chat');
    chatSystem.handleChatMessage(game, fakePlayer.id, { text: message });
    
    return true;
}

/**
 * Logs damage dealt to objects in the same cell
 */
function logDamageToCell(game, target, damage, attackerName) {
    if (!target || !target.x || !target.y) return;
    
    const cell = game.state.world[target.y][target.x];
    if (!cell) return;
    
    // Get all objects in the cell
    const cellObjects = [...cell.objects, ...cell.players];
    
    // Log damage to each object in the cell
    cellObjects.forEach(obj => {
        if (obj && obj.id !== target.id) {
            const currentHp = obj.stats?.hp || 0;
            const maxHp = obj.stats?.maxHp || 100;
            const hpPercentage = maxHp > 0 ? (currentHp / maxHp * 100).toFixed(1) : '0.0';
            
            game.logEvent(`[Cell ${target.x},${target.y}] ${attackerName} dealt ${damage.toFixed(1)} damage to ${target.name || target.id}. ${obj.name || obj.id}: ${currentHp.toFixed(0)}/${maxHp.toFixed(0)} HP (${hpPercentage}%)`);
        }
    });
}

module.exports = {
    update,
    updatePlayers,
    updateObjects,
    updateMobCombat,
    updateSiegeMachine,
    calculateDamage,
    shouldDodge,
    updateFakePlayers,
    moveFakePlayerRandomly,
    attackNearbyEnemies,
    sendFakePlayerChat,
    logDamageToCell
};