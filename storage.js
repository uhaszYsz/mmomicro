// Storage-related functions for the game

const { CONFIG } = require('./config');

/**
 * Deposits an item to storage (team or personal)
 */
function depositToStorage(game, playerId, buildingIndex, itemIndex, storageType, quantity = 1) {
    const player = game.findPlayerById(playerId);
    const client = game.getClientByPlayerId(playerId);
    
    if (!player || player.isDead) {
        game.logEvent("You cannot use storage while dead.", client);
        return false;
    }

    // Find the construction site at player's location
    const site = game.state.world[player.y][player.x].objects.find(o => 
        o.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE && o.team === player.team
    );

    if (!site) {
        game.logEvent("You must be at your team's construction site to use storage.", client);
        return false;
    }

    // Check if the building exists
    if (!site.buildings || buildingIndex >= site.buildings.length) {
        game.logEvent("Building not found.", client);
        return false;
    }

    const building = site.buildings[buildingIndex];
    if (building.type !== storageType) {
        game.logEvent("This building is not a storage building.", client);
        return false;
    }

    // Check if player has the item and validate quantity
    if (!player.inventory || itemIndex >= player.inventory.length) {
        game.logEvent("Item not found in inventory.", client);
        return false;
    }

    const item = player.inventory[itemIndex];
    if (!item) {
        game.logEvent("Item not found.", client);
        return false;
    }

    // Validate quantity
    const availableQuantity = item.quantity || 1;
    if (quantity <= 0 || quantity > availableQuantity) {
        game.logEvent(`Invalid quantity. You have ${availableQuantity} of ${item.name}.`, client);
        return false;
    }

    // Handle different storage types
    if (storageType === 'storage') {
        // Team storage - all team members can access
        if (!building.inventory) building.inventory = [];
        
        const isFull = building.inventory.length >= building.slots;

        // Find if item already exists in storage for stacking
        const existingItem = building.inventory.find(storedItem => 
            storedItem.name === item.name && 
            storedItem.type === item.type &&
            storedItem.level === item.level &&
            storedItem.quality === item.quality
        );
        
        if (!existingItem && isFull) {
            game.logEvent("Team storage is full.", client);
            return false;
        }

        if (existingItem && existingItem.quantity !== undefined) {
            existingItem.quantity += quantity;
        } else {
            building.inventory.push({ ...item, quantity: quantity });
        }

        // Remove from player inventory safely
        if (availableQuantity > quantity) {
            item.quantity = availableQuantity - quantity;
        } else {
            // Remove entire item from inventory
            player.inventory.splice(itemIndex, 1);
        }

        game.logEvent(`${player.name} deposited ${quantity}x ${item.name} to team storage.`, client);

    } else if (storageType === 'personal_storage') {
        // Personal storage - only the player can access
        if (!building.playerInventories) building.playerInventories = {};
        if (!building.playerInventories[playerId]) building.playerInventories[playerId] = [];
        
        const playerStorage = building.playerInventories[playerId];
        const isFull = playerStorage.length >= building.slots;
        
        // Find if item already exists in storage for stacking
        const existingItem = playerStorage.find(storedItem => 
            storedItem.name === item.name && 
            storedItem.type === item.type &&
            storedItem.level === item.level &&
            storedItem.quality === item.quality
        );
        
        if (!existingItem && isFull) {
            game.logEvent("Personal storage is full.", client);
            return false;
        }

        if (existingItem && existingItem.quantity !== undefined) {
            existingItem.quantity += quantity;
        } else {
            playerStorage.push({ ...item, quantity: quantity });
        }

        // Remove from player inventory safely
        if (availableQuantity > quantity) {
            item.quantity = availableQuantity - quantity;
        } else {
            // Remove entire item from inventory
            player.inventory.splice(itemIndex, 1);
        }

        game.logEvent(`${player.name} deposited ${quantity}x ${item.name} to personal storage.`, client);
    }

    game.updateWorldState();
    return true;
}

/**
 * Withdraws an item from storage (team or personal)
 */
function withdrawFromStorage(game, playerId, buildingIndex, itemIndex, storageType) {
    const player = game.findPlayerById(playerId);
    const client = game.getClientByPlayerId(playerId);
    
    if (!player || player.isDead) {
        game.logEvent("You cannot use storage while dead.", client);
        return false;
    }

    // Find the construction site at player's location
    const site = game.state.world[player.y][player.x].objects.find(o => 
        o.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE && o.team === player.team
    );

    if (!site) {
        game.logEvent("You must be at your team's construction site to use storage.", client);
        return false;
    }

    // Check if the building exists
    if (!site.buildings || buildingIndex >= site.buildings.length) {
        game.logEvent("Building not found.", client);
        return false;
    }

    const building = site.buildings[buildingIndex];
    if (building.type !== storageType) {
        game.logEvent("This building is not a storage building.", client);
        return false;
    }

    // Handle different storage types
    if (storageType === 'storage') {
        // Team storage
        if (!building.inventory || itemIndex >= building.inventory.length) {
            game.logEvent("Item not found in team storage.", client);
            return false;
        }

        const item = building.inventory[itemIndex];
        if (!item) {
            game.logEvent("Item not found in team storage.", client);
            return false;
        }

        // Add to player inventory
        const existingItem = player.inventory.find(playerItem => 
            playerItem.name === item.name && 
            playerItem.type === item.type &&
            playerItem.level === item.level &&
            playerItem.quality === item.quality
        );

        if (existingItem && existingItem.quantity !== undefined) {
            existingItem.quantity += 1;
        } else {
            player.inventory.push({ ...item, quantity: 1 });
        }

        // Remove from storage
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            building.inventory.splice(itemIndex, 1);
        }

        game.logEvent(`${player.name} withdrew ${item.name} from team storage.`, client);

    } else if (storageType === 'personal_storage') {
        // Personal storage
        if (!building.playerInventories || !building.playerInventories[playerId] || itemIndex >= building.playerInventories[playerId].length) {
            game.logEvent("Item not found in personal storage.", client);
            return false;
        }

        const item = building.playerInventories[playerId][itemIndex];
        if (!item) {
            game.logEvent("Item not found in personal storage.", client);
            return false;
        }

        // Add to player inventory
        const existingItem = player.inventory.find(playerItem => 
            playerItem.name === item.name && 
            playerItem.type === item.type &&
            playerItem.level === item.level &&
            playerItem.quality === item.quality
        );

        if (existingItem && existingItem.quantity !== undefined) {
            existingItem.quantity += 1;
        } else {
            player.inventory.push({ ...item, quantity: 1 });
        }

        // Remove from storage
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            building.playerInventories[playerId].splice(itemIndex, 1);
        }

        game.logEvent(`${player.name} withdrew ${item.name} from personal storage.`, client);
    }

    game.updateWorldState();
    return true;
}

module.exports = {
    depositToStorage,
    withdrawFromStorage
}; 