// Biome generation and management

const { CONFIG } = require('./config.js');

function generateBiomeMap() {
    const MAP_SIZE = CONFIG.MAP_SIZE;
    const biomeMap = {};
    const biomeKeys = Object.keys(CONFIG.BIOMES);
    const seeds = [];

    // 1. Create a seed point for each biome
    biomeKeys.forEach(biomeKey => {
        let placed = false;
        while (!placed) {
            const x = Math.floor(Math.random() * MAP_SIZE);
            const y = Math.floor(Math.random() * MAP_SIZE);
            const key = `${x},${y}`;
            if (!biomeMap[key]) {
                biomeMap[key] = biomeKey;
                seeds.push({ x, y, biome: biomeKey });
                placed = true;
            }
        }
    });

    // 2. Assign each tile to the nearest biome seed
    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            let nearestSeed = null;
            let minDistance = Infinity;

            seeds.forEach(seed => {
                const distance = Math.sqrt(Math.pow(x - seed.x, 2) + Math.pow(y - seed.y, 2));
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestSeed = seed;
                }
            });

            if (nearestSeed) {
                biomeMap[`${x},${y}`] = nearestSeed.biome;
            }
        }
    }

    return biomeMap;
}

function getEnemiesForBiome(biomeKey, includeBosses = false) {
    return CONFIG.ENEMY_TEMPLATES.filter(enemy => 
        (enemy.biome === biomeKey || enemy.biome === 'ALL') && 
        (includeBosses || !enemy.isBoss)
    );
}

function spawnBiomeEnemies(game, biomeMap) {
    const MAP_SIZE = CONFIG.MAP_SIZE;
    
    // Spawn 3-9 enemies for each area (tile)
    for (let x = 0; x < MAP_SIZE; x++) {
        for (let y = 0; y < MAP_SIZE; y++) {
            const biomeKey = biomeMap[`${x},${y}`];
            const enemiesInThisArea = Math.floor(Math.random() * 7) + 3; // 3-9 enemies
            
            for (let i = 0; i < enemiesInThisArea; i++) {
                spawnBiomeEnemy(game, biomeMap, biomeKey, x, y);
            }
        }
    }
}

function spawnBiomeEnemy(game, biomeMap, biomeKey, x, y, includeBosses = false) {
    const availableEnemies = getEnemiesForBiome(biomeKey, includeBosses);
    
    if (availableEnemies.length === 0) return;
    
    const enemyTemplate = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
    
    // Use integer coordinates for the world grid system
    // Multiple enemies can share the same position since they're in the same area
    const finalX = x;
    const finalY = y;
    
    // Create enemy with proper structure
    const enemy = {
        id: `${enemyTemplate.name.replace(/\s/g, '')}_${finalX}_${finalY}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: CONFIG.ENTITY_TYPES.MOB,
        name: enemyTemplate.name,
        x: finalX,
        y: finalY,
        level: 1,
        baseStats: structuredClone(enemyTemplate.baseStats),
        stats: structuredClone(enemyTemplate.baseStats),
        weakness: enemyTemplate.weakness,
        drops: enemyTemplate.drops,
        loot: enemyTemplate.drops,
        isBoss: enemyTemplate.isBoss || false,
        biome: biomeKey,
        attackers: [],
        maxAttackers: CONFIG.MAX_ATTACKERS,
        nextAttackTime: Date.now()
    };
    
    // Set maxHp and ensure hp is at max
    enemy.stats.maxHp = enemy.stats.hp;
    enemy.stats.hp = enemy.stats.maxHp;
    
    game.state.objects.push(enemy);
}

function scaleEnemyStats(baseStat, level) {
    return Math.floor(baseStat * (1 + (level - 1) * 0.1));
}

function getBiomeAt(x, y, biomeMap) {
    return biomeMap[`${x},${y}`] || 'FOREST';
}

function respawnEnemyInBiome(game, biomeMap, biomeKey) {
    // Find a random tile in this biome for respawning
    const MAP_SIZE = CONFIG.MAP_SIZE;
    const biomeTiles = [];
    for (let x = 0; x < MAP_SIZE; x++) {
        for (let y = 0; y < MAP_SIZE; y++) {
            if (biomeMap[`${x},${y}`] === biomeKey) {
                biomeTiles.push({ x, y });
            }
        }
    }
    
    if (biomeTiles.length === 0) return;
    
    const tile = biomeTiles[Math.floor(Math.random() * biomeTiles.length)];
    spawnBiomeEnemy(game, biomeMap, biomeKey, tile.x, tile.y, false); // Don't include bosses in respawns
}

module.exports = {
    generateBiomeMap,
    getEnemiesForBiome,
    spawnBiomeEnemies,
    spawnBiomeEnemy,
    scaleEnemyStats,
    getBiomeAt,
    respawnEnemyInBiome
}; 