// Construction-related functions

const { CONFIG } = require('./config');

/**
 * Creates a new construction site
 */
function buildConstructionSite(game, playerId) {
    const player = game.findPlayerById(playerId);
    const client = game.getClientByPlayerId(playerId);
    
    if (!player || player.isDead || !player.team) {
        game.logEvent("You must be in a team to build.", client);
        return false;
    }
    
    if (player.team === CONFIG.DEFAULT_TEAM_ID) {
        game.logEvent("The Noobs team cannot build construction sites.", client);
        return false;
    }
    
    const { x, y } = player;
    const cell = game.state.world[y][x];

    if (cell.objects.some(o => o.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE)) {
        game.logEvent("A construction site already exists here.", client);
        return false;
    }

    const siteId = `site_t${player.team}_${x}_${y}`;
    const constructionSite = {
        id: siteId, x, y, level: 1,
        stats: { 
            hp: CONFIG.CONSTRUCTION_BASE_HP, 
            maxHp: CONFIG.CONSTRUCTION_BASE_HP, 
            dmg: 0, 
            speed: 0 
        },
        type: CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE, 
        team: player.team,
        materials: { bricks: 0 },
        requiredMaterials: { bricks: CONFIG.CONSTRUCTION_BASE_BRICKS_REQUIRED },
        constructionCompleteUntil: null,
        buildings: [],
        attackers: [],
        maxAttackers: CONFIG.MAX_ATTACKERS
    };
    
    // Add to game state objects
    game.state.objects.push(constructionSite);
    
    // Add to world grid so clients can see it
    game.state.world[y][x].objects.push(constructionSite);
    
    game.logEvent(`${player.name} started a construction site at (${x}, ${y}).`);
    game.updateWorldState();
    
    // Broadcast construction update to all clients
    game.broadcast({ 
        type: 'constructionUpdate', 
        sites: [{ x: x, y: y, team: player.team }]
    });
    
    return true;
}

/**
 * Adds a building to a construction site
 */
function buildBuilding(game, playerId, buildingName) {
    const player = game.findPlayerById(playerId);
    const client = game.getClientByPlayerId(playerId);
    
    if (!player) return false;

    const site = game.state.world[player.y][player.x].objects.find(o => 
        o.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE && o.team === player.team
    );

    if (!site) {
        game.logEvent("You must be at your team's construction site to build.", client);
        return false;
    }

    const buildingTemplate = game.state.buildingTemplates[buildingName];
    if (!buildingTemplate) {
        game.logEvent(`Building '${buildingName}' does not exist.`, client);
        return false;
    }
    
    const brickItem = player.inventory.find(item => item.name === '🧱 Brick');
    const requiredBricks = buildingTemplate.bricks;

    if (!brickItem || brickItem.quantity < requiredBricks) {
        game.logEvent(`You need ${requiredBricks} bricks to build a ${buildingName}.`, client);
        return false;
    }

    brickItem.quantity -= requiredBricks;
    if (brickItem.quantity <= 0) {
        player.inventory = player.inventory.filter(item => item.name !== '🧱 Brick');
    }

    const newBuilding = {
        name: buildingName,
        level: 1,
        type: buildingTemplate.type,
        donations: {},
        upgradeRequirements: null
    };

    // Set initial upgrade requirements
    const upgradeConfig = CONFIG.BUILDING_UPGRADE_REQUIREMENTS[buildingName];
    if (upgradeConfig) {
        const nextLevelReq = upgradeConfig.find(req => req.level === newBuilding.level + 1);
        if (nextLevelReq) {
            newBuilding.upgradeRequirements = nextLevelReq;
            nextLevelReq.materials.forEach(mat => {
                newBuilding.donations[mat.name] = 0;
            });
        }
    }

    // Initialize storage for new buildings
    if (newBuilding.type === 'storage') {
        newBuilding.inventory = [];
        newBuilding.log = [];
        newBuilding.slots = buildingTemplate.baseSlots || 0;
    } else if (newBuilding.type === 'personal_storage') {
        newBuilding.playerInventories = {};
        newBuilding.slots = buildingTemplate.baseSlots || 0;
    } else if (newBuilding.type === 'crafting') {
        newBuilding.recipeIds = buildingTemplate.recipeIds || [];
        newBuilding.slots = buildingTemplate.baseSlots || 0;
    }

    site.buildings.push(newBuilding);
    game.logEvent(`${player.name} built a new ${buildingName} at the construction site!`);
    game.updateWorldState();
    return true;
}

/**
 * Donates bricks to a construction site
 */
function donateToSite(game, playerId) {
    const player = game.findPlayerById(playerId);
    if (!player) return false;

    const site = game.state.world[player.y][player.x].objects.find(o => 
        o.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE && o.team === player.team
    );

    if (!site) {
        game.logEvent("No friendly construction site in this area.", game.getClientByPlayerId(playerId));
        return false;
    }

    const brickItem = player.inventory.find(item => item.name === '🧱 Brick');
    if (!brickItem || brickItem.quantity <= 0) {
        game.logEvent("No bricks to donate.", game.getClientByPlayerId(playerId));
        return false;
    }

    const needed = site.requiredMaterials.bricks - site.materials.bricks;
    const toDonate = Math.min(brickItem.quantity, needed);
    
    if (toDonate <= 0) {
        game.logEvent("Site does not need more bricks for the current upgrade.", game.getClientByPlayerId(playerId));
        return false;
    }

    brickItem.quantity -= toDonate;
    site.materials.bricks += toDonate;
    game.logEvent(`${player.name} donated ${toDonate} bricks.`);

    if (site.materials.bricks >= site.requiredMaterials.bricks) {
        const timeAdded = site.requiredMaterials.bricks * CONFIG.CONSTRUCTION_TIME_PER_BRICK;
        const now = Date.now();
        const currentEndTime = site.constructionCompleteUntil && site.constructionCompleteUntil > now 
            ? site.constructionCompleteUntil 
            : now;
        
        site.constructionCompleteUntil = currentEndTime + timeAdded;
        game.logEvent(`Construction for next level has begun! Time remaining: ${Math.ceil((site.constructionCompleteUntil - now) / 1000)}s`);
    }

    if (brickItem.quantity <= 0) {
        player.inventory = player.inventory.filter(item => item.name !== '🧱 Brick');
    }
    
    game.updateWorldState();
    return true;
}

function donateToBuilding(game, playerId, buildingIndex, itemIndex, quantity) {
    const player = game.findPlayerById(playerId);
    const client = game.getClientByPlayerId(playerId);

    if (!player) return false;

    const site = game.state.world[player.y][player.x].objects.find(o => 
        o.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE && o.team === player.team
    );

    if (!site || !site.buildings[buildingIndex]) {
        game.logEvent("Building not found.", client);
        return false;
    }

    const building = site.buildings[buildingIndex];
    const itemToDonate = player.inventory[itemIndex];

    if (!itemToDonate || quantity <= 0 || itemToDonate.quantity < quantity) {
        game.logEvent("Invalid item or quantity.", client);
        return false;
    }

    const requirement = building.upgradeRequirements?.materials.find(m => m.name === itemToDonate.name);

    if (!requirement) {
        game.logEvent("This item is not needed for the current upgrade.", client);
        return false;
    }

    const needed = requirement.quantity - (building.donations[itemToDonate.name] || 0);
    const amountToDonate = Math.min(quantity, needed);

    if (amountToDonate <= 0) {
        game.logEvent("No more of this item is needed.", client);
        return false;
    }

    itemToDonate.quantity -= amountToDonate;
    if (itemToDonate.quantity <= 0) {
        player.inventory.splice(itemIndex, 1);
    }

    building.donations[itemToDonate.name] = (building.donations[itemToDonate.name] || 0) + amountToDonate;

    game.logEvent(`${player.name} donated ${amountToDonate} ${itemToDonate.name} to the ${building.name}.`);

    // Check for level up
    const readyForUpgrade = building.upgradeRequirements.materials.every(mat => 
        (building.donations[mat.name] || 0) >= mat.quantity
    );

    if (readyForUpgrade) {
        building.level++;
        game.logEvent(`${building.name} has been upgraded to Level ${building.level}!`);

        // Handle Personal Storage upgrade
        if (building.type === 'personal_storage') {
            const slotsGained = 10 * (building.level - 1);
            building.slots += slotsGained;
            // Notify all players in the team
            const team = game.state.teams[site.team];
            if(team) {
                team.members.forEach(memberId => {
                    const client = game.getClientByPlayerId(memberId);
                    if (client) {
                        game.logEvent(`A ${building.name} in your team's castle has been upgraded to Level ${building.level}, and now has ${building.slots} slots.`, client);
                    }
                });
            }
        }

        // Handle Storage upgrade
        if (building.type === 'storage') {
            const slotsGained = 25 * (building.level - 1);
            building.slots += slotsGained;
            // Notify all players in the team
            const team = game.state.teams[site.team];
            if(team) {
                team.members.forEach(memberId => {
                    const client = game.getClientByPlayerId(memberId);
                    if (client) {
                        game.logEvent(`A ${building.name} in your team's castle has been upgraded to Level ${building.level}, and now has ${building.slots} slots.`, client);
                    }
                });
            }
        }

        // Handle Crafting Workshop upgrade
        if (building.type === 'crafting') {
            const slotsGained = 3 * building.level;
            building.slots += slotsGained;
            // Notify all players in the team
            const team = game.state.teams[site.team];
            if(team) {
                team.members.forEach(memberId => {
                    const client = game.getClientByPlayerId(memberId);
                    if (client) {
                        game.logEvent(`A ${building.name} in your team's castle has been upgraded to Level ${building.level}, and now has ${building.slots} crafting slots.`, client);
                    }
                });
            }
        }
        
        // Reset donations for next level
        building.donations = {};
        const upgradeConfig = CONFIG.BUILDING_UPGRADE_REQUIREMENTS[building.name];
        if (upgradeConfig) {
            const nextLevelReq = upgradeConfig.find(req => req.level === building.level + 1);
            if (nextLevelReq) {
                building.upgradeRequirements = nextLevelReq;
                nextLevelReq.materials.forEach(mat => {
                    building.donations[mat.name] = 0;
                });
            } else {
                building.upgradeRequirements = null; // Max level reached
            }
        }
    }

    game.updateWorldState();
    return true;
}

/**
 * Deploys a siege machine to attack an enemy construction site
 */
function deploySiegeMachine(game, playerId) {
    const player = game.findPlayerById(playerId);
    const client = game.getClientByPlayerId(playerId);
    
    if (!player || !player.team) {
        game.logEvent("You must be in a team to deploy siege engines.", client);
        return false;
    }
    
    const enemySite = game.state.world[player.y][player.x].objects.find(o => 
        o.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE && o.team !== player.team
    );
    
    if (!enemySite) { 
        game.logEvent("There is no enemy construction site here to attack.", client); 
        return false; 
    }

    // Check if there are any defenders from the enemy team in this cell
    const cell = game.state.world[player.y][player.x];
    const defendingTeamId = enemySite.team;
    const isDefenderPresent = cell.players.some(pId => {
        const p = game.findPlayerById(pId);
        return p && p.team === defendingTeamId;
    });

    if (isDefenderPresent) {
        game.logEvent("You cannot deploy a siege engine while defenders are present.", client);
        return false;
    }

    const brickItem = player.inventory.find(item => item.name === '🧱 Brick');
    if (!brickItem || brickItem.quantity < CONFIG.SIEGE_MACHINE_COST) { 
        game.logEvent(`You need ${CONFIG.SIEGE_MACHINE_COST} bricks to deploy a siege machine.`, client); 
        return false; 
    }

    brickItem.quantity -= CONFIG.SIEGE_MACHINE_COST;
    if (brickItem.quantity <= 0) {
        player.inventory = player.inventory.filter(item => item.name !== '🧱 Brick');
    }

    const newMachineId = `siege_${player.team}_${Date.now()}`;
    const siegeMachine = {
        id: newMachineId, 
        x: player.x, 
        y: player.y, 
        team: player.team,
        type: CONFIG.ENTITY_TYPES.SIEGE_MACHINE,
        stats: { 
            hp: CONFIG.SIEGE_MACHINE_HP, 
            maxHp: CONFIG.SIEGE_MACHINE_HP, 
            dmg: CONFIG.SIEGE_MACHINE_DAMAGE, 
            selfDmg: CONFIG.SIEGE_MACHINE_SELF_DAMAGE 
        },
        targetId: enemySite.id,
        nextAttackTime: Date.now() + 1000,
    };
    
    // Add to game state objects
    game.state.objects.push(siegeMachine);
    
    // Add to world grid so clients can see it
    game.state.world[player.y][player.x].objects.push(siegeMachine);
    
    game.logEvent(`${player.name} deployed a siege machine!`);
    game.updateWorldState();
    return true;
}

module.exports = {
    buildConstructionSite,
    buildBuilding,
    donateToSite,
    donateToBuilding,
    deploySiegeMachine
};