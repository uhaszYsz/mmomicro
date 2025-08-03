// Admin commands and game configuration management

const { CONFIG } = require('./config');

/**
 * Handles admin commands for configuring the game
 */
function handleAdminCommand(game, adminId, data) {
    const admin = game.findPlayerById(adminId);
    const client = game.getClientByPlayerId(adminId);
    
    if (!admin || !admin.isAdmin) {
        game.logEvent("You do not have permission to use admin commands.", client);
        return false;
    }

    switch(data.command) {
        // --- CONFIG MANAGEMENT ---
        case 'load-config':
            return loadConfig(game, data, client);
        
        // --- ENEMY EDITOR ---
        case 'update-enemy-stats':
            return updateEnemyStats(game, data, client);
        
        case 'add-enemy-drop':
            return addEnemyDrop(game, data, client);
        
        case 'remove-enemy-drop':
            return removeEnemyDrop(game, data, client);

        // --- RECIPE EDITOR ---
        case 'recipe-create':
            return createRecipe(game, client);
        
        case 'recipe-save':
            return saveRecipe(game, data, client);
        
        case 'recipe-delete':
            return deleteRecipe(game, data, client);

        // --- BUILDING EDITOR ---
        case 'building-save':
            return saveBuilding(game, data, client);
        
        // --- WORLD MANAGEMENT ---
        case 'regenerate-map':
            return regenerateMap(game, client);
        

        
        // --- FAKE PLAYER SIMULATION ---
        case 'create-fake-players':
            return createFakePlayers(game, data, client);
        
        case 'remove-fake-players':
            return removeFakePlayers(game, data, client);
        
        case 'list-fake-players':
            return listFakePlayers(game, client);
        
        default:
            game.logEvent(`Unknown admin command: ${data.command}`, client);
            return false;
    }
}

/**
 * Loads configuration data into the game
 */
function loadConfig(game, data, client) {
    if (data.config) {
        let changes = [];
        let worldResetRequired = false;

        // Overwrite templates in the original CONFIG object as requested
        if (data.config.enemyTemplates) {
            CONFIG.ENEMY_TEMPLATES = data.config.enemyTemplates;
            game.state.enemyTemplates = CONFIG.ENEMY_TEMPLATES; // Sync state
            changes.push('Enemy Templates');
            worldResetRequired = true;
        }
        
        if (data.config.craftingRecipes) {
            CONFIG.CRAFTING_RECIPES = data.config.craftingRecipes;
            game.state.craftingRecipes = CONFIG.CRAFTING_RECIPES; // Sync state
            changes.push('Crafting Recipes');
        }
        
        if (data.config.buildingTemplates) {
            CONFIG.BUILDING_TEMPLATES = data.config.buildingTemplates;
            game.state.buildingTemplates = CONFIG.BUILDING_TEMPLATES; // Sync state
            changes.push('Building Templates');
        }
        
        if (changes.length > 0) {
            game.logEvent(`Admin updated: ${changes.join(', ')}.`, client);
        } else {
            game.logEvent(`Loaded config contained no updatable template data.`, client);
            return false;
        }

        if (worldResetRequired) {
            game.logEvent(`Enemy data changed, resetting world mobs...`);
            game.state.objects = game.state.objects.filter(o => o.type !== CONFIG.ENTITY_TYPES.MOB);
            game.initializeEnemies();
        }
        
        game.logEvent(`Configuration load complete.`);
        return true;
    } else {
        game.logEvent("No configuration data provided.", client);
        return false;
    }
}

/**
 * Updates stats for an enemy template
 */
function updateEnemyStats(game, data, client) {
    const template = game.state.enemyTemplates[data.templateId];
    if (!template) { 
        game.logEvent("Enemy template not found.", client); 
        return false; 
    }

    if (data.stats.rarity !== undefined) {
        template.rarity = data.stats.rarity;
        delete data.stats.rarity;
    }

    Object.assign(template.baseStats, data.stats); 

    game.state.objects.forEach(obj => {
        if (obj.type === CONFIG.ENTITY_TYPES.MOB && obj.templateId == data.templateId) {
            obj.baseStats = { ...template.baseStats };
            game.scaleEnemyStats(obj);
        }
    });
    
    game.logEvent(`Admin updated stats for ${template.name}.`, client);
    game.updateWorldState();
    return true;
}

/**
 * Adds a drop to an enemy template
 */
function addEnemyDrop(game, data, client) {
    const template = game.state.enemyTemplates[data.templateId];
    if (!template) { 
        game.logEvent("Enemy template not found.", client); 
        return false; 
    }
    
    template.drops.push(data.drop);
    game.logEvent(`Admin added a new drop to ${template.name}.`, client);
    game.updateWorldState();
    return true;
}

/**
 * Removes a drop from an enemy template
 */
function removeEnemyDrop(game, data, client) {
    const template = game.state.enemyTemplates[data.templateId];
    if (template && template.drops[data.dropIndex]) {
        template.drops.splice(data.dropIndex, 1);
        game.logEvent(`Admin removed a drop from ${template.name}.`, client);
        game.updateWorldState();
        return true;
    }
    return false;
}

/**
 * Creates a new crafting recipe
 */
function createRecipe(game, client) {
    const newId = game.state.craftingRecipes.length > 0 
        ? Math.max(...game.state.craftingRecipes.map(r => r.id)) + 1 
        : 0;
        
    const newRecipe = {
        id: newId,
        name: "New Recipe",
        materials: [{ name: "Brick", quantity: 1 }],
        result: { name: "New Item", type: "material", description: "A newly created item." }
    };
    
    game.state.craftingRecipes.push(newRecipe);
    game.logEvent(`Admin created a new recipe: ${newRecipe.name}.`, client);
    game.updateWorldState();
    return true;
}

/**
 * Saves changes to a crafting recipe
 */
function saveRecipe(game, data, client) {
    if (data.recipeData) {
        const recipeIndex = game.state.craftingRecipes.findIndex(r => r.id === data.recipeData.id);
        if (recipeIndex !== -1) {
            game.state.craftingRecipes[recipeIndex] = data.recipeData;
            game.logEvent(`Admin saved recipe: ${data.recipeData.name}.`, client);
            game.updateWorldState();
            return true;
        }
    }
    return false;
}

/**
 * Deletes a crafting recipe and removes references to it
 */
function deleteRecipe(game, data, client) {
    if (data.recipeId !== null) {
        const recipeName = game.state.craftingRecipes.find(r => r.id === data.recipeId)?.name || `ID: ${data.recipeId}`;
        
        // Remove recipe from list
        game.state.craftingRecipes = game.state.craftingRecipes.filter(r => r.id !== data.recipeId);
        
        // Remove references to this recipe from buildings
        Object.values(game.state.buildingTemplates).forEach(b => {
            if (b.recipeIds) {
                b.recipeIds = b.recipeIds.filter(id => id !== data.recipeId);
            }
        });
        
        game.logEvent(`Admin deleted recipe: ${recipeName}.`, client);
        game.updateWorldState();
        return true;
    }
    return false;
}

/**
 * Saves building configuration
 */
function saveBuilding(game, data, client) {
    if (data.buildingName && game.state.buildingTemplates[data.buildingName]) {
        game.state.buildingTemplates[data.buildingName].recipeIds = data.recipeIds || [];
        game.logEvent(`Admin updated recipes for ${data.buildingName}.`, client);
        game.updateWorldState();
        return true;
    }
    return false;
}

/**
 * Regenerates the world map with new biome distribution
 */
function regenerateMap(game, client) {
    // Clear all existing enemies
    game.state.objects = game.state.objects.filter(o => o.type !== CONFIG.ENTITY_TYPES.MOB);
    
    // Regenerate biome map
    const biomeSystem = require('./biomes.js');
    game.state.biomeMap = biomeSystem.generateBiomeMap();
    
    // Respawn enemies based on new biomes
    biomeSystem.spawnBiomeEnemies(game, game.state.biomeMap);
    
    game.logEvent(`Admin has regenerated the world map with new biome distribution.`, client);
    game.logEvent(`All enemies have been respawned across the new biomes.`, client);
    game.updateWorldState();
    return true;
}



// ===================================================================================
// --- FAKE PLAYER SIMULATION FUNCTIONS ---
// ===================================================================================

function createFakePlayers(game, data, client) {
    const count = parseInt(data.count) || 1;
    const maxCount = Math.min(count, 100); // Limit to 100 fake players max
    
    if (!game.fakePlayers) {
        game.fakePlayers = [];
    }
    
    const fakePlayerNames = [
        'Bot_Alpha', 'Bot_Beta', 'Bot_Gamma', 'Bot_Delta', 'Bot_Epsilon',
        'Bot_Zeta', 'Bot_Eta', 'Bot_Theta', 'Bot_Iota', 'Bot_Kappa',
        'Bot_Lambda', 'Bot_Mu', 'Bot_Nu', 'Bot_Xi', 'Bot_Omicron',
        'Bot_Pi', 'Bot_Rho', 'Bot_Sigma', 'Bot_Tau', 'Bot_Upsilon',
        'Bot_Phi', 'Bot_Chi', 'Bot_Psi', 'Bot_Omega', 'Bot_Prime',
        'Bot_Second', 'Bot_Third', 'Bot_Fourth', 'Bot_Fifth', 'Bot_Sixth'
    ];
    
    let created = 0;
    for (let i = 0; i < maxCount; i++) {
        const fakePlayerId = `fake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const nameIndex = (game.fakePlayers.length + i) % fakePlayerNames.length;
        const name = `${fakePlayerNames[nameIndex]}_${game.fakePlayers.length + i + 1}`;
        
        const fakePlayer = {
            id: fakePlayerId,
            name: name,
            isFake: true,
            isOnline: true,
            isDead: false,
            level: Math.floor(Math.random() * 10) + 1,
            x: Math.floor(Math.random() * CONFIG.MAP_SIZE),
            y: Math.floor(Math.random() * CONFIG.MAP_SIZE),
            team: game.state.noobsTeamId,
            stats: {
                hp: 100,
                maxHp: 100,
                mp: 50,
                maxMp: 50,
                stamina: 100,
                maxStamina: 100,
                dmg: Math.floor(Math.random() * 20) + 10,
                speed: Math.random() * 2 + 1,
                critical: Math.random() * 10,
                dodge: Math.random() * 10
            },
            inventory: [],
            equipment: {},
            skills: {},
            buffs: [],
            damageDealt: {},
            lastAction: Date.now(),
            actionInterval: Math.random() * 5000 + 2000 // Random action every 2-7 seconds
        };
        
        game.fakePlayers.push(fakePlayer);
        game.state.players.push(fakePlayer);
        game.addEntityToLookup(fakePlayer);
        
        // Add to world cell
        const cell = game.state.world[fakePlayer.y][fakePlayer.x];
        cell.players.push(fakePlayer.id);
        
        created++;
    }
    
    game.logEvent(`Created ${created} fake players. Total fake players: ${game.fakePlayers.length}`, client);
    game.updateWorldState();
    return true;
}

function removeFakePlayers(game, data, client) {
    const count = parseInt(data.count) || game.fakePlayers.length;
    
    if (!game.fakePlayers || game.fakePlayers.length === 0) {
        game.logEvent("No fake players to remove.", client);
        return true;
    }
    
    const toRemove = Math.min(count, game.fakePlayers.length);
    const removed = [];
    
    for (let i = 0; i < toRemove; i++) {
        const fakePlayer = game.fakePlayers.pop();
        if (fakePlayer) {
            // Remove from players array
            const playerIndex = game.state.players.findIndex(p => p.id === fakePlayer.id);
            if (playerIndex !== -1) {
                game.state.players.splice(playerIndex, 1);
            }
            
            // Remove from entity lookup
            game.removeEntityFromLookup(fakePlayer.id);
            
            // Remove from world cell
            const cell = game.state.world[fakePlayer.y][fakePlayer.x];
            if (cell) {
                const cellIndex = cell.players.indexOf(fakePlayer.id);
                if (cellIndex !== -1) {
                    cell.players.splice(cellIndex, 1);
                }
            }
            
            removed.push(fakePlayer.name);
        }
    }
    
    game.logEvent(`Removed ${removed.length} fake players: ${removed.join(', ')}`, client);
    game.updateWorldState();
    return true;
}

function listFakePlayers(game, client) {
    if (!game.fakePlayers || game.fakePlayers.length === 0) {
        game.logEvent("No fake players currently active.", client);
        return true;
    }
    
    game.logEvent(`Active fake players (${game.fakePlayers.length}):`, client);
    game.fakePlayers.forEach((player, index) => {
        game.logEvent(`  ${index + 1}. ${player.name} (Level ${player.level}) at (${player.x}, ${player.y})`, client);
    });
    return true;
}

module.exports = {
    handleAdminCommand,
    loadConfig,
    updateEnemyStats,
    addEnemyDrop,
    removeEnemyDrop,
    createRecipe,
    saveRecipe,
    deleteRecipe,
    saveBuilding,
    regenerateMap,
    createFakePlayers,
    removeFakePlayers,
    listFakePlayers
};