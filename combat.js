// Combat-related functions for the game

const { CONFIG } = require('./config');

/**
 * Starts combat between a player and a target
 */
function startCombat(game, playerId, targetId) {
    const player = game.findPlayerById(playerId);
    const client = game.getClientByPlayerId(playerId);
    
    if (!player || player.isDead) return false;

    const target = game.findEntityById(targetId);
    if (!target || target.x !== player.x || target.y !== player.y) {
        game.logEvent("Target not found in the current area.", client);
        return false;
    }

    stopCombat(game, player);

    if (target.type === CONFIG.ENTITY_TYPES.PLAYER) {
        return startPvPCombat(game, player, target, client);
    } else if (target.type === CONFIG.ENTITY_TYPES.MOB) {
        return startPvECombat(game, player, target, client);
    } else if (target.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE) {
        return startPvECombat(game, player, target, client);
    }
    
    return false;
}

/**
 * Starts player vs player combat
 */
function startPvPCombat(game, player, target, client) {
    if (player.team === target.team) {
        game.logEvent("You cannot attack a member of your own team.", client);
        return false;
    }
    
    // Ensure player stats exist
    if (!player.stats) player.stats = {};
    const safeStamina = player.stats.stamina || 0;
    if (safeStamina < CONFIG.PLAYER_STAMINA_COST_PER_ATTACK) {
        game.logEvent("You are too exhausted to attack another player.", client);
        return false;
    }
    
    // Check if players are in the same cell
    if (player.x !== target.x || player.y !== target.y) {
        game.logEvent("You must be in the same location as your target to attack them.", client);
        return false;
    }

    // If code reaches here, the PvP attack is valid
    player.attackingPlayer = target.id;
    const safeSpeed = player.stats.speed || 1;
    player.nextAttackTime = Date.now() + (1000 / safeSpeed);
    player.stats.stamina = Math.max(0, safeStamina - CONFIG.PLAYER_STAMINA_COST_PER_ATTACK);
    game.logEvent(`${player.name} started attacking ${target.name}!`);
    game.updateWorldState();
    return true;
}

/**
 * Starts player vs environment combat
 */
function startPvECombat(game, player, target, client) {
    // Ensure player stats exist
    if (!player.stats) player.stats = {};
    
    if (target.respawnUntil) {
        game.logEvent("You can't attack a respawning enemy.", client);
        return false;
    }
    
    if (target.attackers.length >= target.maxAttackers && !target.attackers.includes(player.id)) {
        game.logEvent(`${target.id} is already being fully engaged!`, client);
        return false;
    }





    if (!target.attackers.includes(player.id)) {
        target.attackers.push(player.id);
    }

    player.attacking = target.id;
    const safeSpeed = player.stats?.speed || 1;
    player.nextAttackTime = Date.now() + (1000 / safeSpeed);
    game.logEvent(`${player.name} joined the attack on ${target.id}.`);
    game.updateWorldState();
    return true;
}

/**
 * Stops combat for a player
 */
function stopCombat(game, player) {
    if (!player) return;
    
    if (player.attacking) {
        const oldTarget = game.findEntityById(player.attacking);
        if (oldTarget && oldTarget.attackers) {
            oldTarget.attackers = oldTarget.attackers.filter(id => id !== player.id);
        }
        player.attacking = null;
    }
    
    if (player.attackingPlayer) {
        player.attackingPlayer = null;
    }
}

/**
 * Handles logic when a target is defeated in combat
 */
function handleTargetDefeated(game, killer, target) {
    const bossText = target.isBoss ? ' (BOSS)' : '';
    const bossClass = target.isBoss ? 'text-red-500' : '';
    game.logEvent(`${killer.name || killer.id} defeated ${target.name || target.id}${bossText}!`);

    if (target.type === CONFIG.ENTITY_TYPES.PLAYER) {
        handlePlayerDefeated(game, target);
    } else if (target.type === CONFIG.ENTITY_TYPES.MOB) {
        handleMobDefeated(game, target);
    }

    const allAttackers = target.attackers ? [...target.attackers] : [];
    allAttackers.forEach(attackerId => {
        const attacker = game.findPlayerById(attackerId);
        if (attacker) stopCombat(game, attacker);
    });

    if (target.type === CONFIG.ENTITY_TYPES.PLAYER) {
        stopCombat(game, target);
    }
}

/**
 * Handles logic when a player is defeated
 */
function handlePlayerDefeated(game, player) {
    player.isDead = true;
    // Ensure stats exist
    if (!player.stats) player.stats = {};
    player.stats.hp = 0;
    game.stopCombat(player);
}

/**
 * Handles logic when a mob is defeated
 */
function handleMobDefeated(game, mob) {
    const attackersAtTimeOfDeath = [...mob.attackers];
    
    // Find the enemy template
    const template = CONFIG.ENEMY_TEMPLATES.find(t => t.name === mob.name);
    
    if (template) {
        if (template.drops) {
            distributeDrops(game, attackersAtTimeOfDeath, template.drops, mob);
        }

        // Grant XP for weakness
        if (template.weakness && template.weaknessXp > 0) {
            attackersAtTimeOfDeath.forEach(attackerId => {
                const p = game.findPlayerById(attackerId);
                if (p && p.skills && p.skills[template.weakness]) {
                    p.skills[template.weakness].exp += template.weaknessXp;
                    game.logEvent(`You gained ${template.weaknessXp} ${template.weakness} XP.`, game.getClientByPlayerId(p.id));
                }
            });
        }
    }
    
    // Mark mob for respawn instead of immediately respawning
    mob.level++;
    mob.stats.hp = 0; // Set HP to 0 to indicate it's defeated
    mob.respawnUntil = Date.now() + CONFIG.ENEMY_RESPAWN_TIME;
    mob.attackers = []; // Clear attackers
    mob.nextAttackTime = Date.now(); // Reset attack timestamp
    
    // Log the defeat
    game.logEvent(`${mob.name} has been defeated!`);
    
    // Update world state to reflect the change
    game.updateWorldState();
}

/**
 * Distributes drops to all attackers based on damage dealt
 */
function distributeDrops(game, attackers, drops, mob) {
    const { calculateDropQuantity } = require('./utils');
    
    // Calculate total damage dealt by all attackers
    const totalDamage = attackers.reduce((total, attackerId) => {
        const attacker = game.findPlayerById(attackerId);
        if (attacker && attacker.damageDealt) {
            // Sum damage from all mobs for this attacker
            return total + Object.values(attacker.damageDealt).reduce((sum, damage) => sum + (damage || 0), 0);
        }
        return total;
    }, 0);
    
    drops.forEach(drop => {
        attackers.forEach(attackerId => {
            const p = game.findPlayerById(attackerId);
            if (p && !p.isDead && p.damageDealt) {
                // Calculate drop chance based on damage percentage
                const attackerDamage = Object.values(p.damageDealt).reduce((sum, damage) => sum + (damage || 0), 0);
                const damagePercentage = totalDamage > 0 ? attackerDamage / totalDamage : 0;
                const adjustedDropChance = drop.chance * mob.level * damagePercentage;
                
                // Roll for drop based on adjusted chance
                if (Math.random() < adjustedDropChance) {
                    const quantity = calculateDropQuantity(drop);
                    // Ensure inventory exists
                    if (!p.inventory) p.inventory = [];
                    let item = p.inventory.find(i => i.name === drop.name);
                    if (item && item.quantity !== undefined && drop.type !== 'equipment') {
                        item.quantity += quantity;
                    } else {
                        const newItem = { ...drop, quantity };
                        if (newItem.type === 'equipment') {
                            newItem.enhancementSlots = 0;
                            while (Math.random() < 0.5) {
                                newItem.enhancementSlots++;
                            }
                            newItem.enchantments = [];
                        }
                        p.inventory.push(newItem);
                    }
                    game.logEvent(`${p.name} received ${quantity}x ${drop.name}! (${(damagePercentage * 100).toFixed(1)}% damage)`, game.getClientByPlayerId(p.id));
                }
            }
        });
    });
    
    // Reset damage tracking for all attackers
    attackers.forEach(attackerId => {
        const attacker = game.findPlayerById(attackerId);
        if (attacker) {
            attacker.damageDealt = {};
        }
    });
}

module.exports = {
    startCombat,
    startPvPCombat,
    startPvECombat,
    stopCombat,
    handleTargetDefeated,
    handlePlayerDefeated,
    handleMobDefeated,
    distributeDrops
};