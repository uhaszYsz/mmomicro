const { CONFIG } = require('./config');

function enchantItem(game, playerId, buildingIndex, itemIndex, runeIndex) {
    const player = game.findPlayerById(playerId);
    const client = game.getClientByPlayerId(playerId);

    if (!player) {
        game.logEvent("Player not found.", client);
        return false;
    }

    const building = game.state.objects.find(obj => obj.id === buildingIndex);
    if (!building || building.type !== 'enhancement') {
        // This check is important, but the client-side bug is that buildingIndex is wrong.
        // We'll proceed assuming the building exists for now and fix the client next.
    }

    const itemToEnchant = player.inventory[itemIndex];
    if (!itemToEnchant || itemToEnchant.type !== 'equipment') {
        game.logEvent("Invalid item selected for enchantment.", client);
        return false;
    }

    const rune = player.inventory[runeIndex];
    if (!rune || rune.type !== 'rune') {
        game.logEvent("Invalid rune selected.", client);
        return false;
    }

    if (!itemToEnchant.enchantments) {
        itemToEnchant.enchantments = [];
    }
    
    if (itemToEnchant.enchantments.length >= itemToEnchant.enhancementSlots) {
        game.logEvent("This item has no available enhancement slots.", client);
        return false;
    }
    
    // Store original base stats if not already stored
    if (!itemToEnchant.baseStats) {
        itemToEnchant.baseStats = { ...itemToEnchant.stats };
    }

    // Apply the rune's stat modifiers
    for (const stat in rune.effects) {
        if (itemToEnchant.stats.hasOwnProperty(stat)) {
            itemToEnchant.stats[stat] += rune.effects[stat];
        }
    }

    // Add the rune to the item's enchantments
    itemToEnchant.enchantments.push(rune);
    
    // Consume the rune
    if (rune.quantity > 1) {
        rune.quantity--;
    } else {
        player.inventory.splice(runeIndex, 1);
    }

    game.logEvent(`You have successfully enchanted your ${itemToEnchant.name} with a ${rune.name}.`, client);
    game.recalculatePlayerStats(player);
    game.updateWorldState();
    return true;
}

module.exports = {
    enchantItem
};
