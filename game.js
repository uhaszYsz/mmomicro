const { SeededRandom, structuredClone } = require('./utils');
const { CONFIG } = require('./config');
const bcrypt = require('bcryptjs');

// ===================================================================================
// --- GAME CLASS (CORE LOGIC) ---
// ===================================================================================
class Game {
    constructor(broadcastCallback, sendToClientCallback, getWssCallback) {
        this.broadcast = broadcastCallback;
        this.sendToClient = sendToClientCallback;
        this.getWss = getWssCallback; // Function to get the WebSocket server instance
        this.state = this.initializeGameState();
        this.adminAssigned = false;
    }

    // --- INITIALIZATION ---
    initializeGameState() {
        return {
            players: [], // Now stores all created players, online or offline
            teams: {},
            objects: [],
            entityLookup: new Map(), // O(1) entity lookup
            world: this.createEmptyWorld(),
            chatMessages: [],
            noobsTeamId: CONFIG.DEFAULT_TEAM_ID,
            enemyTemplates: CONFIG.ENEMY_TEMPLATES,
            buildingTemplates: CONFIG.BUILDING_TEMPLATES,
            craftingRecipes: CONFIG.CRAFTING_RECIPES,
            biomeMap: null // Will be initialized in gameplay.js
        };
    }

    createEmptyWorld() {
        return Array(CONFIG.MAP_SIZE).fill(0).map((_, y) => 
            Array(CONFIG.MAP_SIZE).fill(0).map((_, x) => ({
                players: [],
                objects: [],
                info: {},


            }))
        );
    }

    init() {
        this.logEvent("Game server started. Waiting for players...");
        this.createNoobsTeam();
        this.initializeEnemies();
        
        // OPTIMIZATION: Initialize world grid once instead of updating every tick
        const worldSystem = require('./world');
        worldSystem.initializeWorldGrid(this);
        
        this.updateWorldState();
        setInterval(() => this.update(), CONFIG.GAME_TICK);
    }

    // --- UTILITY & LOGGING ---
    logEvent(message, targetClient = null) {
        const payload = { type: 'log', message: `[${new Date().toLocaleTimeString()}] ${message}` };
        if (targetClient) {
            this.sendToClient(targetClient, payload);
        } else {
            this.broadcast(payload);
        }
        
        // Check if quiet mode is enabled and filter out spam messages
        const isQuietMode = typeof global !== 'undefined' && global.quietMode !== undefined ? global.quietMode : false;
        if (!isQuietMode || !this.isSpamMessage(message)) {
            console.log(payload.message);
        }
    }
    
    // Send static data once on login
    sendStaticData(client) {
        const constructionSites = this.state.objects
            .filter(o => o.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE)
            .map(site => ({
                x: site.x,
                y: site.y,
                team: site.team
            }));

        this.sendToClient(client, {
            type: 'staticData',
            data: {
                enemyTemplates: this.state.enemyTemplates,
                buildingTemplates: this.state.buildingTemplates,
                craftingRecipes: this.state.craftingRecipes,
                biomeMap: this.state.biomeMap,
                teams: this.state.teams,
                noobsTeamId: this.state.noobsTeamId,
                constructionSites: constructionSites
            }
        });
    }
    
    isSpamMessage(message) {
        // Define what constitutes spam messages
        const spamPatterns = [
            'started attacking',
            'joined the attack on',
            'Chat message added:',
            'World grid populated:',
            'defeated',
            'received',
            'has been defeated',
            'moved to',
            'has respawned',
            'is already being fully engaged'
        ];
        return spamPatterns.some(pattern => message.includes(pattern));
    }

    logCombat(message) {
        this.broadcast({ type: 'combatLog', message });
        
        // Check if quiet mode is enabled and filter out combat spam
        const isQuietMode = typeof global !== 'undefined' && global.quietMode !== undefined ? global.quietMode : false;
        if (!isQuietMode || !this.isCombatSpamMessage(message)) {
            console.log(`[Combat] ${message}`);
        }
    }
    
    isCombatSpamMessage(message) {
        // Define what constitutes combat spam messages
        const combatSpamPatterns = [
            'deals',
            'damage to',
            'dodges an attack from',
            'moved to'
        ];
        return combatSpamPatterns.some(pattern => message.includes(pattern));
    }

    findPlayerById(playerId) {
        // Use optimized entity lookup first (O(1) instead of O(n))
        if (this.state.entityLookup.has(playerId)) {
            const entity = this.state.entityLookup.get(playerId);
            // Only return if it's a player
            if (entity && entity.type === CONFIG.ENTITY_TYPES.PLAYER) {
                return entity;
            }
        }
        
        // Fallback to array search (should rarely happen)
        return this.state.players.find(p => p.id === playerId);
    }
    
    findEntityById(id) {
        // Use optimized lookup first
        if (this.state.entityLookup.has(id)) {
            return this.state.entityLookup.get(id);
        }
        
        // Fallback to array search (should rarely happen)
        return this.findPlayerById(id) || this.state.objects.find(o => o.id === id);
    }
    
    // Add entity to lookup
    addEntityToLookup(entity) {
        this.state.entityLookup.set(entity.id, entity);
    }
    
    // Remove entity from lookup
    removeEntityFromLookup(id) {
        this.state.entityLookup.delete(id);
    }
    
    // Update entity in lookup
    updateEntityInLookup(entity) {
        this.state.entityLookup.set(entity.id, entity);
    }
    
    getClientByPlayerId(playerId) {
        const wss = this.getWss();
        for (const client of wss.clients) {
            if (client.playerId === playerId) {
                return client;
            }
        }
        return null;
    }

    // --- PLAYER & AUTHENTICATION ---
    async loginOrCreatePlayer(client, { name, password }) {
        if (!this.validatePlayerName(name)) {
            this.logEvent("Player name must be 3-15 characters.", client);
            return;
        }

        const existingPlayer = this.state.players.find(p => p.name.toLowerCase() === name.toLowerCase());

        if (existingPlayer) {
            return this.loginExistingPlayer(client, existingPlayer, password);
        } else {
            return this.createNewPlayer(client, name, password);
        }
    }

    validatePlayerName(name) {
        return name && 
               name.length >= CONFIG.PLAYER_NAME_MIN_LENGTH && 
               name.length <= CONFIG.PLAYER_NAME_MAX_LENGTH;
    }

    async loginExistingPlayer(client, player, password) {
        const passwordMatch = await bcrypt.compare(password, player.passwordHash);
        if (!passwordMatch) {
            this.logEvent("Incorrect password.", client);
            return false;
        }
        
        if (player.isOnline) {
            this.logEvent("This player is already logged in.", client);
            return false;
        }
        
        player.isOnline = true;
        // Ensure player has type property for combat system
        if (!player.type) {
            player.type = CONFIG.ENTITY_TYPES.PLAYER;
        }
        
        // Ensure player has isInsideCastle property
        if (player.isInsideCastle === undefined) {
            player.isInsideCastle = false;
        }
        
        // Add player to world grid if not already there
        const worldSystem = require('./world');
        const currentCell = this.state.world[player.y][player.x];
        const isPlayerInGrid = currentCell.players.some(p => p.id === player.id);
        if (!isPlayerInGrid) {
            worldSystem.updatePlayerPosition(this, player, undefined, undefined, player.x, player.y);
        }
        
        client.playerId = player.id;
        this.logEvent(`Welcome back, ${player.name}!`);
        this.sendToClient(client, { 
            type: 'loginSuccess', 
            player: this.getSanitizedPlayer(player) 
        });
        
        // Send static data once on login
        this.sendStaticData(client);
        
        // Send initial game state
        const scopedState = worldSystem.getScopedStateForPlayer(this, player);
        this.sendToClient(client, { type: 'gameState', state: scopedState });
        
        return true;
    }

    async createNewPlayer(client, name, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const baseStats = { ...CONFIG.PLAYER_DEFAULT_STATS };
        const player = {
            id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: name,
            passwordHash: hashedPassword,
            x: 0,
            y: 0,
            team: CONFIG.DEFAULT_TEAM_ID,
            isOnline: true,
            isDead: false,
            isAdmin: false,
            isInsideCastle: false,
            type: CONFIG.ENTITY_TYPES.PLAYER,
            baseStats: baseStats,
            stats: { ...baseStats },
            skills: structuredClone(CONFIG.PLAYER_DEFAULT_SKILLS),
            inventory: structuredClone(CONFIG.PLAYER_DEFAULT_INVENTORY),
            equipment: { 
                weapon: null,
                helmet: null,
                armor: null,
                legs: null,
                gloves: null,
                boots: null,
                cape: null,
                ring1: null,
                ring2: null,
                ring3: null
            },
            buffs: [],
            attacking: null,
            attackingPlayer: null,
            nextAttackTime: Date.now(),
            
            statsDirty: true // Mark for initial calculation
        };

        this.state.players.push(player);
        this.addEntityToLookup(player); // Add to lookup
        
        // Add player to world grid
        const worldSystem = require('./world');
        worldSystem.updatePlayerPosition(this, player, undefined, undefined, player.x, player.y);
        
        // Add player to noobs team
        if (this.state.teams[CONFIG.DEFAULT_TEAM_ID]) {
            this.state.teams[CONFIG.DEFAULT_TEAM_ID].members.push(player.id);
        }
        
        this.recalculatePlayerStats(player);
        
        client.playerId = player.id;
        this.logEvent(`New player ${name} has joined the game!`, client);
        
        const sanitizedPlayer = this.getSanitizedPlayer(player);
        this.sendToClient(client, { type: 'loginSuccess', player: sanitizedPlayer });
        
        // Send static data once on login
        this.sendStaticData(client);
        
        // Send initial game state
        const scopedState = worldSystem.getScopedStateForPlayer(this, player);
        this.sendToClient(client, { type: 'gameState', state: scopedState });
    }

    handleDisconnect(playerId) {
        if (!playerId) return;
        
        const player = this.findPlayerById(playerId);
        if (player) {
            this.logEvent(`Player ${player.name} has disconnected.`);
            player.isOnline = false; // Mark as offline, don't delete
            this.stopCombat(player);

            const team = this.state.teams[player.team];
            // If the disconnecting player is the admin, the team becomes leaderless.
            if (team && team.adminId === playerId && team.id !== CONFIG.DEFAULT_TEAM_ID) {
                team.adminId = null; 
                this.logEvent(`Admin ${player.name} of team '${team.name}' has disconnected. The team is now leaderless.`);
            }
        }
        this.updateWorldState();
    }

    // --- TEAM MANAGEMENT ---
    createNoobsTeam() {
        this.state.teams[CONFIG.DEFAULT_TEAM_ID] = {
            id: CONFIG.DEFAULT_TEAM_ID, 
            name: CONFIG.DEFAULT_TEAM_NAME, 
            members: [],
            color: CONFIG.DEFAULT_TEAM_COLOR, 
            adminId: null, 
            description: 'The default team for new and teamless players.',
            joinPolicy: CONFIG.JOIN_POLICIES.CLOSED, 
            isDefault: true
        };
        this.logEvent(`Default team '${CONFIG.DEFAULT_TEAM_NAME}' has been created.`);
    }

    createTeam(playerId, teamName) {
        const player = this.findPlayerById(playerId);
        const client = this.getClientByPlayerId(playerId);
        
        if (!player) return false;
        
        if (!this.validateTeamName(teamName)) {
            this.logEvent("Team name must be between 3 and 15 characters.", client);
            return false;
        }
        
        if (this.teamNameExists(teamName)) {
            this.logEvent(`A team named '${teamName}' already exists.`, client);
            return false;
        }

        const newTeamId = `team_${Date.now()}`;

        this.state.teams[newTeamId] = {
            id: newTeamId, 
            name: teamName, 
            members: [], 
            color: '#808080', // Default to gray
            adminId: playerId, 
            description: '', 
            joinPolicy: CONFIG.JOIN_POLICIES.OPEN, 
            requests: []
        };
        
        this.logEvent(`Team '${teamName}' has been founded by ${player.name}!`);
        this.joinTeam(playerId, newTeamId);
        
        // Send updated teams data to all clients
        this.broadcast({
            type: 'staticData',
            data: {
                teams: this.state.teams,
                noobsTeamId: this.state.noobsTeamId
            }
        });
        
        return true;
    }

    validateTeamName(teamName) {
        return teamName && 
               teamName.length >= CONFIG.TEAM_NAME_MIN_LENGTH && 
               teamName.length <= CONFIG.TEAM_NAME_MAX_LENGTH;
    }

    teamNameExists(teamName) {
        return Object.values(this.state.teams).some(t => 
            t.name.toLowerCase() === teamName.toLowerCase()
        );
    }

    joinTeam(playerId, teamId, isForced = false) {
        const player = this.findPlayerById(playerId);
        const newTeam = this.state.teams[teamId];
        const client = this.getClientByPlayerId(playerId);
        
        if (!player || !newTeam) {
            this.logEvent("Player or Team not found.", client);
            return false;
        }
        
        if (newTeam.id === CONFIG.DEFAULT_TEAM_ID) {
            this.logEvent("You cannot join the Noobs team directly.", client);
            return false;
        }
        
        if (newTeam.joinPolicy === CONFIG.JOIN_POLICIES.REQUEST && !isForced) {
            this.logEvent(`This team requires a request to join.`, client);
            return false;
        }

        // Leave current team if any
        if (player.team) {
            this.removePlayerFromTeam(player);
        }

        // Join new team
        player.team = teamId;
        newTeam.members.push(playerId);
        this.logEvent(`${player.name} has joined team '${newTeam.name}'.`);
        
        // Send updated teams data to all clients
        this.broadcast({
            type: 'staticData',
            data: {
                teams: this.state.teams,
                noobsTeamId: this.state.noobsTeamId
            }
        });
        
        this.updateWorldState();
        return true;
    }

    removePlayerFromTeam(player) {
        const oldTeam = this.state.teams[player.team];
        if (oldTeam) {
            oldTeam.members = oldTeam.members.filter(id => id !== player.id);
            
            // Handle team disbanding or admin changes
            if (oldTeam.members.length === 0 && oldTeam.id !== CONFIG.DEFAULT_TEAM_ID) {
                delete this.state.teams[player.team];
                this.logEvent(`Team '${oldTeam.name}' has been disbanded.`);
            } else if (oldTeam.adminId === player.id) {
                // If the leaving player was the admin, the team becomes leaderless.
                oldTeam.adminId = null;
                this.logEvent(`Admin ${player.name} has left team '${oldTeam.name}'. The team is now leaderless.`);
            }
        }
    }

    leaveTeam(playerId) {
        const player = this.findPlayerById(playerId);
        const client = this.getClientByPlayerId(playerId);
        
        if (!player || !player.team || player.team === CONFIG.DEFAULT_TEAM_ID) {
            this.logEvent("You cannot leave this team.", client);
            return false;
        }
        
        const oldTeamId = player.team;
        const oldTeam = this.state.teams[oldTeamId];
        
        if (oldTeam) {
            this.removePlayerFromTeam(player);
            this.logEvent(`${player.name} has left team '${oldTeam.name}'.`);
        }

        player.team = CONFIG.DEFAULT_TEAM_ID;
        this.state.teams[CONFIG.DEFAULT_TEAM_ID].members.push(playerId);
        this.logEvent(`${player.name} has been moved to the '${CONFIG.DEFAULT_TEAM_NAME}' team.`);
        
        // Send updated teams data to all clients
        this.broadcast({
            type: 'staticData',
            data: {
                teams: this.state.teams,
                noobsTeamId: this.state.noobsTeamId
            }
        });
        
        this.updateWorldState();
        return true;
    }

    updateTeamSettings(adminId, data) {
        const team = this.state.teams[data.teamId];
        const client = this.getClientByPlayerId(adminId);
        
        if (!team) {
            this.logEvent("Team not found.", client);
            return false;
        }
        
        if (team.adminId !== adminId) {
            this.logEvent("You are not the admin of this team.", client);
            return false;
        }

        team.description = data.description.slice(0, 100);
        team.joinPolicy = data.joinPolicy === CONFIG.JOIN_POLICIES.REQUEST 
            ? CONFIG.JOIN_POLICIES.REQUEST 
            : CONFIG.JOIN_POLICIES.OPEN;

        if (data.color) {
            team.color = data.color;
        }

        this.logEvent(`Team '${team.name}' settings have been updated.`, client);
        
        // Send updated teams data to all clients
        this.broadcast({
            type: 'staticData',
            data: {
                teams: this.state.teams,
                noobsTeamId: this.state.noobsTeamId
            }
        });
        
        this.updateWorldState();
        return true;
    }

    requestToJoin(playerId, teamId) {
        const team = this.state.teams[teamId];
        const client = this.getClientByPlayerId(playerId);
        
        if (!team) {
            this.logEvent("Team not found.", client);
            return false;
        }
        
        if (team.requests.includes(playerId) || team.members.includes(playerId)) {
            this.logEvent("You have already sent a request or are a member.", client);
            return false;
        }

        team.requests.push(playerId);
        this.logEvent(`Your request to join '${team.name}' has been sent.`, client);
        this.updateWorldState();
        return true;
    }

    resolveJoinRequest(adminId, data) {
        const { teamId, requesterId, decision } = data;
        const team = this.state.teams[teamId];
        const adminClient = this.getClientByPlayerId(adminId);
        
        if (!team) {
            this.logEvent("Team not found.", adminClient);
            return false;
        }
        
        if (team.adminId !== adminId) {
            this.logEvent("You are not the admin of this team.", adminClient);
            return false;
        }

        team.requests = team.requests.filter(id => id !== requesterId);

        const requesterClient = this.getClientByPlayerId(requesterId);
        if (decision === 'accept') {
            this.logEvent(`Your request to join '${team.name}' was accepted.`, requesterClient);
            this.joinTeam(requesterId, teamId, true);
        } else {
            this.logEvent(`Your request to join '${team.name}' was declined.`, requesterClient);
            
            // Send updated teams data to all clients (to update request lists)
            this.broadcast({
                type: 'staticData',
                data: {
                    teams: this.state.teams,
                    noobsTeamId: this.state.noobsTeamId
                }
            });
            
            this.updateWorldState();
        }
        return true;
    }

    getSanitizedPlayer(player) {
        const playerCopy = structuredClone(player);
        delete playerCopy.passwordHash;
        return playerCopy;
    }

    // Import from gameplay.js
    initializeEnemies() {
        console.log('Game.initializeEnemies() called');
        try {
        const gameplaySystem = require('./gameplay');
            console.log('Gameplay system loaded successfully');
        gameplaySystem.initializeEnemies(this);
            console.log('Gameplay system.initializeEnemies() completed');
        } catch (error) {
            console.error('Error in initializeEnemies:', error);
        }
    }

    updateWorldState() {
        const worldSystem = require('./world');
        worldSystem.updateWorldState(this);
    }

    getScopedStateForPlayer(player) {
        const worldSystem = require('./world');
        return worldSystem.getScopedStateForPlayer(this, player);
    }

    recalculatePlayerStats(player) {
        if (!player) return;

        // Start with base stats
        const baseStats = structuredClone(CONFIG.PLAYER_DEFAULT_STATS);
        player.stats = { ...baseStats };

        // Add stats from equipment
        for (const slot in player.equipment) {
            const item = player.equipment[slot];
            if (item && item.stats) {
                const itemStats = item.baseStats || item.stats; // Use base stats if available
                for (const stat in itemStats) {
                    player.stats[stat] = (player.stats[stat] || 0) + itemStats[stat];
                }

                // Apply enchantments
                if (item.enchantments && item.baseStats) {
                    item.enchantments.forEach(rune => {
                        for (const stat in rune.stats) {
                            if (item.baseStats[stat]) {
                                const bonus = item.baseStats[stat] * 0.10; // 10% bonus
                                player.stats[stat] += bonus;
                            }
                        }
                    });
                }
            }
        }
        
        // Recalculate current HP and MP to handle max changes
        player.stats.hp = Math.min(player.stats.hp, player.stats.maxHp);
        player.stats.mp = Math.min(player.stats.mp, player.stats.maxMp);
        player.stats.stamina = Math.min(player.stats.stamina, player.stats.maxStamina);
    }
    
    // Mark player stats as needing recalculation
    markPlayerStatsDirty(playerId) {
        const player = this.findPlayerById(playerId);
        if (player) {
            player.statsDirty = true;
        }
    }

    scaleEnemyStats(enemy) {
        const gameplaySystem = require('./gameplay');
        gameplaySystem.scaleEnemyStats(enemy);
    }

    respawnPlayer(playerId) {
        const gameplaySystem = require('./gameplay');
        return gameplaySystem.respawnPlayer(this, playerId);
    }

    movePlayer(playerId, x, y) {
        const gameplaySystem = require('./gameplay');
        return gameplaySystem.movePlayer(this, playerId, x, y);
    }

    startCombat(playerId, targetId) {
        const combatSystem = require('./combat');
        return combatSystem.startCombat(this, playerId, targetId);
    }

    stopCombat(player) {
        const combatSystem = require('./combat');
        combatSystem.stopCombat(this, player);
    }

    equipItem(playerId, itemIndex) {
        const inventorySystem = require('./inventory');
        return inventorySystem.equipItem(this, playerId, itemIndex);
    }

    unequipItem(playerId, slot) {
        const inventorySystem = require('./inventory');
        return inventorySystem.unequipItem(this, playerId, slot);
    }

    useItem(playerId, itemIndex) {
        const inventorySystem = require('./inventory');
        return inventorySystem.useItem(this, playerId, itemIndex);
    }

    useConsumableItem(player, item, client) {
        const inventorySystem = require('./inventory');
        return inventorySystem.useConsumableItem(this, player, item, client);
    }

    useScrollItem(player, item, client) {
        const inventorySystem = require('./inventory');
        return inventorySystem.useScrollItem(this, player, item, client);
    }



    buildConstructionSite(playerId) {
        const constructionSystem = require('./construction');
        return constructionSystem.buildConstructionSite(this, playerId);
    }

    buildBuilding(playerId, buildingName) {
        const constructionSystem = require('./construction');
        return constructionSystem.buildBuilding(this, playerId, buildingName);
    }

    donateToBuilding(playerId, buildingIndex, itemIndex, quantity) {
        const constructionSystem = require('./construction');
        return constructionSystem.donateToBuilding(this, playerId, buildingIndex, itemIndex, quantity);
    }

    donateToSite(playerId) {
        const constructionSystem = require('./construction');
        return constructionSystem.donateToSite(this, playerId);
    }

    deploySiegeMachine(playerId) {
        const constructionSystem = require('./construction');
        return constructionSystem.deploySiegeMachine(this, playerId);
    }

    goOutside(playerId) {
        const player = this.findPlayerById(playerId);
        const client = this.getClientByPlayerId(playerId);
        
        if (!player || player.isDead) {
            this.logEvent("You cannot go outside while dead.", client);
            return false;
        }
        
        // Check if player is inside a castle
        if (!player.isInsideCastle) {
            this.logEvent("You are not inside a castle.", client);
            return false;
        }
        
        // Mark player as outside while keeping their team
        player.isInsideCastle = false;
        
        // Log the action
        this.logEvent(`${player.name} has left the castle.`, client);
        
        // Update the world state to reflect the change
        this.updateWorldState();
        
        return true;
    }

    goInside(playerId) {
        const player = this.findPlayerById(playerId);
        const client = this.getClientByPlayerId(playerId);
        
        if (!player) {
            return false;
        }
        
        if (player.isDead) {
            this.logEvent("You cannot go inside while dead.", client);
            return false;
        }
        
        // Check if there's a castle at the player's location
        const site = this.state.world[player.y][player.x].objects.find(o => 
            o.type === CONFIG.ENTITY_TYPES.CONSTRUCTION_SITE
        );
        
        if (!site) {
            this.logEvent("There is no castle here to enter.", client);
            return false;
        }
        
        // Check if player is already inside
        if (player.isInsideCastle) {
            this.logEvent("You are already inside the castle.", client);
            return false;
        }
        
        // Only players on the same team as the castle can enter
        if (player.team !== site.team) {
            this.logEvent("Only castle team members can enter the castle.", client);
            return false;
        }
        
        // Mark player as inside
        player.isInsideCastle = true;
        
        // Log the action
        this.logEvent(`${player.name} has entered the castle.`, client);
        
        // Update the world state to reflect the change
        this.updateWorldState();
        
        return true;
    }

    handleChatMessage(playerId, data) {
        const chatSystem = require('./chat');
        return chatSystem.handleChatMessage(this, playerId, data);
    }

    handleAdminCommand(adminId, data) {
        const adminSystem = require('./admin');
        return adminSystem.handleAdminCommand(this, adminId, data);
    }

    craftItem(playerId, buildingIndex, recipeId) {
        const craftingSystem = require('./crafting');
        return craftingSystem.craftItem(this, playerId, buildingIndex, recipeId);
    }

    depositToStorage(playerId, buildingIndex, itemIndex, storageType, quantity = 1) {
        const storageSystem = require('./storage');
        return storageSystem.depositToStorage(this, playerId, buildingIndex, itemIndex, storageType, quantity);
    }

    withdrawFromStorage(playerId, buildingIndex, itemIndex, storageType) {
        const storageSystem = require('./storage');
        return storageSystem.withdrawFromStorage(this, playerId, buildingIndex, itemIndex, storageType);
    }

    enchantItem(playerId, buildingIndex, itemIndex, runeIndex) {
        const enhancementSystem = require('./enhancement');
        return enhancementSystem.enchantItem(this, playerId, buildingIndex, itemIndex, runeIndex);
    }

    summonBoss(playerId) {
        const player = this.findPlayerById(playerId);
        const client = this.getClientByPlayerId(playerId);
        
        if (!player || player.isDead) return false;
        
        // Find available boss templates
        const bossTemplates = CONFIG.ENEMY_TEMPLATES.filter(template => template.isBoss);
        if (bossTemplates.length === 0) {
            this.logEvent("No boss templates available.", client);
            return false;
        }
        
        // Get biome at player's location
        const biomeSystem = require('./biomes');
        const biomeKey = this.state.biomeMap ? biomeSystem.getBiomeAt(player.x, player.y, this.state.biomeMap) : 'FOREST';
        
        // Find bosses that can spawn in this biome
        const availableBosses = bossTemplates.filter(boss => boss.biome === biomeKey || boss.biome === 'ALL');
        
        if (availableBosses.length === 0) {
            this.logEvent(`No bosses can spawn in the ${CONFIG.BIOMES[biomeKey].name} biome.`, client);
            return false;
        }
        
        // Choose a random boss
        const rng = new SeededRandom(CONFIG.GAME_SEED + Date.now());
        const chosenBoss = availableBosses[Math.floor(rng.next() * availableBosses.length)];
        
        // Find the actual template index
        const actualTemplateIndex = CONFIG.ENEMY_TEMPLATES.findIndex(t => 
            t.name === chosenBoss.name && t.biome === chosenBoss.biome
        );
        
        // Create the boss
        const boss = {
            id: `${chosenBoss.name.replace(/\s/g, '')}_BOSS_${Date.now()}`,
            x: player.x,
            y: player.y,
            level: 1,
            templateId: actualTemplateIndex,
            baseStats: structuredClone(chosenBoss.baseStats),
            stats: structuredClone(chosenBoss.baseStats),
            weakness: chosenBoss.weakness,
            biome: biomeKey,
            isBoss: true,
            respawnUntil: null,
            type: CONFIG.ENTITY_TYPES.MOB,
            attackers: [],
            maxAttackers: CONFIG.MAX_ATTACKERS,
            nextAttackTime: Date.now(),
        };
        
        // Apply boss stats (3x HP, 2x DMG)
        boss.stats.hp *= 3;
        boss.stats.maxHp = boss.stats.hp;
        boss.stats.dmg *= 2;
        
        this.scaleEnemyStats(boss);
        this.state.objects.push(boss);
        
        this.logEvent(`${player.name} has summoned a boss ${chosenBoss.name} in the ${CONFIG.BIOMES[biomeKey].name}!`, client);
        this.updateWorldState();
        return true;
    }

    update() {
        const tickStart = Date.now();
        const updateSystem = require('./update');
        updateSystem.update(this);
        const tickEnd = Date.now();
        const tickDuration = tickEnd - tickStart;
        
        // Track tick performance for averaging
        if (!this.tickPerformance) {
            this.tickPerformance = {
                times: [],
                lastReportTime: Date.now()
            };
        }
        
        this.tickPerformance.times.push(tickDuration);
        
        // Warn if individual tick processing takes longer than the tickrate
        if (tickDuration > CONFIG.GAME_TICK) {
            console.warn(`[PERFORMANCE WARNING] Tick processing took ${tickDuration}ms, which exceeds the tickrate of ${CONFIG.GAME_TICK}ms. This may cause game lag.`);
        }
    }
    
    // Method to get current performance stats
    getPerformanceStats() {
        if (!this.tickPerformance || this.tickPerformance.times.length === 0) {
            return "No performance data available yet.";
        }
        
        const avgTime = this.tickPerformance.times.reduce((sum, time) => sum + time, 0) / this.tickPerformance.times.length;
        const maxTime = Math.max(...this.tickPerformance.times);
        const minTime = Math.min(...this.tickPerformance.times);
        
        return `[TICK STATS] Avg: ${avgTime.toFixed(1)}ms, Min: ${minTime}ms, Max: ${maxTime}ms, Ticks: ${this.tickPerformance.times.length}`;
    }
    
    // Method to reset performance tracking
    resetPerformanceTracking() {
        if (this.tickPerformance) {
            this.tickPerformance.times = [];
            this.tickPerformance.lastReportTime = Date.now();
        }
    }



    handleTargetDefeated(killer, target) {
        const combatSystem = require('./combat');
        combatSystem.handleTargetDefeated(this, killer, target);
    }

    examinePlayer(playerId, targetId) {
        const player = this.findPlayerById(playerId);
        const target = this.findPlayerById(targetId);
        const client = this.getClientByPlayerId(playerId);
        
        if (!player || !target) {
            this.logEvent("Player not found.", client);
            return false;
        }
        
        // Create a sanitized version of the target player for examination
        const examineData = {
            id: target.id,
            name: target.name,
            level: target.level || 1,
            team: target.team,
            stats: target.stats ? {
                hp: target.stats.hp || 0,
                maxHp: target.stats.maxHp || 100,
                mp: target.stats.mp || 0,
                maxMp: target.stats.maxMp || 100,
                stamina: target.stats.stamina || 0,
                maxStamina: target.stats.maxStamina || 100,
                dmg: target.stats.dmg || 0,
                speed: target.stats.speed || 0,
                critical: target.stats.critical || 0,
                dodge: target.stats.dodge || 0
            } : {},
            equipment: target.equipment || {},
            skills: target.skills || {},
            isDead: target.isDead || false,

        };
        
        this.sendToClient(client, { 
            type: 'examine-player', 
            data: examineData 
        });
        return true;
    }

    examineItem(playerId, itemIndex, itemType) {
        const player = this.findPlayerById(playerId);
        const client = this.getClientByPlayerId(playerId);
        
        if (!player) {
            this.logEvent("Player not found.", client);
            return false;
        }
        
        let item = null;
        
        if (itemType === 'inventory') {
            if (!player.inventory || itemIndex >= player.inventory.length) {
                this.logEvent("Invalid item index.", client);
                return false;
            }
            item = player.inventory[itemIndex];
        } else if (itemType === 'equipment') {
            const slots = ['hand', 'chest'];
            if (itemIndex >= slots.length) {
                this.logEvent("Invalid equipment slot.", client);
                return false;
            }
            const slot = slots[itemIndex];
            item = player.equipment[slot];
            if (!item) {
                this.logEvent("No item equipped in that slot.", client);
                return false;
            }
        }
        
        if (!item) {
            this.logEvent("Item not found.", client);
            return false;
        }
        
        this.sendToClient(client, { 
            type: 'examine-item', 
            data: item 
        });
        return true;
    }


}

module.exports = { Game };