const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const bcrypt = require('bcryptjs'); // For password hashing
const express = require('express');
const path = require('path');
const { CONFIG } = require('./config');
const { Game } = require('./game');

// ===================================================================================
// --- SERVER SETUP ---
// ===================================================================================

const app = express();
const server = http.createServer(app);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const wss = new WebSocket.Server({ server });

server.listen(8080, () => {
    console.log('HTTP and WebSocket server started on port 8080');
});

// Global quiet mode flag
let quietMode = true; // Start in quiet mode by default
global.quietMode = quietMode; // Make it globally accessible

const game = new Game(
    // broadcast
    (payload) => { 
        const message = JSON.stringify(payload);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) client.send(message);
        });
        
        // Reduce console spam in quiet mode
        if (!quietMode && payload.type === 'log' && payload.message) {
            // Only log important messages, not every game event
            if (payload.message.includes('connected') || 
                payload.message.includes('disconnected') ||
                payload.message.includes('joined') ||
                payload.message.includes('left')) {
                gameConsole.log(`[GAME] ${payload.message}`);
            }
        }
        
        // Completely suppress chat messages and world grid updates in quiet mode
        if (quietMode && (
            payload.type === 'chat' || 
            payload.message?.includes('Chat message added:') ||
            payload.message?.includes('World grid populated:') ||
            payload.message?.includes('started attacking') ||
            payload.message?.includes('joined the attack on')
        )) {
            return; // Don't log these messages at all
        }
    },
    // sendToClient
    (client, payload) => { 
        if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(payload));
    },
    // getWss
    () => wss 
);

game.init();

// Spawn 1000 simulated players at server startupspawn

const clientRequestTimestamps = new Map();

wss.on('connection', ws => {
    console.log('Client connected');
    game.sendToClient(ws, { type: 'log', message: 'Welcome! Please login or create a character.' });

    ws.on('message', async (message) => { // Now async to handle login
        // --- Rate Limiting ---
        const now = Date.now();
        const lastRequestTime = clientRequestTimestamps.get(ws);
        if (lastRequestTime && (now - lastRequestTime) < CONFIG.RATE_LIMIT_MS) {
            return; // Ignore the request
        }
        clientRequestTimestamps.set(ws, now);

        try {
            const data = JSON.parse(message);
            
            // --- Input Validation & Sanitization ---
            if (!data || typeof data !== 'object') {
                game.sendToClient(ws, { type: 'error', message: 'Invalid message format.' });
                return;
            }
            
            if (data.action === 'login') {
                if (ws.playerId) {
                    game.sendToClient(ws, { type: 'error', message: 'Already logged in.' });
                    return;
                }
                
                // Validate login data
                if (!data.name || typeof data.name !== 'string' || data.name.length < 3 || data.name.length > 15) {
                    game.sendToClient(ws, { type: 'error', message: 'Invalid player name (3-15 characters).' });
                    return;
                }
                if (!data.password || typeof data.password !== 'string' || data.password.length < 1) {
                    game.sendToClient(ws, { type: 'error', message: 'Invalid password.' });
                    return;
                }
                
                await game.loginOrCreatePlayer(ws, { name: data.name.trim(), password: data.password });
                return;
            }

            if (!ws.playerId) {
                game.sendToClient(ws, { type: 'error', message: 'You must log in first.' });
                return;
            }

            // --- Action Handler with Validation ---
            const actions = {
                'admin': (p, d) => {
                    // Admin validation
                    const player = game.findPlayerById(p);
                    if (!player || !player.isAdmin) {
                        game.sendToClient(ws, { type: 'error', message: 'Admin access required.' });
                        return;
                    }
                    game.handleAdminCommand(p, d);
                },
                'move': (p, d) => {
                    // Validate coordinates
                    if (typeof d.x !== 'number' || typeof d.y !== 'number' || 
                        d.x < 0 || d.y < 0 || d.x >= CONFIG.MAP_SIZE || d.y >= CONFIG.MAP_SIZE) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid coordinates.' });
                        return;
                    }
                    game.movePlayer(p, d.x, d.y);
                },
                'attack': (p, d) => {
                    // Validate target ID
                    if (!d.targetId || typeof d.targetId !== 'string') {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid target.' });
                        return;
                    }
                    game.startCombat(p, d.targetId);
                },
                'respawn': (p) => game.respawnPlayer(p),
                'build': (p) => game.buildConstructionSite(p),
                'build-building': (p, d) => {
                    // Validate building name
                    if (!d.buildingName || typeof d.buildingName !== 'string' || 
                        !CONFIG.BUILDING_TEMPLATES[d.buildingName]) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid building type.' });
                        return;
                    }
                    game.buildBuilding(p, d.buildingName);
                },
                'donate': (p) => game.donateToSite(p),
                'donate-to-building': (p, d) => {
                    if (typeof d.buildingIndex !== 'number' || d.buildingIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid building index.' });
                        return;
                    }
                    if (typeof d.itemIndex !== 'number' || d.itemIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid item index.' });
                        return;
                    }
                    const quantity = parseInt(d.quantity) || 1;
                    if (quantity <= 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid quantity.' });
                        return;
                    }
                    game.donateToBuilding(p, d.buildingIndex, d.itemIndex, quantity);
                },
                'deploySiege': (p) => game.deploySiegeMachine(p),
                'go-outside': (p) => game.goOutside(p),
                'go-inside': (p) => game.goInside(p),
                'chat': (p, d) => {
                    // Validate chat message
                    if (!d.text || typeof d.text !== 'string' || d.text.length > 200) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid chat message.' });
                        return;
                    }
                    game.handleChatMessage(p, d);
                },
                'equip-item': (p, d) => {
                    // Validate item index
                    if (typeof d.itemIndex !== 'number' || d.itemIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid item index.' });
                        return;
                    }
                    game.equipItem(p, d.itemIndex);
                    const player = game.findPlayerById(p);
                    if (player) {
                        game.recalculatePlayerStats(player);
                        game.updateWorldState();
                    }
                },
                'unequip-item': (p, d) => {
                    // Validate slot
                    const validSlots = ['weapon', 'helmet', 'armor', 'legs', 'gloves', 'boots', 'cape', 'ring1', 'ring2', 'ring3'];
                    if (!d.slot || !validSlots.includes(d.slot)) {
                        game.sendToClient(ws, { type: 'error', message: `Invalid equipment slot: ${d.slot}` });
                        return;
                    }
                    game.unequipItem(p, d.slot);
                },
                'use-item': (p, d) => {
                    // Validate item index
                    if (typeof d.itemIndex !== 'number' || d.itemIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid item index.' });
                        return;
                    }
                    game.useItem(p, d.itemIndex);
                },
                'craft-item': (p, d) => {
                    // Validate building index and recipe
                    if (typeof d.buildingIndex !== 'number' || d.buildingIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid building index.' });
                        return;
                    }
                    if (typeof d.recipeId !== 'number' || d.recipeId < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid recipe ID.' });
                        return;
                    }
                    game.craftItem(p, d.buildingIndex, d.recipeId);
                },
                'deposit-storage': (p, d) => {
                    // Validate storage parameters
                    if (typeof d.buildingIndex !== 'number' || d.buildingIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid building index.' });
                        return;
                    }
                    if (typeof d.itemIndex !== 'number' || d.itemIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid item index.' });
                        return;
                    }
                    if (!d.storageType || !['storage', 'personal_storage'].includes(d.storageType)) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid storage type.' });
                        return;
                    }
                    const quantity = parseInt(d.quantity) || 1;
                    if (quantity <= 0 || quantity > 1000) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid quantity (1-1000).' });
                        return;
                    }
                    game.depositToStorage(p, d.buildingIndex, d.itemIndex, d.storageType, quantity);
                },
                'withdraw-storage': (p, d) => {
                    // Validate storage parameters
                    if (typeof d.buildingIndex !== 'number' || d.buildingIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid building index.' });
                        return;
                    }
                    if (typeof d.itemIndex !== 'number' || d.itemIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid item index.' });
                        return;
                    }
                    if (!d.storageType || !['storage', 'personal_storage'].includes(d.storageType)) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid storage type.' });
                        return;
                    }
                    game.withdrawFromStorage(p, d.buildingIndex, d.itemIndex, d.storageType);
                },
                'create-team': (p, d) => {
                    // Validate team name
                    if (!d.teamName || typeof d.teamName !== 'string' || 
                        d.teamName.length < 3 || d.teamName.length > 15) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid team name (3-15 characters).' });
                        return;
                    }
                    game.createTeam(p, d.teamName.trim());
                },
                'join-team': (p, d) => {
                    // Validate team ID
                    if (!d.teamId || typeof d.teamId !== 'string') {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid team ID.' });
                        return;
                    }
                    game.joinTeam(p, d.teamId);
                },
                'leave-team': (p) => game.leaveTeam(p),
                'update-team-settings': (p, d) => {
                    // Validate team settings
                    if (!d.teamId || typeof d.teamId !== 'string') {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid team ID.' });
                        return;
                    }
                    // Validate hex color format
                    if (d.color && !/^#[0-9A-F]{6}$/i.test(d.color)) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid team color format.' });
                        return;
                    }
                    game.updateTeamSettings(p, d);
                },
                'request-to-join': (p, d) => {
                    // Validate team ID
                    if (!d.teamId || typeof d.teamId !== 'string') {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid team ID.' });
                        return;
                    }
                    game.requestToJoin(p, d.teamId);
                },
                'resolve-join-request': (p, d) => {
                    // Validate request data
                    if (!d.teamId || typeof d.teamId !== 'string') {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid team ID.' });
                        return;
                    }
                    if (!d.requesterId || typeof d.requesterId !== 'string') {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid requester ID.' });
                        return;
                    }
                    if (!d.decision || !['accept', 'reject'].includes(d.decision)) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid decision.' });
                        return;
                    }
                    game.resolveJoinRequest(p, d);
                },

                'enchant-item': (p, d) => {
                    if (typeof d.buildingIndex !== 'number' || d.buildingIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid building index.' });
                        return;
                    }
                    if (typeof d.itemIndex !== 'number' || d.itemIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid item index.' });
                        return;
                    }
                    if (typeof d.runeIndex !== 'number' || d.runeIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid rune index.' });
                        return;
                    }
                    game.enchantItem(p, d.buildingIndex, d.itemIndex, d.runeIndex);
                    const player = game.findPlayerById(p);
                    if (player) {
                        game.recalculatePlayerStats(player);
                        game.updateWorldState();
                    }
                },

                'summon-boss': (p) => game.summonBoss(p),
                'examine-player': (p, d) => {
                    // Validate target player ID
                    if (!d.targetId || typeof d.targetId !== 'string') {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid target player.' });
                        return;
                    }
                    game.examinePlayer(p, d.targetId);
                },
                'examine-item': (p, d) => {
                    // Validate item parameters
                    if (typeof d.itemIndex !== 'number' || d.itemIndex < 0) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid item index.' });
                        return;
                    }
                    if (!d.itemType || !['inventory', 'equipment'].includes(d.itemType)) {
                        game.sendToClient(ws, { type: 'error', message: 'Invalid item type.' });
                        return;
                    }
                    game.examineItem(p, d.itemIndex, d.itemType);
                },

            };

            if (actions[data.action]) {
                actions[data.action](ws.playerId, data);
            } else {
                game.sendToClient(ws, { type: 'error', message: 'Unknown action.' });
            }

        } catch (e) {
            console.error('Failed to process message:', e);
            game.sendToClient(ws, { type: 'error', message: 'Invalid message format.' });
        }
    });

    ws.on('close', () => {
        clientRequestTimestamps.delete(ws); // Clean up rate limit tracking
        console.log(`Client ${ws.playerId || ''} disconnected`);
        game.handleDisconnect(ws.playerId);
    });
});

// ===================================================================================
// --- SSH COMMAND LINE INTERFACE ---
// ===================================================================================

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});

// Create a separate console for game messages to avoid interference
const gameConsole = {
    log: (...args) => {
        // Clear the current line and write game messages
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        console.log(...args);
        rl.prompt(true); // Restore the prompt
    }
};

console.log('\n=== SERVER COMMANDS ===');
console.log('spawn [count] - Spawn simulated players (default: 1)');
console.log('clear - Clear console messages');
console.log('quiet - Toggle quiet mode (reduce game messages)');
console.log('perf - Show tick performance statistics');
console.log('exit - Exit the server');
console.log('================================\n');
console.log('Type commands at the > prompt below:');
console.log('TIP: Quiet mode is ON by default. Use "quiet" to toggle, "clear" to clear console');

rl.on('line', (input) => {
    try {
        const parts = input.trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        switch(command) {
            case 'spawn':
                const count = parseInt(args[0]) || 1;
                if (isNaN(count) || count < 1) {
                    console.log('Invalid count. Please provide a positive number.');
                    break;
                }
                console.log(`Spawning ${count} simulated players...`);
                global.spawn(count);
                break;
                
            case 'clear':
                console.clear();
                console.log('\n=== SERVER COMMANDS ===');
                console.log('spawn [count] - Spawn simulated players (default: 1)');
                console.log('clear - Clear console messages');
                console.log('quiet - Toggle quiet mode (reduce game messages)');
                console.log('exit - Exit the server');
                console.log('================================\n');
                break;
                
            case 'quiet':
                quietMode = !quietMode;
                global.quietMode = quietMode; // Update global variable
                console.log(`Quiet mode ${quietMode ? 'enabled' : 'disabled'}`);
                break;
                
            case 'perf':
                console.log(game.getPerformanceStats());
                break;
                
            case 'exit':
                console.log('Shutting down server...');
                process.exit(0);
                break;
                
            default:
                console.log('Unknown command. Available commands: spawn [count], clear, quiet, exit');
                break;
        }
    } catch (error) {
        console.log('Error processing command:', error.message);
    }
    
    rl.prompt();
});



global.spawn = function(count = 1) {
    const maxCount = count; // Allow any number of players
    
    if (!game.fakePlayers) {
        game.fakePlayers = [];
    }
    
    const fakePlayerNames = [
        'Bot_Alpha', 'Bot_Beta', 'Bot_Gamma', 'Bot_Delta', 'Bot_Epsilon',
        'Bot_Zeta', 'Bot_Eta', 'Bot_Theta', 'Bot_Iota', 'Bot_Kappa'
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
    
    console.log(`Spawned ${created} simulated players. Total fake players: ${game.fakePlayers.length}`);
    game.updateWorldState();
};

function spawnSimulatedPlayers(count) {
    global.spawn(count);
}

rl.prompt();
