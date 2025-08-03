// Inventory and item-related functions

/**
 * Equips an item from the player's inventory
 */
function equipItem(game, playerId, itemIndex) {
    const player = game.findPlayerById(playerId);
    if (!player) return false;
    
    const item = player.inventory[itemIndex];
    if (!item || item.type !== 'equipment' || !item.slot) return false;

    if (item.slot === 'ring') {
        // Find an empty ring slot
        const ringSlots = ['ring1', 'ring2', 'ring3'];
        const emptySlot = ringSlots.find(slot => !player.equipment[slot]);
        if (emptySlot) {
            player.equipment[emptySlot] = item;
            player.inventory.splice(itemIndex, 1);
            game.logEvent(`${player.name} equipped ${item.name}.`);
        } else {
            game.logEvent(`All ring slots are full.`);
            return false;
        }
    } else {
        if (player.equipment[item.slot]) {
            player.inventory.push(player.equipment[item.slot]);
        }
        player.equipment[item.slot] = item;
        player.inventory.splice(itemIndex, 1);
        game.logEvent(`${player.name} equipped ${item.name}.`);
    }

    game.markPlayerStatsDirty(playerId);
    game.recalculatePlayerStats(player);
    game.updateWorldState();
    return true;
}

/**
 * Unequips an item from a player's equipment slot
 */
function unequipItem(game, playerId, slot) {
    const player = game.findPlayerById(playerId);
    if (!player) return false;
    
    const item = player.equipment[slot];
    if (!item) return false;

    player.inventory.push(item);
    player.equipment[slot] = null;
    game.logEvent(`${player.name} unequipped ${item.name}.`);
    
    game.markPlayerStatsDirty(playerId);
    game.recalculatePlayerStats(player);
    game.updateWorldState();
    return true;
}

/**
 * Uses an item from the player's inventory
 */
function useItem(game, playerId, itemIndex) {
    const player = game.findPlayerById(playerId);
    const client = game.getClientByPlayerId(playerId);
    
    if (!player) return false;
    
    const item = player.inventory[itemIndex];
    if (!item) return false;

    let consumed = false;

    if (item.type === 'consumable' && item.effects?.replenish) {
        consumed = useConsumableItem(game, player, item, client);
    } else if (item.type === 'scroll' && item.effects?.buff) {
        consumed = useScrollItem(game, player, item, client);
    } else {
        game.logEvent("This item cannot be used.", client);
    }

    if (consumed) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            player.inventory.splice(itemIndex, 1);
        }
        game.markPlayerStatsDirty(playerId);
    }

    game.recalculatePlayerStats(player);
    game.updateWorldState();
    return consumed;
}

/**
 * Uses a consumable item that replenishes stats
 */
function useConsumableItem(game, player, item, client) {
    const { replenish, value } = item.effects;
    const maxStat = `max${replenish.charAt(0).toUpperCase() + replenish.slice(1)}`;
    
    // Ensure stats exist with safe defaults
    if (!player.stats) player.stats = {};
    const currentStat = player.stats[replenish] || 0;
    const maxStatValue = player.stats[maxStat] || 100;
    const amount = maxStatValue * (value / 100);
    
    player.stats[replenish] = Math.min(maxStatValue, currentStat + amount);
    game.logEvent(`${player.name} used ${item.name}, restoring ${amount.toFixed(0)} ${replenish}.`, client);
    
    return true;
}

/**
 * Uses a scroll item that applies a temporary buff
 */
function useScrollItem(game, player, item, client) {
    const { stat, percentage, duration } = item.effects.buff;
    
    player.buffs.push({
        stat,
        percentage,
        expiresAt: Date.now() + duration
    });
    
    game.logEvent(`${player.name} used ${item.name}, gaining a ${percentage}% bonus to ${stat} for ${duration/1000} seconds.`, client);
    
    return true;
}

module.exports = {
    equipItem,
    unequipItem,
    useItem,
    useConsumableItem,
    useScrollItem
};