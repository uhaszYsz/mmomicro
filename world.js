// World-related functions for the game

/**
 * Updates the world state by recalculating player stats and updating client states
 * OPTIMIZED: No longer clears and repopulates the entire grid every tick
 */
function updateWorldState(game) {
    // Send targeted updates to each online client
    sendUpdatesToClients(game);
}

/**
 * Initializes the world grid once at startup
 * This replaces the old clearWorldGrid and populateWorldGrid functions
 */
function initializeWorldGrid(game) {
    const CONFIG = require('./config').CONFIG;
    
    console.log('Initializing world grid...');
    let mobCount = 0;
    
    // Initialize the world grid structure
    for (let y = 0; y < CONFIG.MAP_SIZE; y++) {
        for (let x = 0; x < CONFIG.MAP_SIZE; x++) {
            game.state.world[y][x] = {
                players: [],
                objects: []
            };
        }
    }
    
    // Add all static mobs to the grid (only once)
    game.state.objects.forEach(o => {
        if (o.type === 'mob') {
            game.state.world[o.y][o.x].objects.push(o);
            mobCount++;
        }
    });
    
    game.state.worldGridInitialized = true;
    console.log(`World grid initialized: ${mobCount} static mobs placed`);
}

/**
 * Updates a player's position in the world grid
 * OPTIMIZED: Only updates the specific cells involved in the move
 */
function updatePlayerPosition(game, player, oldX, oldY, newX, newY) {
    // Remove player from old cell
    if (oldX !== undefined && oldY !== undefined) {
        const oldCell = game.state.world[oldY][oldX];
        const playerIndex = oldCell.players.findIndex(p => p.id === player.id);
        if (playerIndex !== -1) {
            oldCell.players.splice(playerIndex, 1);
        }
    }
    
    // Add player to new cell
    const newCell = game.state.world[newY][newX];
    newCell.players.push(player);
}

/**
 * Updates non-mob objects in the world grid
 * Called when objects are created, destroyed, or moved
 */
function updateObjectInGrid(game, object, oldX, oldY, newX, newY) {
    // Remove from old position if it exists
    if (oldX !== undefined && oldY !== undefined) {
        const oldCell = game.state.world[oldY][oldX];
        const objectIndex = oldCell.objects.findIndex(o => o.id === object.id);
        if (objectIndex !== -1) {
            oldCell.objects.splice(objectIndex, 1);
        }
    }
    
    // Add to new position
    const newCell = game.state.world[newY][newX];
    newCell.objects.push(object);
}

/**
 * Removes an object from the world grid
 */
function removeObjectFromGrid(game, objectId, x, y) {
    const cell = game.state.world[y][x];
    const objectIndex = cell.objects.findIndex(o => o.id === objectId);
    if (objectIndex !== -1) {
        cell.objects.splice(objectIndex, 1);
    }
}

/**
 * Updates mob respawn status in the grid
 * Called when a mob dies or respawns
 */
function updateMobInGrid(game, mob) {
    // Mobs are already in the grid, just update their stats
    // The grid maintains the mob object reference, so stats are automatically updated
    // No need to remove and re-add the mob
}

/**
 * Legacy functions for backward compatibility
 * These are now deprecated in favor of the optimized functions above
 */
function clearWorldGrid(game) {
    console.warn('clearWorldGrid is deprecated. Use initializeWorldGrid instead.');
    // This function is kept for backward compatibility but does nothing
}

function populateWorldGrid(game) {
    console.warn('populateWorldGrid is deprecated. Use initializeWorldGrid instead.');
    // This function is kept for backward compatibility but does nothing
}

/**
 * Sends state updates to all connected clients
 */
function sendUpdatesToClients(game) {
    const WebSocket = require('ws');
    const wss = game.getWss();
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.playerId) {
            const player = game.findPlayerById(client.playerId);
            if (player && player.isOnline) {
                const scopedState = getScopedStateForPlayer(game, player);
                game.sendToClient(client, { type: 'gameState', state: scopedState });
            }
        }
    });
}

/**
 * Creates a tailored state view for a specific player
 */
function getScopedStateForPlayer(game, player) {
    console.log('getScopedStateForPlayer called for player:', player ? player.name : 'null');
    
    if (!player) {
        console.log('Player is null, returning empty state');
        return { player: null, cell: { x: 0, y: 0, players: [], objects: [] } };
    }
    
    const { x, y } = player;
    const cellData = game.state.world[y][x];
    const { structuredClone } = require('./utils');

    console.log(`Player ${player.name} at position (${x}, ${y})`);
    console.log(`Cell data has ${cellData.players.length} players and ${cellData.objects.length} objects`);

    // Sanitize players in the cell before sending
    const scopedPlayers = cellData.players.map(p => game.getSanitizedPlayer(p));

    const sanitizedPlayer = game.getSanitizedPlayer(player);
    
    // --- FIX: Manually re-add isInsideCastle because getSanitizedPlayer might remove it ---
    sanitizedPlayer.isInsideCastle = player.isInsideCastle;
    scopedPlayers.forEach(p => {
        const originalPlayer = cellData.players.find(op => op.id === p.id);
        if (originalPlayer) {
            p.isInsideCastle = originalPlayer.isInsideCastle;
        }
    });

    const result = {
        player: sanitizedPlayer,
        cell: {
            x: x, y: y,
            players: scopedPlayers,
            objects: structuredClone(cellData.objects),
    
            
        },
        chatMessages: structuredClone(game.state.chatMessages),
        // Teams data is now requested separately when needed, not every tick
        // Static data is now sent once on login, not every tick
    };
    

    return result;
}

/**
 * Checks if a position is within map bounds
 */
function isValidPosition(x, y) {
    const CONFIG = require('./config').CONFIG;
    return x >= 0 && y >= 0 && x < CONFIG.MAP_SIZE && y < CONFIG.MAP_SIZE;
}

/**
 * Checks if two positions are adjacent (including diagonals)
 */
function isAdjacentPosition(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
}

module.exports = {
    updateWorldState,
    initializeWorldGrid,
    updatePlayerPosition,
    updateObjectInGrid,
    removeObjectFromGrid,
    updateMobInGrid,
    clearWorldGrid, // Legacy function for backward compatibility
    populateWorldGrid, // Legacy function for backward compatibility
    sendUpdatesToClients,
    getScopedStateForPlayer,
    isValidPosition,
    isAdjacentPosition
};