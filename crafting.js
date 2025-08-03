// Crafting-related functions for the game

const { CONFIG } = require('./config');

/**
 * Crafts an item using a recipe at a specific building (adds to queue)
 */
function craftItem(game, playerId, buildingIndex, recipeId) {
    const player = game.findPlayerById(playerId);
    const client = game.getClientByPlayerId(playerId);
    
    if (!player || player.isDead) {
        game.logEvent("You cannot craft while dead.", client);
        return false;
    }

    // Find the construction site at player's location
    const site = game.state.world[player.y][player.x].objects.find(o => 
        o.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE && o.team === player.team
    );

    if (!site) {
        game.logEvent("You must be at your team's construction site to craft.", client);
        return false;
    }

    // Check if the building exists
    if (!site.buildings || buildingIndex >= site.buildings.length) {
        game.logEvent("Building not found.", client);
        return false;
    }

    const building = site.buildings[buildingIndex];
    if (building.type !== 'crafting') {
        game.logEvent("This building cannot be used for crafting.", client);
        return false;
    }

    // Find the recipe
    const recipe = game.state.craftingRecipes.find(r => r.id === recipeId);
    if (!recipe) {
        game.logEvent("Recipe not found.", client);
        return false;
    }

    // Check if this building can craft this recipe
    if (!building.recipeIds || !building.recipeIds.includes(recipeId)) {
        game.logEvent("This building cannot craft that recipe.", client);
        return false;
    }

    // Check if player has all required materials
    const missingMaterials = [];
    for (const material of recipe.materials) {
        const playerItem = player.inventory.find(item => item.name === material.name);
        if (!playerItem || playerItem.quantity < material.quantity) {
            missingMaterials.push(`${material.quantity}x ${material.name}`);
        }
    }

    if (missingMaterials.length > 0) {
        game.logEvent(`Missing materials: ${missingMaterials.join(', ')}`, client);
        return false;
    }

    // Initialize crafting queue if it doesn't exist
    if (!building.craftingQueue) {
        building.craftingQueue = [];
    }

    if (building.craftingQueue.length >= building.slots) {
        game.logEvent("Crafting queue is full.", client);
        return false;
    }

    // Consume materials immediately
    for (const material of recipe.materials) {
        const playerItem = player.inventory.find(item => item.name === material.name);
        playerItem.quantity -= material.quantity;
        
        // Remove item if quantity reaches 0
        if (playerItem.quantity <= 0) {
            player.inventory = player.inventory.filter(item => item.name !== material.name);
        }
    }

    // Add crafting task to queue
    const now = Date.now();
    const completionTime = building.craftingQueue.length === 0 ? 
        now + recipe.craftingTime : 
        building.craftingQueue[building.craftingQueue.length - 1].completionTime + recipe.craftingTime;
    
    const craftingTask = {
        id: `craft_${now}_${Math.random().toString(36).substr(2, 9)}`,
        playerId: playerId,
        playerName: player.name,
        recipeId: recipeId,
        recipeName: recipe.name,
        startTime: now,
        completionTime: completionTime,
        craftingTime: recipe.craftingTime,
        completed: false
    };

    building.craftingQueue.push(craftingTask);
    game.logEvent(`${player.name} started crafting ${recipe.name}!`, client);
    
    // Update world state
    game.updateWorldState();
    return true;
}

/**
 * Processes crafting queues for all buildings using timestamps
 */
function processCraftingQueues(game) {
    let stateChanged = false;
    const now = Date.now();
    
    game.state.objects.forEach(obj => {
        if (obj.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE && obj.buildings) {
            obj.buildings.forEach(building => {
                if (building.type === 'crafting' && building.craftingQueue && building.craftingQueue.length > 0) {
                    const currentTask = building.craftingQueue[0];
                    
                    // Check if the current task should be completed based on timestamp
                    if (currentTask.completionTime && now >= currentTask.completionTime) {
                        // Task completed
                        currentTask.completed = true;
                        
                        // Find the recipe
                        const recipe = game.state.craftingRecipes.find(r => r.id === currentTask.recipeId);
                        if (recipe) {
                            // Find the player
                            const player = game.findPlayerById(currentTask.playerId);
                            if (player) {
                                // Create the crafted item
                                const craftedItem = {
                                    ...recipe.result,
                                    quantity: 1
                                };

                                // Enchantment slot logic
                                if (craftedItem.type === 'equipment') {
                                    craftedItem.enhancementSlots = 0;
                                    while (Math.random() < 0.5) {
                                        craftedItem.enhancementSlots++;
                                    }
                                    craftedItem.enchantments = [];
                                }

                                // Add to player inventory
                                if (craftedItem.type === 'equipment') {
                                    player.inventory.push(craftedItem);
                                } else {
                                    const existingItem = player.inventory.find(item => 
                                        item.name === craftedItem.name && 
                                        item.type === craftedItem.type &&
                                        item.level === craftedItem.level &&
                                        item.quality === craftedItem.quality
                                    );

                                    if (existingItem && existingItem.quantity !== undefined) {
                                        existingItem.quantity += 1;
                                    } else {
                                        player.inventory.push(craftedItem);
                                    }
                                }

                                // Notify player
                                const client = game.getClientByPlayerId(currentTask.playerId);
                                game.logEvent(`${currentTask.playerName} completed crafting ${recipe.name}!`, client);
                                stateChanged = true;
                            }
                        }
                    }
                    
                    // If task is completed, remove it and start next one
                    if (currentTask.completed) {
                        building.craftingQueue.shift();
                        if (building.craftingQueue.length > 0) {
                            // Start next task with timestamp
                            const nextTask = building.craftingQueue[0];
                            nextTask.startTime = now;
                            nextTask.completionTime = now + nextTask.craftingTime;
                            nextTask.completed = false;
                            
                            const client = game.getClientByPlayerId(nextTask.playerId);
                            game.logEvent(`${nextTask.playerName} started crafting ${nextTask.recipeName}!`, client);
                            stateChanged = true;
                        }
                    }
                }
            });
        }
    });
    
    return stateChanged;
}

/**
 * Gets available recipes for a specific building
 */
function getAvailableRecipes(game, building) {
    if (!building.recipeIds) return [];
    
    return game.state.craftingRecipes.filter(recipe => 
        building.recipeIds.includes(recipe.id)
    );
}

/**
 * Checks if a player can craft a specific recipe
 */
function canCraftRecipe(game, player, recipe) {
    for (const material of recipe.materials) {
        const playerItem = player.inventory.find(item => item.name === material.name);
        if (!playerItem || playerItem.quantity < material.quantity) {
            return false;
        }
    }
    return true;
}

/**
 * Gets the current progress of a crafting task (0-1)
 */
function getCraftingProgress(task) {
    if (!task.completionTime || !task.startTime) return 0;
    
    const now = Date.now();
    const elapsed = now - task.startTime;
    const total = task.completionTime - task.startTime;
    
    return Math.min(Math.max(elapsed / total, 0), 1);
}

/**
 * Gets the remaining time for a crafting task in milliseconds
 */
function getCraftingRemainingTime(task) {
    if (!task.completionTime) return 0;
    
    const now = Date.now();
    return Math.max(task.completionTime - now, 0);
}

module.exports = {
    craftItem,
    processCraftingQueues,
    getAvailableRecipes,
    canCraftRecipe,
    getCraftingProgress,
    getCraftingRemainingTime
}; 