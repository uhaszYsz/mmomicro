// ===================================================================================
// --- GAME CONFIGURATION ---
// ===================================================================================
const CONFIG = {
    // General Settings
    MAP_SIZE: 20,
    GAME_TICK: 200, // ms
    MAX_ATTACKERS: 5,

    GAME_SEED: 'a-secret-seed-for-consistent-spawns',
    RATE_LIMIT_MS: 200, // Allow 5 actions per second
    CHAT_MESSAGE_LIMIT: 500, // Maximum number of chat messages to keep

    // Biome Settings
    BIOMES: {
        FOREST: {
            name: 'Forest',
            color: 'bg-green-600',
            borderColor: 'border-green-700',
            textColor: 'text-green-100',
            description: 'Lush forests with abundant wildlife and resources.'
        },
        DESERT: {
            name: 'Desert',
            color: 'bg-yellow-500',
            borderColor: 'border-yellow-600',
            textColor: 'text-yellow-900',
            description: 'Harsh deserts with scorching heat and hidden treasures.'
        },
        VOLCANIC: {
            name: 'Volcanic',
            color: 'bg-red-700',
            borderColor: 'border-red-800',
            textColor: 'text-red-100',
            description: 'Dangerous volcanic regions with fire-based creatures.'
        },
        ARCTIC: {
            name: 'Arctic',
            color: 'bg-blue-300',
            borderColor: 'border-blue-400',
            textColor: 'text-blue-900',
            description: 'Frozen arctic lands with ice and snow creatures.'
        }
    },
    BIOME_GENERATION: {
        NOISE_SCALE: 0.15,
        BIOME_SIZE: 8,
        BIOME_BLEND: 0.1
    },

    // Team Settings
    DEFAULT_TEAM_ID: 'team_noobs',
    DEFAULT_TEAM_NAME: 'Noobs',
    DEFAULT_TEAM_COLOR: '#808080',
    TEAM_COLORS: ['#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#9333ea', '#db2777', '#4f46e5', '#14b8a6'],

    // Player Settings
    PLAYER_DEFAULT_STATS: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, stamina: 500, maxStamina: 500, dmg: 5, speed: 1, critical: 5, dodge: 5, accuracy: 50, def: 0 },
    PLAYER_DEFAULT_INVENTORY: [
        { name: '🗡️ Rusty Sword', type: 'equipment', slot: 'weapon', stats: { dmg: 2, speed: 0.1 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'A basic sword.' },
        { name: '⛑️ Leather Helmet', type: 'equipment', slot: 'helmet', stats: { maxHp: 10 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'A simple leather helmet.' },
        { name: '👕 Leather Tunic', type: 'equipment', slot: 'armor', stats: { maxHp: 25 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'Simple leather armor.' },
        { name: '👖 Leather Leggings', type: 'equipment', slot: 'legs', stats: { maxHp: 15 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'Simple leather leggings.' },
        { name: '🧤 Leather Gloves', type: 'equipment', slot: 'gloves', stats: { dmg: 1 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'Simple leather gloves.' },
        { name: '🥾 Leather Boots', type: 'equipment', slot: 'boots', stats: { speed: 0.1 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'Simple leather boots.' },
        { name: '🧣 Simple Cape', type: 'equipment', slot: 'cape', stats: { dodge: 1 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'A simple cape.' },
        { name: '💍 Simple Ring', type: 'equipment', slot: 'ring', stats: { critical: 1 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'A simple ring.' },
        { name: '💍 Simple Ring', type: 'equipment', slot: 'ring', stats: { critical: 1 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'A simple ring.' },
        { name: '💍 Simple Ring', type: 'equipment', slot: 'ring', stats: { critical: 1 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'A simple ring.' },
        { name: '🧱 Brick', type: 'material', quantity: 100, level: 1, quality: 'Common', description: 'A sturdy brick, used for construction.' },
        { name: '🧪 Minor Health Potion', type: 'consumable', effects: { replenish: 'hp', value: 25 }, level: 1, quality: 'Common', description: 'Restores 25% of your max HP.'},
        { name: '🔩 Iron Bar', type: 'material', quantity: 1000, level: 5, quality: 'Uncommon', description: 'A bar of refined iron.' },
        { name: '🔥 Minor Strength Rune', type: 'rune', quantity: 20, stats: { dmg: 5 }, level: 10, quality: 'Uncommon', description: 'A simple rune that can be applied to a weapon to increase its damage.' },
        { name: '❤️ Minor Health Rune', type: 'rune', quantity: 20, stats: { maxHp: 20 }, level: 10, quality: 'Uncommon', description: 'A simple rune that increases maximum health.' },
        { name: '💧 Minor Mana Rune', type: 'rune', quantity: 20, stats: { maxMp: 20 }, level: 10, quality: 'Uncommon', description: 'A simple rune that increases maximum mana.' },
        { name: '⚡ Minor Speed Rune', type: 'rune', quantity: 20, stats: { speed: 0.2 }, level: 15, quality: 'Rare', description: 'A rune that quickens your movements.' },
        { name: '🎯 Minor Critical Rune', type: 'rune', quantity: 20, stats: { critical: 5 }, level: 20, quality: 'Rare', description: 'A rune that sharpens your critical eye.' },
        { name: '💨 Minor Dodge Rune', type: 'rune', quantity: 20, stats: { dodge: 5 }, level: 20, quality: 'Rare', description: 'A rune that helps you evade attacks.' },
        { name: '👁️ Minor Accuracy Rune', type: 'rune', quantity: 20, stats: { accuracy: 5 }, level: 20, quality: 'Rare', description: 'A rune that guides your attacks to their target.' },
        { name: '🛡️ Minor Defense Rune', type: 'rune', quantity: 20, stats: { def: 3 }, level: 15, quality: 'Uncommon', description: 'A rune that hardens your defenses.' }
    ],
    PLAYER_DEFAULT_SKILLS: {
        hp: { level: 1, exp: 0 },
        heal: { level: 1, exp: 0 },
        woodcutting: { level: 1, exp: 0 },
        carpentry: { level: 1, exp: 0 },
        mining: { level: 1, exp: 0 },
        smithing: { level: 1, exp: 0 },
        fishing: { level: 1, exp: 0 }, // <-- New Skill
        engineering: { level: 1, exp: 0 },
        construction: { level: 1, exp: 0 },
        hunting: { level: 1, exp: 0 },
        battle: { level: 1, exp: 0 }
    },
    PLAYER_NAME_MIN_LENGTH: 3,
    PLAYER_NAME_MAX_LENGTH: 15,

    // Combat Settings
    PLAYER_STAMINA_COST_PER_ATTACK: 1,
    DODGE_CHANCE_STAT: 'dodge',
    CRITICAL_CHANCE_STAT: 'critical',
    CRITICAL_DAMAGE_MULTIPLIER: 2,
    SKILL_DAMAGE_BONUS_PER_LEVEL: 0.01, // 1% per level

    // Construction Settings
    CONSTRUCTION_BASE_HP: 500,
    CONSTRUCTION_BASE_BRICKS_REQUIRED: 10,
    CONSTRUCTION_TIME_PER_BRICK: 10000, // 10 seconds per brick
    
    // --- BUILDING TEMPLATES ---
    BUILDING_TEMPLATES: {
        'Storage': { 
            type: 'storage',
            description: 'Increases team storage capacity.', 
            bricks: 10,
            baseSlots: 50
        },
        'Personal Storage': { 
            type: 'personal_storage',
            description: 'A small, private stash for an individual.', 
            bricks: 20,
            baseSlots: 20 
        },
        'Carpentry Workshop': { 
            type: 'crafting',
            description: 'Craft wooden items and siege weapons.', 
            bricks: 10,
            recipeIds: [0], // Wooden Shield
            baseSlots: 5
        },
        'Smithing Workshop': { 
            type: 'crafting',
            description: 'Forge metal armor and weapons.', 
            bricks: 10,
            recipeIds: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
            baseSlots: 5
        },
        'Brewing Workshop': { 
            type: 'crafting',
            description: 'Create powerful potions.', 
            bricks: 10,
            recipeIds: [1, 2], // Health Potion, Magic Scroll
            baseSlots: 5
        },
        'Kitchen': { 
            type: 'crafting',
            description: 'Cook food for long-lasting buffs.', 
            bricks: 10,
            recipeIds: [],
            baseSlots: 5
        },
        'Runecrafting Workshop': {
            type: 'crafting',
            description: 'Imbue items with magical runes.',
            bricks: 10,
            recipeIds: [31, 35, 36, 37, 38, 39, 40, 41],
            baseSlots: 5
        },
        'Jewelry Workshop': {
            type: 'crafting',
            description: 'Craft rings, amulets, and other trinkets.',
            bricks: 10,
            recipeIds: [32, 33],
            baseSlots: 5
        },
        'Tailoring Workshop': {
            type: 'crafting',
            description: 'Create cloth and leather armor.',
            bricks: 10,
            recipeIds: [34],
            baseSlots: 5
        },
        'Enhancement Station': {
            type: 'enhancement',
            description: 'Enhance your equipment with powerful runes.',
            bricks: 10
        }
    },

    // --- BUILDING UPGRADE REQUIREMENTS ---
    BUILDING_UPGRADE_REQUIREMENTS: {
        'Smithing Workshop': [
            { level: 2, materials: [{ name: '🧱 Brick', quantity: 100 }, { name: '🔩 Iron Bar', quantity: 50 }] },
            { level: 3, materials: [{ name: '🧱 Brick', quantity: 200 }, { name: '🔗 Steel Bar', quantity: 50 }] },
            { level: 4, materials: [{ name: '🧱 Brick', quantity: 300 }, { name: '✨ Mithril Bar', quantity: 50 }] },
            { level: 5, materials: [{ name: '🧱 Brick', quantity: 400 }, { name: '💎 Adamantium Bar', quantity: 50 }] },
            { level: 6, materials: [{ name: '🧱 Brick', quantity: 500 }, { name: '🔩 Iron Bar', quantity: 250 }] },
            { level: 7, materials: [{ name: '🧱 Brick', quantity: 600 }, { name: '🔗 Steel Bar', quantity: 250 }] },
            { level: 8, materials: [{ name: '🧱 Brick', quantity: 700 }, { name: '✨ Mithril Bar', quantity: 250 }] },
            { level: 9, materials: [{ name: '🧱 Brick', quantity: 800 }, { name: '💎 Adamantium Bar', quantity: 250 }] },
            { level: 10, materials: [{ name: '🧱 Brick', quantity: 1000 }, { name: '🔩 Iron Bar', quantity: 500 }, { name: '🔗 Steel Bar', quantity: 500 }] }
        ],
        'Storage': [
            { level: 2, materials: [{ name: '🧱 Brick', quantity: 100 }] },
            { level: 3, materials: [{ name: '🧱 Brick', quantity: 200 }] },
            { level: 4, materials: [{ name: '🧱 Brick', quantity: 300 }] },
            { level: 5, materials: [{ name: '🧱 Brick', quantity: 400 }] },
            { level: 6, materials: [{ name: '🧱 Brick', quantity: 500 }] },
            { level: 7, materials: [{ name: '🧱 Brick', quantity: 600 }] },
            { level: 8, materials: [{ name: '🧱 Brick', quantity: 700 }] },
            { level: 9, materials: [{ name: '🧱 Brick', quantity: 800 }] },
            { level: 10, materials: [{ name: '🧱 Brick', quantity: 1000 }] }
        ],
        'Personal Storage': [
            { level: 2, materials: [{ name: '🧱 Brick', quantity: 50 }] },
            { level: 3, materials: [{ name: '🧱 Brick', quantity: 100 }] },
            { level: 4, materials: [{ name: '🧱 Brick', quantity: 150 }] },
            { level: 5, materials: [{ name: '🧱 Brick', quantity: 200 }] },
            { level: 6, materials: [{ name: '🧱 Brick', quantity: 250 }] },
            { level: 7, materials: [{ name: '🧱 Brick', quantity: 300 }] },
            { level: 8, materials: [{ name: '🧱 Brick', quantity: 350 }] },
            { level: 9, materials: [{ name: '🧱 Brick', quantity: 400 }] },
            { level: 10, materials: [{ name: '🧱 Brick', quantity: 500 }] }
        ],
        'Carpentry Workshop': [
            { level: 2, materials: [{ name: '🧱 Brick', quantity: 100 }, { name: '🌳 Oak Wood', quantity: 50 }] },
            { level: 3, materials: [{ name: '🧱 Brick', quantity: 200 }, { name: '🌲 Pine Wood', quantity: 50 }] },
            { level: 4, materials: [{ name: '🧱 Brick', quantity: 300 }, { name: '🍁 Maple Wood', quantity: 50 }] },
            { level: 5, materials: [{ name: '🧱 Brick', quantity: 400 }, { name: '🌳 Birch Wood', quantity: 50 }] },
            { level: 6, materials: [{ name: '🧱 Brick', quantity: 500 }, { name: '🌳 Willow Wood', quantity: 50 }] },
            { level: 7, materials: [{ name: '🧱 Brick', quantity: 600 }, { name: '🍒 Cherry Wood', quantity: 50 }] },
            { level: 8, materials: [{ name: '🧱 Brick', quantity: 700 }, { name: '🪵 Mahogany Wood', quantity: 50 }] },
            { level: 9, materials: [{ name: '🧱 Brick', quantity: 800 }, { name: '🪵 Ebony Wood', quantity: 50 }] },
            { level: 10, materials: [{ name: '🧱 Brick', quantity: 1000 }, { name: '🌳 Ancient Wood', quantity: 50 }] }
        ],
        'Brewing Workshop': [
            { level: 2, materials: [{ name: '🧱 Brick', quantity: 100 }, { name: '👂 Goblin Ear', quantity: 20 }] },
            { level: 3, materials: [{ name: '🧱 Brick', quantity: 150 }, { name: '🐺 Wolf Pelt', quantity: 20 }] },
            { level: 4, materials: [{ name: '🧱 Brick', quantity: 200 }, { name: '🐻 Coarse Bear Fur', quantity: 20 }] },
            { level: 5, materials: [{ name: '🧱 Brick', quantity: 250 }, { name: '🕷️ Spider Leg', quantity: 20 }] },
            { level: 6, materials: [{ name: '🧱 Brick', quantity: 300 }, { name: '🐜 Ant Chitin Fragment', quantity: 20 }] },
            { level: 7, materials: [{ name: '🧱 Brick', quantity: 350 }, { name: '🐝 Bee Stinger', quantity: 20 }] },
            { level: 8, materials: [{ name: '🧱 Brick', quantity: 400 }, { name: '💍 Stolen Trinket', quantity: 20 }] },
            { level: 9, materials: [{ name: '🧱 Brick', quantity: 450 }, { name: '🐍 Snake Scale', quantity: 20 }] },
            { level: 10, materials: [{ name: '🧱 Brick', quantity: 500 }, { name: '🦂 Scorpion Chitin', quantity: 20 }] }
        ],
        'Kitchen': [
            { level: 2, materials: [{ name: '🧱 Brick', quantity: 100 }, { name: '🐟 Minnow', quantity: 50 }] },
            { level: 3, materials: [{ name: '🧱 Brick', quantity: 150 }, { name: '🐠 Trout', quantity: 50 }] },
            { level: 4, materials: [{ name: '🧱 Brick', quantity: 200 }, { name: '🐟 Arctic Char', quantity: 50 }] },
            { level: 5, materials: [{ name: '🧱 Brick', quantity: 250 }, { name: '🐟 Cod', quantity: 50 }] },
            { level: 6, materials: [{ name: '🧱 Brick', quantity: 300 }, { name: '🐟 Cavefish', quantity: 50 }] },
            { level: 7, materials: [{ name: '🧱 Brick', quantity: 350 }, { name: '🐟 Glacierfin Tuna', quantity: 50 }] },
            { level: 8, materials: [{ name: '🧱 Brick', quantity: 400 }, { name: '🗡️ Swordfish', quantity: 50 }] },
            { level: 9, materials: [{ name: '🧱 Brick', quantity: 450 }, { name: '🌙 Moon-Crested Salmon', quantity: 50 }] },
            { level: 10, materials: [{ name: '🧱 Brick', quantity: 500 }, { name: '⚫ Voidfish', quantity: 50 }] }
        ],
        'Runecrafting Workshop': [
            { level: 2, materials: [{ name: '🧱 Brick', quantity: 100 }, { name: '✨ Mithril Bar', quantity: 20 }] },
            { level: 3, materials: [{ name: '🧱 Brick', quantity: 150 }, { name: '💎 Adamantium Bar', quantity: 20 }] },
            { level: 4, materials: [{ name: '🧱 Brick', quantity: 200 }, { name: '❤️ Ruby', quantity: 30 }] },
            { level: 5, materials: [{ name: '🧱 Brick', quantity: 250 }, { name: '💙 Sapphire', quantity: 30 }] },
            { level: 6, materials: [{ name: '🧱 Brick', quantity: 300 }, { name: '💚 Emerald', quantity: 30 }] },
            { level: 7, materials: [{ name: '🧱 Brick', quantity: 350 }, { name: '💎 Diamond', quantity: 30 }] },
            { level: 8, materials: [{ name: '🧱 Brick', quantity: 400 }, { name: '✨ Starlight Dew', quantity: 10 }] },
            { level: 9, materials: [{ name: '🧱 Brick', quantity: 450 }, { name: '✨ Celestial Dewdrop', quantity: 10 }] },
            { level: 10, materials: [{ name: '🧱 Brick', quantity: 500 }, { name: '✨ Dew of the Cosmos', quantity: 10 }] }
        ],
        'Jewelry Workshop': [
            { level: 2, materials: [{ name: '🧱 Brick', quantity: 100 }, { name: '🥈 Silver Ore', quantity: 50 }] },
            { level: 3, materials: [{ name: '🧱 Brick', quantity: 150 }, { name: '💰 Gold Ore', quantity: 50 }] },
            { level: 4, materials: [{ name: '🧱 Brick', quantity: 200 }, { name: '❤️ Ruby', quantity: 20 }] },
            { level: 5, materials: [{ name: '🧱 Brick', quantity: 250 }, { name: '💙 Sapphire', quantity: 20 }] },
            { level: 6, materials: [{ name: '🧱 Brick', quantity: 300 }, { name: '💚 Emerald', quantity: 20 }] },
            { level: 7, materials: [{ name: '🧱 Brick', quantity: 350 }, { name: '💎 Diamond', quantity: 20 }] },
            { level: 8, materials: [{ name: '🧱 Brick', quantity: 400 }, { name: '✨ Mithril Bar', quantity: 30 }] },
            { level: 9, materials: [{ name: '🧱 Brick', quantity: 450 }, { name: '💎 Adamantium Bar', quantity: 30 }] },
            { level: 10, materials: [{ name: '🧱 Brick', quantity: 500 }, { name: '❤️ Heart of the Inferno', quantity: 5 }] }
        ],
        'Tailoring Workshop': [
            { level: 2, materials: [{ name: '🧱 Brick', quantity: 100 }, { name: '🐺 Wolf Pelt', quantity: 50 }] },
            { level: 3, materials: [{ name: '🧱 Brick', quantity: 150 }, { name: '🐻 Coarse Bear Fur', quantity: 50 }] },
            { level: 4, materials: [{ name: '🧱 Brick', quantity: 200 }, { name: '🐺 Dire Wolf Pelt', quantity: 50 }] },
            { level: 5, materials: [{ name: '🧱 Brick', quantity: 250 }, { name: '🧵 Sinew Strand', quantity: 100 }] },
            { level: 6, materials: [{ name: '🧱 Brick', quantity: 300 }, { name: '🕸️ Sticky Webbing', quantity: 100 }] },
            { level: 7, materials: [{ name: '🧱 Brick', quantity: 350 }, { name: '✨ Iridescent Chitin Plate', quantity: 20 }] },
            { level: 8, materials: [{ name: '🧱 Brick', quantity: 400 }, { name: '✨ Iridescent Wasp Wing', quantity: 20 }] },
            { level: 9, materials: [{ name: '🧱 Brick', quantity: 450 }, { name: '✨ Moon-Blessed Fur', quantity: 20 }] },
            { level: 10, materials: [{ name: '🧱 Brick', quantity: 500 }, { name: '🐉 Wyrmling Scale', quantity: 50 }] }
        ],
        'Enhancement Station': [
            { level: 2, materials: [{ name: '🧱 Brick', quantity: 200 }, { name: '✨ Starlight Dew', quantity: 20 }] },
            { level: 3, materials: [{ name: '🧱 Brick', quantity: 300 }, { name: '✨ Celestial Dewdrop', quantity: 20 }] },
            { level: 4, materials: [{ name: '🧱 Brick', quantity: 400 }, { name: '✨ Dew of the Cosmos', quantity: 20 }] },
            { level: 5, materials: [{ name: '🧱 Brick', quantity: 500 }, { name: '❤️ Ruby', quantity: 50 }] },
            { level: 6, materials: [{ name: '🧱 Brick', quantity: 600 }, { name: '💙 Sapphire', quantity: 50 }] },
            { level: 7, materials: [{ name: '🧱 Brick', quantity: 700 }, { name: '💚 Emerald', quantity: 50 }] },
            { level: 8, materials: [{ name: '🧱 Brick', quantity: 800 }, { name: '💎 Diamond', quantity: 50 }] },
            { level: 9, materials: [{ name: '🧱 Brick', quantity: 900 }, { name: '❤️ Heart of the Inferno', quantity: 10 }] },
            { level: 10, materials: [{ name: '🧱 Brick', quantity: 1200 }, { name: '❤️ Heart of the Ocean', quantity: 10 }] }
        ]
    },

    // --- CRAFTING RECIPES ---
    CRAFTING_RECIPES: [
        // Carpentry
        {
            id: 0,
            name: "Wooden Shield",
            building: "Carpentry Workshop",
            materials: [{ name: '🧱 Brick', quantity: 10 }], // Placeholder for wood
            result: { name: '🛡️ Wooden Shield', type: 'equipment', slot: 'hand', stats: { maxHp: 50 }, level: 1, quality: 'Common', enhancementSlots: 0, description: 'A simple wooden shield.' },
            craftingTime: 10000 
        },
        // Brewing
        {
            id: 1,
            name: "Health Potion",
            building: "Brewing Workshop",
            materials: [{ name: '🧱 Brick', quantity: 5 }], // Placeholder for herbs
            result: { name: '🧪 Health Potion', type: 'consumable', effects: { replenish: 'hp', value: 50 }, level: 1, quality: 'Common', description: 'Restores 50 HP.' },
            craftingTime: 5000
        },
        {
            id: 2,
            name: "Magic Scroll",
            building: "Brewing Workshop",
            materials: [{ name: '🧱 Brick', quantity: 15 }], // Placeholder for magical ingredients
            result: { name: '📜 Magic Scroll', type: 'scroll', effects: { buff: { stat: 'dmg', percentage: 50, duration: 30000 } }, level: 1, quality: 'Uncommon', description: 'Temporarily increases damage by 50% for 30 seconds.' },
            craftingTime: 20000
        },
        
        // --- Smithing: Bars ---
        {
            id: 3,
            name: "Iron Bar",
            building: "Smithing Workshop",
            materials: [{ name: '⛏️ Iron Ore', quantity: 5 }],
            result: { name: '🔩 Iron Bar', type: 'material', quantity: 1, level: 5, quality: 'Uncommon', description: 'A bar of refined iron.' },
            craftingTime: 100
        },
        {
            id: 4,
            name: "Steel Bar",
            building: "Smithing Workshop",
            materials: [{ name: '🔩 Iron Bar', quantity: 2 }],
            result: { name: '🔗 Steel Bar', type: 'material', quantity: 1, level: 15, quality: 'Rare', description: 'A bar of strong steel.' },
            craftingTime: 100
        },
        {
            id: 5,
            name: "Mithril Bar",
            building: "Smithing Workshop",
            materials: [{ name: '✨ Mithril Ore', quantity: 5 }],
            result: { name: '✨ Mithril Bar', type: 'material', quantity: 1, level: 25, quality: 'Epic', description: 'A lightweight and magical bar of mithril.' },
            craftingTime: 100
        },
        {
            id: 6,
            name: "Adamantium Bar",
            building: "Smithing Workshop",
            materials: [{ name: '🛡️ Adamantium Ore', quantity: 5 }],
            result: { name: '💎 Adamantium Bar', type: 'material', quantity: 1, level: 35, quality: 'Legendary', description: 'A bar of nearly indestructible adamantium.' },
            craftingTime: 100
        },

        // --- Smithing: Iron Set (Level 10) ---
        {
            id: 7,
            name: "Iron Sword",
            building: "Smithing Workshop",
            materials: [{ name: '🔩 Iron Bar', quantity: 4 }],
            result: { name: '🗡️ Iron Sword', type: 'equipment', slot: 'weapon', stats: { dmg: 10 }, level: 10, quality: 'Rare', enhancementSlots: 2, description: 'A sturdy iron sword.' },
            craftingTime: 100
        },
        {
            id: 8,
            name: "Iron Helmet",
            building: "Smithing Workshop",
            materials: [{ name: '🔩 Iron Bar', quantity: 3 }],
            result: { name: '⛑️ Iron Helmet', type: 'equipment', slot: 'helmet', stats: { maxHp: 50, def: 2 }, level: 10, quality: 'Rare', enhancementSlots: 2, description: 'A protective iron helmet.' },
            craftingTime: 100
        },
        {
            id: 9,
            name: "Iron Armor",
            building: "Smithing Workshop",
            materials: [{ name: '🔩 Iron Bar', quantity: 8 }],
            result: { name: '👕 Iron Armor', type: 'equipment', slot: 'armor', stats: { maxHp: 100, def: 5 }, level: 10, quality: 'Rare', enhancementSlots: 2, description: 'A suit of iron plate armor.' },
            craftingTime: 100
        },
        {
            id: 10,
            name: "Iron Legs",
            building: "Smithing Workshop",
            materials: [{ name: '🔩 Iron Bar', quantity: 5 }],
            result: { name: '👖 Iron Legs', type: 'equipment', slot: 'legs', stats: { maxHp: 75, def: 3 }, level: 10, quality: 'Rare', enhancementSlots: 2, description: 'Protective iron legplates.' },
            craftingTime: 100
        },
        {
            id: 11,
            name: "Iron Gloves",
            building: "Smithing Workshop",
            materials: [{ name: '🔩 Iron Bar', quantity: 2 }],
            result: { name: '🧤 Iron Gloves', type: 'equipment', slot: 'gloves', stats: { dmg: 3, accuracy: 5 }, level: 10, quality: 'Rare', enhancementSlots: 2, description: 'A pair of iron gauntlets.' },
            craftingTime: 100
        },
        {
            id: 12,
            name: "Iron Boots",
            building: "Smithing Workshop",
            materials: [{ name: '🔩 Iron Bar', quantity: 2 }],
            result: { name: '🥾 Iron Boots', type: 'equipment', slot: 'boots', stats: { speed: 0.2, dodge: 2 }, level: 10, quality: 'Rare', enhancementSlots: 2, description: 'Sturdy iron boots.' },
            craftingTime: 100
        },

        // --- Smithing: Steel Set (Level 20) ---
        {
            id: 13,
            name: "Steel Sword",
            building: "Smithing Workshop",
            materials: [{ name: '🔗 Steel Bar', quantity: 4 }],
            result: { name: '🗡️ Steel Sword', type: 'equipment', slot: 'weapon', stats: { dmg: 20 }, level: 20, quality: 'Rare', enhancementSlots: 2, description: 'A sharp and reliable steel sword.' },
            craftingTime: 100
        },
        {
            id: 14,
            name: "Steel Helmet",
            building: "Smithing Workshop",
            materials: [{ name: '🔗 Steel Bar', quantity: 3 }],
            result: { name: '⛑️ Steel Helmet', type: 'equipment', slot: 'helmet', stats: { maxHp: 100, def: 4 }, level: 20, quality: 'Rare', enhancementSlots: 2, description: 'A well-forged steel helmet.' },
            craftingTime: 100
        },
        {
            id: 15,
            name: "Steel Armor",
            building: "Smithing Workshop",
            materials: [{ name: '🔗 Steel Bar', quantity: 8 }],
            result: { name: '👕 Steel Armor', type: 'equipment', slot: 'armor', stats: { maxHp: 200, def: 10 }, level: 20, quality: 'Rare', enhancementSlots: 2, description: 'A suit of strong steel plate armor.' },
            craftingTime: 100
        },
        {
            id: 16,
            name: "Steel Legs",
            building: "Smithing Workshop",
            materials: [{ name: '🔗 Steel Bar', quantity: 5 }],
            result: { name: '👖 Steel Legs', type: 'equipment', slot: 'legs', stats: { maxHp: 150, def: 6 }, level: 20, quality: 'Rare', enhancementSlots: 2, description: 'Protective steel legplates.' },
            craftingTime: 100
        },
        {
            id: 17,
            name: "Steel Gloves",
            building: "Smithing Workshop",
            materials: [{ name: '🔗 Steel Bar', quantity: 2 }],
            result: { name: '🧤 Steel Gloves', type: 'equipment', slot: 'gloves', stats: { dmg: 6, accuracy: 10 }, level: 20, quality: 'Rare', enhancementSlots: 2, description: 'A pair of protective steel gauntlets.' },
            craftingTime: 100
        },
        {
            id: 18,
            name: "Steel Boots",
            building: "Smithing Workshop",
            materials: [{ name: '🔗 Steel Bar', quantity: 2 }],
            result: { name: '🥾 Steel Boots', type: 'equipment', slot: 'boots', stats: { speed: 0.4, dodge: 4 }, level: 20, quality: 'Rare', enhancementSlots: 2, description: 'Durable steel boots.' },
            craftingTime: 100
        },

        // --- Smithing: Mithril Set (Level 30) ---
        {
            id: 19,
            name: "Mithril Sword",
            building: "Smithing Workshop",
            materials: [{ name: '✨ Mithril Bar', quantity: 4 }],
            result: { name: '🗡️ Mithril Sword', type: 'equipment', slot: 'weapon', stats: { dmg: 35, speed: 0.1 }, level: 30, quality: 'Epic', enhancementSlots: 3, description: 'A lightweight and deadly mithril sword.' },
            craftingTime: 120000
        },
        {
            id: 20,
            name: "Mithril Helmet",
            building: "Smithing Workshop",
            materials: [{ name: '✨ Mithril Bar', quantity: 3 }],
            result: { name: '⛑️ Mithril Helmet', type: 'equipment', slot: 'helmet', stats: { maxHp: 175, def: 7 }, level: 30, quality: 'Epic', enhancementSlots: 3, description: 'A masterwork mithril helmet.' },
            craftingTime: 120000
        },
        {
            id: 21,
            name: "Mithril Armor",
            building: "Smithing Workshop",
            materials: [{ name: '✨ Mithril Bar', quantity: 8 }],
            result: { name: '👕 Mithril Armor', type: 'equipment', slot: 'armor', stats: { maxHp: 350, def: 15 }, level: 30, quality: 'Epic', enhancementSlots: 3, description: 'A suit of beautiful and light mithril plate.' },
            craftingTime: 120000
        },
        {
            id: 22,
            name: "Mithril Legs",
            building: "Smithing Workshop",
            materials: [{ name: '✨ Mithril Bar', quantity: 5 }],
            result: { name: '👖 Mithril Legs', type: 'equipment', slot: 'legs', stats: { maxHp: 250, def: 10 }, level: 30, quality: 'Epic', enhancementSlots: 3, description: 'Protective mithril legplates.' },
            craftingTime: 120000
        },
        {
            id: 23,
            name: "Mithril Gloves",
            building: "Smithing Workshop",
            materials: [{ name: '✨ Mithril Bar', quantity: 2 }],
            result: { name: '🧤 Mithril Gloves', type: 'equipment', slot: 'gloves', stats: { dmg: 10, accuracy: 15 }, level: 30, quality: 'Epic', enhancementSlots: 3, description: 'A pair of fine mithril gauntlets.' },
            craftingTime: 120000
        },
        {
            id: 24,
            name: "Mithril Boots",
            building: "Smithing Workshop",
            materials: [{ name: '✨ Mithril Bar', quantity: 2 }],
            result: { name: '🥾 Mithril Boots', type: 'equipment', slot: 'boots', stats: { speed: 0.6, dodge: 7 }, level: 30, quality: 'Epic', enhancementSlots: 3, description: 'Light and silent mithril boots.' },
            craftingTime: 120000
        },

        // --- Smithing: Adamantium Set (Level 40) ---
        {
            id: 25,
            name: "Adamantium Sword",
            building: "Smithing Workshop",
            materials: [{ name: '💎 Adamantium Bar', quantity: 4 }],
            result: { name: '🗡️ Adamantium Sword', type: 'equipment', slot: 'weapon', stats: { dmg: 50, speed: -0.1 }, level: 40, quality: 'Legendary', enhancementSlots: 4, description: 'An incredibly heavy but devastating adamantium sword.' },
            craftingTime: 240000
        },
        {
            id: 26,
            name: "Adamantium Helmet",
            building: "Smithing Workshop",
            materials: [{ name: '💎 Adamantium Bar', quantity: 3 }],
            result: { name: '⛑️ Adamantium Helmet', type: 'equipment', slot: 'helmet', stats: { maxHp: 300, def: 12 }, level: 40, quality: 'Legendary', enhancementSlots: 4, description: 'An nigh-indestructible adamantium helmet.' },
            craftingTime: 240000
        },
        {
            id: 27,
            name: "Adamantium Armor",
            building: "Smithing Workshop",
            materials: [{ name: '💎 Adamantium Bar', quantity: 8 }],
            result: { name: '👕 Adamantium Armor', type: 'equipment', slot: 'armor', stats: { maxHp: 600, def: 25 }, level: 40, quality: 'Legendary', enhancementSlots: 4, description: 'The ultimate suit of adamantium plate armor.' },
            craftingTime: 240000
        },
        {
            id: 28,
            name: "Adamantium Legs",
            building: "Smithing Workshop",
            materials: [{ name: '💎 Adamantium Bar', quantity: 5 }],
            result: { name: '👖 Adamantium Legs', type: 'equipment', slot: 'legs', stats: { maxHp: 450, def: 18 }, level: 40, quality: 'Legendary', enhancementSlots: 4, description: 'Immovable adamantium legplates.' },
            craftingTime: 240000
        },
        {
            id: 29,
            name: "Adamantium Gloves",
            building: "Smithing Workshop",
            materials: [{ name: '💎 Adamantium Bar', quantity: 2 }],
            result: { name: '🧤 Adamantium Gloves', type: 'equipment', slot: 'gloves', stats: { dmg: 15, accuracy: 20 }, level: 40, quality: 'Legendary', enhancementSlots: 4, description: 'A pair of crushing adamantium gauntlets.' },
            craftingTime: 240000
        },
        {
            id: 30,
            name: "Adamantium Boots",
            building: "Smithing Workshop",
            materials: [{ name: '💎 Adamantium Bar', quantity: 2 }],
            result: { name: '🥾 Adamantium Boots', type: 'equipment', slot: 'boots', stats: { speed: 0.8, dodge: 10 }, level: 40, quality: 'Legendary', enhancementSlots: 4, description: 'Heavy but surprisingly agile adamantium boots.' },
            craftingTime: 240000
        },

        // --- Runecrafting ---
        {
            id: 31,
            name: "Minor Strength Rune",
            building: "Runecrafting Workshop",
            materials: [{ name: '❤️ Ruby', quantity: 5 }],
            result: { name: '🔥 Minor Strength Rune', type: 'rune', stats: { dmg: 5 }, level: 10, quality: 'Uncommon', description: 'A simple rune that can be applied to a weapon to increase its damage.' },
            craftingTime: 60000
        },

        // --- Jewelry ---
        {
            id: 32,
            name: "Silver Ring",
            building: "Jewelry Workshop",
            materials: [{ name: '🥈 Silver Ore', quantity: 10 }],
            result: { name: '💍 Silver Ring', type: 'equipment', slot: 'ring', stats: { maxHp: 20 }, level: 5, quality: 'Uncommon', enhancementSlots: 1, description: 'A simple but elegant silver ring.' },
            craftingTime: 30000
        },
        {
            id: 33,
            name: "Gold Amulet",
            building: "Jewelry Workshop",
            materials: [{ name: '💰 Gold Ore', quantity: 10 }],
            result: { name: '📿 Gold Amulet', type: 'equipment', slot: 'amulet', stats: { maxMp: 20 }, level: 10, quality: 'Rare', enhancementSlots: 2, description: 'A fine gold amulet that enhances magical reserves.' },
            craftingTime: 90000
        },

        // --- Tailoring ---
        {
            id: 34,
            name: "Wolf Pelt Cloak",
            building: "Tailoring Workshop",
            materials: [{ name: '🐺 Wolf Pelt', quantity: 5 }],
            result: { name: '🧥 Wolf Pelt Cloak', type: 'equipment', slot: 'cape', stats: { dodge: 3, speed: 0.1 }, level: 8, quality: 'Uncommon', enhancementSlots: 1, description: 'A warm cloak made from wolf pelts.' },
            craftingTime: 45000
        },

        // --- Runecrafting Stat Runes ---
        {
            id: 35,
            name: "Minor Health Rune",
            building: "Runecrafting Workshop",
            materials: [{ name: '💚 Emerald', quantity: 5 }],
            result: { name: '❤️ Minor Health Rune', type: 'rune', stats: { maxHp: 20 }, level: 10, quality: 'Uncommon', description: 'A simple rune that increases maximum health.' },
            craftingTime: 60000
        },
        {
            id: 36,
            name: "Minor Mana Rune",
            building: "Runecrafting Workshop",
            materials: [{ name: '💙 Sapphire', quantity: 5 }],
            result: { name: '💧 Minor Mana Rune', type: 'rune', stats: { maxMp: 20 }, level: 10, quality: 'Uncommon', description: 'A simple rune that increases maximum mana.' },
            craftingTime: 60000
        },
        {
            id: 37,
            name: "Minor Speed Rune",
            building: "Runecrafting Workshop",
            materials: [{ name: '💎 Diamond', quantity: 2 }],
            result: { name: '⚡ Minor Speed Rune', type: 'rune', stats: { speed: 0.2 }, level: 15, quality: 'Rare', description: 'A rune that quickens your movements.' },
            craftingTime: 120000
        },
        {
            id: 38,
            name: "Minor Critical Rune",
            building: "Runecrafting Workshop",
            materials: [{ name: '✨ Starlight Dew', quantity: 5 }],
            result: { name: '🎯 Minor Critical Rune', type: 'rune', stats: { critical: 5 }, level: 20, quality: 'Rare', description: 'A rune that sharpens your critical eye.' },
            craftingTime: 180000
        },
        {
            id: 39,
            name: "Minor Dodge Rune",
            building: "Runecrafting Workshop",
            materials: [{ name: '✨ Celestial Dewdrop', quantity: 5 }],
            result: { name: '💨 Minor Dodge Rune', type: 'rune', stats: { dodge: 5 }, level: 20, quality: 'Rare', description: 'A rune that helps you evade attacks.' },
            craftingTime: 180000
        },
        {
            id: 40,
            name: "Minor Accuracy Rune",
            building: "Runecrafting Workshop",
            materials: [{ name: '✨ Dew of the Cosmos', quantity: 5 }],
            result: { name: '👁️ Minor Accuracy Rune', type: 'rune', stats: { accuracy: 5 }, level: 20, quality: 'Rare', description: 'A rune that guides your attacks to their target.' },
            craftingTime: 180000
        },
        {
            id: 41,
            name: "Minor Defense Rune",
            building: "Runecrafting Workshop",
            materials: [{ name: '🧱 Brick', quantity: 500 }],
            result: { name: '🛡️ Minor Defense Rune', type: 'rune', stats: { def: 3 }, level: 15, quality: 'Uncommon', description: 'A rune that hardens your defenses.' },
            craftingTime: 120000
        }
    ],

    // Siege Machine Settings
    SIEGE_MACHINE_COST: 10, // bricks
    SIEGE_MACHINE_HP: 300,
    SIEGE_MACHINE_DAMAGE: 10, // damage per second
    SIEGE_MACHINE_SELF_DAMAGE: 10, // self-damage per second

    // Enemy Settings
    ENEMY_RESPAWN_TIME: 5000, // 5 seconds
    ENEMY_STAT_SCALING_PER_LEVEL: 0.10, // 10% increase per level

    // --- ENEMY DEFINITIONS ---
    ENEMY_TEMPLATES: [
        // Forest Biome Monsters
        { name: 'Goblin Scout', rarity: 60, baseStats: { hp: 50, dmg: 3, speed: 1.2 }, weakness: 'hunting', weaknessXp: 10, isBoss: false, biome: 'FOREST', drops: [
            { name: '👂 Goblin Ear', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A common trophy from a Goblin Scout.' },
            { name: '🔪 Rusty Dagger', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A poorly-maintained goblin weapon.' },
            { name: '👜 Tattered Pouch', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'Could hold a few stolen coins.' },
            { name: "🗺️ Goblin's Grimy Map", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A crudely drawn map to a hidden stash.' },
            { name: "👁️ Scout's Eye Trinket", type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A trinket said to enhance perception.' },
            { name: "👑 Goblin King's Lost Crown Fragment", type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A piece of a long-lost royal artifact.' }
        ] },
        { name: 'Wolf', rarity: 70, baseStats: { hp: 150, dmg: 3, speed: 1.5 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🐺 Wolf Pelt', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A thick and warm wolf pelt.' },
            { name: '🦷 Sharp Canine', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A sharp tooth from a wolf.' },
            { name: '🧵 Sinew Strand', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'Strong and flexible, good for binding.' },
            { name: "🦷 Alpha's Fang", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'The fang of a pack leader.' },
            { name: '🌕 Moon-Blessed Fur', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'Fur that seems to glow under moonlight.' },
            { name: '🗿 Spirit of the Pack Totem', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'Embodies the unity and ferocity of the pack.' }
        ] },
        { name: 'Bear', rarity: 40, baseStats: { hp: 120, dmg: 5, speed: 0.8 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🐻 Coarse Bear Fur', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'Thick fur offering decent insulation.' },
            { name: '🦴 Bear Bone', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A large, sturdy bone.' },
            { name: '🧸 Thick Bear Hide', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'Excellent for crafting durable armor.' },
            { name: '🐾 Grizzled Claw', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'The razor-sharp claw of a powerful bear.' },
            { name: '💪 Ursine Strength Totem', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A totem imbued with the might of a great bear.' },
            { name: '❤️ Heart of the Forest Guardian', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The pulsating heart of a legendary beast.' }
        ] },
        { name: 'Spider', rarity: 45, baseStats: { hp: 300, dmg: 7, speed: 1.3 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🕷️ Spider Leg', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A spindly, chitinous leg.' },
            { name: '🕸️ Sticky Webbing', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Tough and sticky silk.' },
            { name: '💧 Venom Sac', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A small sac containing potent venom.' },
            { name: '🕸️ Spinneret Gland', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'The organ responsible for producing incredibly strong silk.' },
            { name: '✨ Iridescent Chitin Plate', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A piece of spider armor that shimmers with many colors.' },
            { name: "💎 Matriarch's Jeweled Eye", type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A multi-faceted eye from a colossal spider queen.' }
        ] },
        { name: 'Ant', rarity: 65, baseStats: { hp: 250, dmg: 8, speed: 0.9 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🐜 Ant Chitin Fragment', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A small piece of an ant exoskeleton.' },
            { name: '💧 Pheromone Gland', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Emits a faint, chemical scent.' },
            { name: '🐜 Soldier Ant Mandible', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A sharp pincer from a soldier ant.' },
            { name: "🍯 Queen's Royal Jelly", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A highly nutritious and sought-after substance.' },
            { name: '💎 Crystallized Ant Nectar', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A sweet, hardened nectar with magical properties.' },
            { name: '❤️ Heart of the Hive', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The central consciousness of an entire ant colony.' }
        ] },
        { name: 'Bee', rarity: 60, baseStats: { hp: 500, dmg: 7, speed: 1.0 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🐝 Bee Stinger', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A sharp, tiny stinger.' },
            { name: '🕯️ Beeswax Lump', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A sticky lump of beeswax.' },
            { name: '🍯 Pot of Honey', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'Sweet, natural honey.' },
            { name: '🌸 Royal Pollen', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A vibrant pollen reserved for the queen.' },
            { name: "🐝 Queen Bee's Stinger", type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A massive stinger from a hive queen.' },
            { name: '✨ Essence of the Swarm', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The collective will of a hive, crystallized.' }
        ] },
        { name: 'Wasp', rarity: 50, baseStats: { hp: 650, dmg: 25, speed: 2.5 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🐝 Wasp Carapace', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A piece of the wasp\'s tough exoskeleton.' },
            { name: '📜 Papery Nest Material', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Chewed wood pulp used for nests.' },
            { name: '💧 Potent Venom Gland', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A gland filled with painful venom.' },
            { name: '🐝 Serrated Wasp Stinger', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A viciously barbed stinger.' },
            { name: '✨ Iridescent Wasp Wing', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A wing that buzzes with contained energy.' },
            { name: '❤️ Heartstone of the Nest', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A stone that commands the loyalty of all wasps.' }
        ] },
        { name: 'Centipede', rarity: 40, baseStats: { hp: 380, dmg: 15, speed: 1.5 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🐛 Centipede Leg', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'One of many sharp legs.' },
            { name: '🐛 Chitin Segment', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A segment from its armored body.' },
            { name: '💧 Neurotoxin Sac', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A sac containing a paralyzing toxin.' },
            { name: '🐛 Giant Centipede Mandible', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A powerful jaw used for crushing prey.' },
            { name: '🧠 Pulsating Nerve Cluster', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The source of its uncanny speed.' },
            { name: '🌀 Core of the Hundred Legs', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'An artifact that grants unnatural coordination.' }
        ] },
        { name: 'Beetle', rarity: 45, baseStats: { hp: 1020, dmg: 10, speed: 1.3 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🐞 Beetle Shell Fragment', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A small piece of tough shell.' },
            { name: '🐞 Beetle Leg', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A sturdy, armored leg.' },
            { name: '🛡️ Hardened Carapace', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A large, durable plate of beetle armor.' },
            { name: '✨ Iridescent Elytron', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'The beautiful, shimmering wing case of a beetle.' },
            { name: '🤘 Horn of the Goliath Beetle', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The immense horn of a champion beetle.' },
            { name: '💎 Gemstone Beetle Heart', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A heart that has crystallized into a precious gem.' }
        ] },
        { name: 'Mantis', rarity: 30, baseStats: { hp: 460, dmg: 21, speed: 1.6 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🦗 Mantis Foreleg', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A swift, sharp foreleg.' },
            { name: '🦋 Shredded Wing', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A delicate, damaged wing.' },
            { name: '🔪 Serrated Scythe Claw', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'The bladed claw used for hunting.' },
            { name: '👁️ Perfect Mantis Eye', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A compound eye that sees with incredible clarity.' },
            { name: '⏳ Essence of the Patient Hunter', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A fluid that grants unnatural stillness and speed.' },
            { name: '❤️ Heart of the Mantis God', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The core of a mythical, giant mantis.' }
        ] },
        { name: 'Eagle', rarity: 20, baseStats: { hp: 375, dmg: 14, speed: 1.8 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🦅 Eagle Feather', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A large, sturdy feather.' },
            { name: '🐾 Sharp Talon', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A talon capable of tearing flesh.' },
            { name: "🦅 Eagle's Beak", type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A powerful, hooked beak.' },
            { name: "💨 Wind-Rider's Plume", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A feather that hums with the power of the wind.' },
            { name: "👁️ Stormgazer's Eye", type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'An eye that has seen the heart of a thunderstorm.' },
            { name: '❤️ Heart of the Sky Lord', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The heart of a king of the skies.' }
        ] },
        { name: 'Owl', rarity: 25, baseStats: { hp: 770, dmg: 12, speed: 1.1 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🦉 Owl Feather', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A soft, silent feather.' },
            { name: '🐾 Owl Talon', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A sharp, curved talon.' },
            { name: '🤫 Silent Flight Feather', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A primary feather, serrated for silent flight.' },
            { name: '🌕 Moonlit Beak', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A beak that seems to absorb moonlight.' },
            { name: '🔮 Orb of Silent Wisdom', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A crystallized pellet that contains profound knowledge.' },
            { name: '❤️ Heart of the Night Hunter', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The heart of a master of nocturnal hunts.' }
        ] },
        { name: 'Hawk', rarity: 35, baseStats: { hp: 300, dmg: 15, speed: 0.5 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🦅 Hawk Feather', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A sleek, aerodynamic feather.' },
            { name: '🐾 Hawk Talon', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A razor-sharp talon.' },
            { name: '👁️ Keen Hawk Eye', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'An eye that can spot prey from miles away.' },
            { name: "🦴 Sun-Glider's Wingbone", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'An incredibly light and strong hollow bone.' },
            { name: '✨ Essence of Piercing Sight', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A liquid that can grant telescopic vision.' },
            { name: '👻 Soul of the Apex Predator', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The captured spirit of an unmatched aerial hunter.' }
        ] },
        { name: 'Falcon', rarity: 30, baseStats: { hp: 365, dmg: 35, speed: 2.2 }, weakness: 'hunting', isBoss: false, biome: 'FOREST', drops: [
            { name: '🦅 Falcon Feather', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A feather designed for speed.' },
            { name: '🐾 Falcon Talon', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A fine, sharp talon.' },
            { name: '💨 Aerodynamic Tail Feather', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A feather crucial for high-speed maneuvers.' },
            { name: "🔪 Wind-Cutter's Beak", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A beak sharpened by diving at incredible speeds.' },
            { name: '⚡ Essence of Swiftness', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A swirling vial containing the concept of speed.' },
            { name: '❤️ Heart of the Unseen Striker', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The heart of a falcon so fast it was never seen.' }
        ] },
        
        // Desert Biome Monsters
        { name: 'Bandit', rarity: 50, baseStats: { hp: 60, dmg: 8, speed: 1.0 }, weakness: 'hunting', isBoss: false, biome: 'DESERT', drops: [
            { name: '💍 Stolen Trinket', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'Something shiny and of little value.' },
            { name: '🧣 Ragged Bandana', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A dirty bandana used to hide their identity.' },
            { name: '💰 Marked Coin Pouch', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A leather pouch with a strange symbol.' },
            { name: "🗺️ Bandit's Treasure Map", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A map piece leading to stolen goods.' },
            { name: "🎖️ Chieftain's Insignia", type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A symbol of leadership among the bandits.' },
            { name: '🔑 Key to the Lost Stash', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'Unlocks a treasure hidden for generations.' }
        ] },
        { name: 'Snake', rarity: 35, baseStats: { hp: 120, dmg: 10, speed: 1.2 }, weakness: 'hunting', isBoss: false, biome: 'DESERT', drops: [
            { name: '🐍 Snake Scale', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A dry, patterned scale.' },
            { name: '🦷 Snake Fang', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A hollow fang, still dripping venom.' },
            { name: '💧 Potent Venom Gland', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A gland full of deadly desert snake venom.' },
            { name: '🐍 Molted Serpent Skin', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A large, intact piece of shed skin.' },
            { name: '👁️ Eye of the Serpent', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A mesmerizing, unblinking eye.' },
            { name: '❤️ Heartstone of the Great Serpent', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The crystallized soul of a primeval snake.' }
        ] },
        { name: 'Scorpion', rarity: 30, baseStats: { hp: 100, dmg: 12, speed: 1.3 }, weakness: 'hunting', isBoss: false, biome: 'DESERT', drops: [
            { name: '🦂 Scorpion Chitin', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A piece of its hard exoskeleton.' },
            { name: '🦞 Scorpion Pincer', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A small but sharp pincer.' },
            { name: '🦂 Barbed Stinger', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'The venomous tip of the scorpion\'s tail.' },
            { name: '💧 Concentrated Neurotoxin', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A vial of extremely potent poison.' },
            { name: '🏜️ Sand-Scoured Carapace', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The back plate of an ancient scorpion, hardened by millennia of sandstorms.' },
            { name: '❤️ Heartstone of the Dune Stalker', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The core of a mythical scorpion as large as a hill.' }
        ] },
        { name: 'Vulture', rarity: 30, baseStats: { hp: 330, dmg: 18, speed: 1.6 }, weakness: 'hunting', isBoss: false, biome: 'DESERT', drops: [
            { name: '🪶 Dirty Feather', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A sand-covered feather.' },
            { name: '🦴 Bone Fragment', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A piece of some unfortunate creature\'s bone.' },
            { name: "🦅 Scavenger's Beak", type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A beak strong enough to tear through hide.' },
            { name: "👁️ Death-Watcher's Eye", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'An eye that has seen a thousand deaths.' },
            { name: '🪶 Plume of the Carrion Lord', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A feather from a titanic vulture that darkens the sun.' },
            { name: '👻 Soul of the Eternal Wait', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The essence of patience, harvested from a creature that can wait for eternity.' }
        ] },
        { name: 'Raven', rarity: 40, baseStats: { hp: 1500, dmg: 8, speed: 1.9 }, weakness: 'hunting', isBoss: false, biome: 'DESERT', drops: [
            { name: '🐦‍⬛ Black Feather', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A glossy, dark feather.' },
            { name: '✨ Shiny Trinket', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A small object a raven found interesting.' },
            { name: '🔮 Omen-Feather', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A feather that seems to whisper of the future.' },
            { name: "👁️ Raven's Cunning Eye", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'An eye that gleams with intelligence.' },
            { name: '🦇 Essence of the Shadow Wing', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A drop of pure shadow from a raven\'s wing.' },
            { name: '❤️ Heart of the Trickster God', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The core of a powerful, ancient spirit of cunning.' }
        ] },
        { name: 'Crow', rarity: 45, baseStats: { hp: 450, dmg: 7, speed: 1.4 }, weakness: 'hunting', isBoss: false, biome: 'DESERT', drops: [
            { name: '🐦 Crow Feather', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A simple black feather.' },
            { name: '💎 Polished Stone', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A smooth stone collected by the crow.' },
            { name: '🔪 Murder-Feather', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A feather from a crow that has seen battle.' },
            { name: "🐦 Collector's Beak", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A beak skilled at prying loose valuable objects.' },
            { name: '✨ Essence of the Flock', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The shared memory of an entire murder of crows.' },
            { name: '👻 Soul of the Harbinger', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A soul that has guided countless others to the afterlife.' }
        ] },
        
        // Volcanic Biome Monsters
        { name: 'Troll', rarity: 30, baseStats: { hp: 200, dmg: 15, speed: 0.6 }, weakness: 'hunting', isBoss: false, biome: 'VOLCANIC', drops: [
            { name: '👹 Troll Hide Scrap', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A tough, leathery scrap of hide.' },
            { name: '🦷 Troll Tusk', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A large, blunt tusk.' },
            { name: '🩸 Regenerating Blood', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A vial of blood that slowly clots and heals over.' },
            { name: '🦴 Unbreakable Troll Bone', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A bone renowned for its incredible density.' },
            { name: '❤️ Heart of the Mountain Troll', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A sluggishly beating heart, warm to the touch.' },
            { name: '💎 Runestone of Troll Dominion', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A stone that holds the secret to the trolls\' regeneration.' }
        ] },
        { name: 'Gargoyle', rarity: 15, baseStats: { hp: 180, dmg: 7, speed: 0.9 }, weakness: 'hunting', isBoss: false, biome: 'VOLCANIC', drops: [
            { name: '🗿 Stone Shard', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A sharp shard of animated stone.' },
            { name: '💨 Granite Dust', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A pouch of fine, magical stone dust.' },
            { name: '🗿 Chiseled Stone Wing', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A fragment of a gargoyle\'s wing.' },
            { name: '🗿 Living Rock Fragment', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A piece of rock that still twitches with life.' },
            { name: '🔮 Core of Sentinel Magic', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The magical core that animates a gargoyle.' },
            { name: '❤️ Heart of the Unsleeping Guardian', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The heart of a master gargoyle that has watched over a city for eons.' }
        ] },
        { name: 'Vampire', rarity: 10, baseStats: { hp: 380, dmg: 12, speed: 1.1 }, weakness: 'hunting', isBoss: false, biome: 'VOLCANIC', drops: [
            { name: '🪦 Grave Soil', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A handful of soil from its resting place.' },
            { name: '👕 Tattered Noble Garb', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A scrap of fine, but ancient, clothing.' },
            { name: '🧛 Blood-tinged Fangs', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'Fangs stained with the blood of countless victims.' },
            { name: '🧿 Cursed Medallion', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'An elegant medallion that carries a dark curse.' },
            { name: '🌃 Essence of Night', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A vial containing pure, magical darkness.' },
            { name: '❤️ Heart of the Progenitor Vampire', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The still-beating heart of the very first vampire.' }
        ] },
        { name: 'Dragon Wyrmling', rarity: 5, baseStats: { hp: 450, dmg: 13, speed: 1.0 }, weakness: 'hunting', isBoss: false, biome: 'VOLCANIC', drops: [
            { name: '🐉 Wyrmling Scale', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A small, but very tough, dragon scale.' },
            { name: '🔥 Smoldering Ember', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'An ember from its breath that never cools.' },
            { name: '🐾 Immature Dragon Claw', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A claw that is still growing into a formidable weapon.' },
            { name: '🔥 Fire Gland', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'The organ that allows a dragon to breathe fire.' },
            { name: '🥚 Pulsating Dragon Egg Fragment', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A piece of an eggshell that hums with power.' },
            { name: '✨ Spark of the Dragon Soul', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A tiny fragment of a true dragon\'s soul.' }
        ] },
        { name: 'Giant Phoenix', rarity: 3, baseStats: { hp: 600, dmg: 20, speed: 1.5 }, weakness: 'hunting', isBoss: false, biome: 'VOLCANIC', drops: [
            { name: '🔥 Charred Feather', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A feather that has been burnt and reborn.' },
            { name: '💨 Ash Pile', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Warm ashes left behind by the phoenix.' },
            { name: '🔥 Smoldering Plume', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A beautiful feather that glows with inner heat.' },
            { name: '🔥 Ever-burning Ember', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'An ember that will never be extinguished.' },
            { name: '💧 Tear of Rebirth', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A single, crystallized phoenix tear with healing properties.' },
            { name: '❤️ Heart of the Sunbird', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The core of the phoenix, containing the power of the sun.' }
        ] },
        
        // Arctic Biome Monsters
        { name: 'Dire Wolf', rarity: 35, baseStats: { hp: 150, dmg: 18, speed: 1.0 }, weakness: 'hunting', isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🐺 Dire Wolf Pelt', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'The thick, shaggy pelt of a dire wolf.' },
            { name: '🦷 Massive Fang', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A fang larger than a human finger.' },
            { name: '❄️ Icy Fur Tuft', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A clump of fur, permanently frozen.' },
            { name: '❄️ Rime-Coated Claw', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A claw that radiates a palpable chill.' },
            { name: "👻 Alpha's Howling Spirit", type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The captured howl of a dire wolf alpha.' },
            { name: '❤️ Heart of the Winter Wolf', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The frozen heart of a legendary wolf that could command blizzards.' }
        ] },
        { name: 'Harpy', rarity: 25, baseStats: { hp: 350, dmg: 12, speed: 1.4 }, weakness: 'hunting', isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🪶 Tattered Feather', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A feather torn in a vicious fight.' },
            { name: '🐾 Sharp Talon', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A talon caked in old blood.' },
            { name: '🎶 Luring Voicebox', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'The source of the harpy\'s enchanting and deadly song.' },
            { name: '💨 Wing of the Screaming Gale', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A primary wing bone that howls when swung.' },
            { name: '⛈️ Essence of the Storm Singer', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A vial containing the sorrowful song of a harpy matriarch.' },
            { name: '❤️ Heart of the Harpy Queen', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A heart that can command the winds and the weak-willed.' }
        ] },
        { name: 'Minotaur', rarity: 20, baseStats: { hp: 500, dmg: 11, speed: 0.7 }, weakness: 'hunting', isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🐂 Coarse Fur', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'Thick fur that smells of musk and snow.' },
            { name: '🤘 Broken Horn', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A fragment from a mighty horn.' },
            { name: '🗺️ Labyrinth Map Scrap', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A piece of a map that makes no logical sense.' },
            { name: '🤘 Perfect Minotaur Horn', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A large, unbroken horn, a symbol of power.' },
            { name: '🪓 Axe of the Maze Guardian', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The head of the minotaur\'s massive axe.' },
            { name: '❤️ Heart of the Labyrinth', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A stone that can create inescapable mazes.' }
        ] },
        { name: 'Squid', rarity: 20, baseStats: { hp: 420, dmg: 18, speed: 1.1 }, weakness: 'hunting', isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🦑 Squid Tentacle', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A rubbery tentacle segment.' },
            { name: '⚫ Ink Sac', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A sac of dark, viscous ink.' },
            { name: '✨ Bioluminescent Spot', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A patch of skin that glows with a faint, eerie light.' },
            { name: '🦑 Hardened Beak', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A sharp beak capable of crushing shells.' },
            { name: '👁️ Eye of the Abyss', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The giant eye of a deep-sea squid that has seen the abyss.' },
            { name: '❤️ Heart of the Deep Dweller', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'One of the three hearts of a legendary squid.' }
        ] },
        { name: 'Octopus', rarity: 25, baseStats: { hp: 180, dmg: 30, speed: 1.2 }, weakness: 'hunting', isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🐙 Octopus Tentacle', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A tentacle covered in suckers.' },
            { name: '🎨 Camouflage Skin', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Skin that constantly shifts in color and texture.' },
            { name: '⚫ Concentrated Ink Cloud', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A bottled cloud of disorienting ink.' },
            { name: '🌀 Suction Cup of Holding', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A suction cup with an impossibly strong grip.' },
            { name: '⚪ Pearl of the Trench', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A pearl grown inside an octopus, imbued with its intelligence.' },
            { name: '👻 Soul of the Eight-Armed', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The central brain of a hyper-intelligent, ancient octopus.' }
        ] },
        { name: 'Shark', rarity: 15, baseStats: { hp: 1500, dmg: 30, speed: 1.7 }, weakness: 'hunting', isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🦷 Shark Tooth', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A serrated, razor-sharp tooth.' },
            { name: '🦈 Rough Shark Skin', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Skin as rough as sandpaper.' },
            { name: '🦴 Cartilage Chunk', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A flexible and strong piece of shark skeleton.' },
            { name: '🦈 Apex Predator Fin', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'The dorsal fin of a particularly large shark.' },
            { name: '⚡ Ampullae of Lorenzini', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The electro-receptive organs of a great shark, crackling with energy.' },
            { name: '❤️ Heart of the Ocean Fury', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The heart of a prehistoric shark that ruled the ancient seas.' }
        ] },
        { name: 'Whale', rarity: 8, baseStats: { hp: 800, dmg: 25, speed: 0.6 }, weakness: 'hunting', isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🐋 Whale Blubber', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A thick layer of insulating fat.' },
            { name: '🐋 Baleen Plate', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A plate from the whale\'s filter-feeding system.' },
            { name: '🐚 Deep Sea Barnacle', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A barnacle that has grown for decades on the whale\'s skin.' },
            { name: '🎶 Whale Song Resonance Orb', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'An orb that resonates with the mournful song of the whale.' },
            { name: '⚪ Ambergris Clump', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A rare and highly valuable waxy substance.' },
            { name: '👻 Soul of the Ancient Mariner', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The soul of a whale that has lived since the dawn of time.' }
        ] },
        
        // Universal Monsters (appear in all biomes)
        { name: 'Bat', rarity: 55, baseStats: { hp: 50, dmg: 2, speed: 1.4 }, weakness: 'hunting', isBoss: false, biome: 'ALL', drops: [
            { name: '🦇 Bat Wing Membrane', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A leathery piece of a bat wing.' },
            { name: '🦷 Bat Fang', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A small, sharp fang.' },
            { name: '💩 Guano Pile', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'Surprisingly potent fertilizer.' },
            { name: '🔊 Echolocation Organ', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'The organ that allows a bat to see with sound.' },
            { name: "👁️ Night Hunter's Eye", type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The eye of a giant bat that has perfectly adapted to darkness.' },
            { name: '❤️ Heart of the Swarm', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The hive-mind of a colossal swarm of bats.' }
        ] },
        { name: 'Cave Rat', rarity: 80, baseStats: { hp: 45, dmg: 4, speed: 1.0 }, weakness: 'hunting', isBoss: false, biome: 'ALL', drops: [
            { name: '🐀 Rat Pelt', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A mangy piece of fur.' },
            { name: '🐀 Rat Tail', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A long, scaly tail.' },
            { name: '〰️ Whiskers', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'Surprisingly rigid whiskers, good for use as needles.' },
            { name: "🦷 Plague-Bearer's Tooth", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A tooth from a rat carrying a dormant disease.' },
            { name: '🦷 All-Gnawing Incisor', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The oversized incisor of a Rat King.' },
            { name: '👻 Soul of the Undercity', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The spirit of all rats that have ever lived and died in the dark.' }
        ] },
        { name: 'Crab', rarity: 35, baseStats: { hp: 130, dmg: 10, speed: 1.2 }, weakness: 'hunting', isBoss: false, biome: 'ALL', drops: [
            { name: '🦀 Crab Leg', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A shelled leg, surprisingly meaty.' },
            { name: '🦀 Crab Shell Fragment', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A shard of hard crab shell.' },
            { name: '🦞 Pincer', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A powerful pincer claw.' },
            { name: '🦀 Perfect Crab Shell', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'The complete, undamaged shell of a large crab.' },
            { name: '💎 Sea-Gem', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A pearl-like gem that sometimes forms inside giant crabs.' },
            { name: '❤️ Heart of the Armored One', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The heart of a king crab the size of a house.' }
        ] },

           // Mining Sites (Mining weakness) - All biomes
        { name: 'Copper Vein', rarity: 80, baseStats: { hp: 50, dmg: 0, speed: 0 }, weakness: 'mining', weaknessXp: 10, isBoss: false, biome: 'ALL', drops: [
            { name: '⛏️ Copper Ore', type: 'material', chance: 1.0, quantity: [2, 5], level: 1, quality: 'Common', description: 'Raw copper ore.' },
            { name: '🪨 Rough Stone', type: 'material', chance: 0.3, quantity: [1, 4], level: 1, quality: 'Common', description: 'A common, rough stone.' },
            { name: '💎 Uncracked Geode', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A rock with crystals hidden inside.' },
            { name: '🦴 Verdigris-Coated Fossil', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A fossil with a distinct green patina.' },
            { name: '✨ Conductive Crystal Shard', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A crystal shard that crackles with stored energy.' },
            { name: '❤️ Shard of the Earth\'s Vein', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A fragment that pulses with the planet\'s lifeblood.' }
        ] },
        { name: 'Iron Deposit', rarity: 60, baseStats: { hp: 80, dmg: 0, speed: 0 }, weakness: 'mining', weaknessXp: 15, isBoss: false, biome: 'ALL', drops: [
            { name: '⛏️ Iron Ore', type: 'material', chance: 1.0, quantity: [3, 7], level: 1, quality: 'Common', description: 'Raw iron ore.' },
            { name: '🪨 Ferrous Slag', type: 'material', chance: 0.3, quantity: [1, 4], level: 1, quality: 'Common', description: 'Impure byproduct of iron formation.' },
            { name: '💎 Ferrous Geode', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A heavy geode with a metallic sheen.' },
            { name: '🦴 Rust-Stained Bone', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A fossil fragment stained by iron deposits.' },
            { name: '✨ Magnetic Crystal Shard', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A crystal shard with a strong magnetic pull.' },
            { name: '❤️ Core Iron Fragment', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A piece of impossibly dense, pure iron.' }
        ] },
        { name: 'Gold Vein', rarity: 40, baseStats: { hp: 100, dmg: 0, speed: 0 }, weakness: 'mining', weaknessXp: 20, isBoss: false, biome: 'ALL', drops: [
            { name: '💰 Gold Ore', type: 'material', chance: 1.0, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'Precious gold ore.' },
            { name: '🪨 Quartz Chunk', type: 'material', chance: 0.3, quantity: [1, 4], level: 1, quality: 'Common', description: 'Often found alongside gold.' },
            { name: '✨ Glimmering Geode', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A geode with veins of gold running through it.' },
            { name: '🦴 Gilded Fossil', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A fossil with fine veins of gold.' },
            { name: '✨ Sun-Kissed Crystal', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A crystal that radiates a warm, golden light.' },
            { name: '❤️ Heart of Avarice', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A gem that whispers promises of wealth.' }
        ] },
        { name: 'Silver Deposit', rarity: 50, baseStats: { hp: 90, dmg: 0, speed: 0 }, weakness: 'mining', weaknessXp: 18, isBoss: false, biome: 'ALL', drops: [
            { name: '🥈 Silver Ore', type: 'material', chance: 1.0, quantity: [2, 4], level: 1, quality: 'Uncommon', description: 'Shiny silver ore.' },
            { name: '🪨 Slate Fragment', type: 'material', chance: 0.3, quantity: [1, 4], level: 1, quality: 'Common', description: 'A smooth, grey stone.' },
            { name: '✨ Shining Geode', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A geode with a soft, silvery sheen.' },
            { name: '🦴 Moon-Silvered Fossil', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A fossil that glows faintly under the moonlight.' },
            { name: '✨ Lunar-Tinged Crystal', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A crystal that feels cool to the touch.' },
            { name: '❤️ Tear of Selene', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A crystallized tear of a moon goddess.' }
        ] },
        { name: 'Diamond Mine', rarity: 20, baseStats: { hp: 150, dmg: 0, speed: 0 }, weakness: 'mining', weaknessXp: 30, isBoss: false, biome: 'ALL', drops: [
            { name: '💎 Diamond', type: 'material', chance: 1.0, quantity: [1, 1], level: 1, quality: 'Rare', description: 'Precious diamond.' },
            { name: '🪨 Dense Rock', type: 'material', chance: 0.3, quantity: [1, 4], level: 1, quality: 'Common', description: 'Carbon-rich rock.' },
            { name: '💎 Crystalline Geode', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A geode filled with tiny, sharp crystals.' },
            { name: '💎 Uncut Diamond', type: 'material', chance: 0.1, quantity: [1, 2], level: 1, quality: 'Rare', description: 'A raw, uncut diamond.' },
            { name: '✨ Prismatic Shard', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', 'description': 'A shard that refracts light into a rainbow of colors.' },
            { name: '❤️ Indomitable Heart-Gem', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', 'description': 'A diamond so hard it is said to be unbreakable.' }
        ] },
        { name: 'Steel Deposit', rarity: 25, baseStats: { hp: 120, dmg: 0, speed: 0 }, weakness: 'mining', weaknessXp: 25, isBoss: false, biome: 'ALL', drops: [
            { name: '⛏️ Steel Ore', type: 'material', chance: 1.0, quantity: [1, 2], level: 1, quality: 'Rare', description: 'Beautiful emerald.' },
            { name: '🪨 Mossy Stone', type: 'material', chance: 0.3, quantity: [1, 4], level: 1, quality: 'Common', description: 'A stone covered in soft green moss.' },
            { name: '💚 Verdant Geode', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A geode with a green, mossy exterior.' },
            { name: '💚 Uncut Emerald', type: 'material', chance: 0.1, quantity: [1, 2], level: 1, quality: 'Rare', description: 'A raw, uncut emerald.' },
            { name: '✨ Verdant Energy Crystal', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A crystal that hums with the energy of life.' },
            { name: '❤️ Heart of the Grove', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A gem that pulses with the spirit of the forest.' }
        ] },
        { name: 'Ruby Vein', rarity: 30, baseStats: { hp: 110, dmg: 0, speed: 0 }, weakness: 'mining', weaknessXp: 22, isBoss: false, biome: 'ALL', drops: [
            { name: '❤️ Ruby', type: 'material', chance: 1.0, quantity: [1, 2], level: 1, quality: 'Rare', description: 'Deep red ruby.' },
            { name: '🪨 Volcanic Rock', type: 'material', chance: 0.3, quantity: [1, 4], level: 1, quality: 'Common', description: 'Porous, heat-scorched rock.' },
            { name: '❤️ Crimson Geode', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A geode with red-hued crystals inside.' },
            { name: '❤️ Uncut Ruby', type: 'material', chance: 0.1, quantity: [1, 2], level: 1, quality: 'Rare', description: 'A raw, uncut ruby.' },
            { name: '✨ Sanguine Crystal', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A crystal that feels warm to the touch.' },
            { name: '❤️ Heart of the Inferno', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A gem that contains a flickering flame.' }
        ] },
        { name: 'Sapphire Deposit', rarity: 35, baseStats: { hp: 100, dmg: 0, speed: 0 }, weakness: 'mining', weaknessXp: 20, isBoss: false, biome: 'ALL', drops: [
            { name: '💙 Sapphire', type: 'material', chance: 1.0, quantity: [1, 2], level: 1, quality: 'Rare', description: 'Deep blue sapphire.' },
            { name: '🪨 Sedimentary Rock', type: 'material', chance: 0.3, quantity: [1, 4], level: 1, quality: 'Common', description: 'Rock formed in layers over eons.' },
            { name: '💙 Azure Geode', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A geode with sparkling blue formations.' },
            { name: '💙 Uncut Sapphire', type: 'material', chance: 0.1, quantity: [1, 2], level: 1, quality: 'Rare', description: 'A raw, uncut sapphire.' },
            { name: '✨ Celestial Crystal Shard', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A crystal that seems to hold a tiny galaxy.' },
            { name: '❤️ Heart of the Ocean', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A gem that echoes with the sound of the sea.' }
        ] },
        { name: 'Mithril Vein', rarity: 10, baseStats: { hp: 200, dmg: 0, speed: 0 }, weakness: 'mining', weaknessXp: 40, isBoss: false, biome: 'ALL', drops: [
            { name: '✨ Mithril Ore', type: 'material', chance: 1.0, quantity: [1, 2], level: 1, quality: 'Epic', description: 'Magical mithril ore, light as a feather.' },
            { name: '🪨 Enchanted Rock', type: 'material', chance: 0.3, quantity: [1, 4], level: 1, quality: 'Common', description: 'Rock that hums with faint magical energy.' },
            { name: '🌟 Starmetal Geode', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A geode that shines like the night sky.' },
            { name: '🦴 Primordial Fossil', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'The fossil of a creature from the dawn of time.' },
            { name: '🌍 World-Core Fragment', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A piece of the planet\'s mantle.' },
            { name: '❤️ Heart of the Unbreakable', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'Crystallized essence of durability itself.' }
        ] },
        { name: 'Adamantium Deposit', rarity: 5, baseStats: { hp: 300, dmg: 0, speed: 0 }, weakness: 'mining', weaknessXp: 50, isBoss: false, biome: 'ALL', drops: [
            { name: '🛡️ Adamantium Ore', type: 'material', chance: 1.0, quantity: [1, 1], level: 1, quality: 'Epic', description: 'Indestructible adamantium ore.' },
            { name: '🪨 Unyielding Bedrock', type: 'material', chance: 0.3, quantity: [1, 4], level: 1, quality: 'Common', description: 'The toughest, most stubborn rock.' },
            { name: '🛡️ Adamantine Geode', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A geode with an unbreakable shell.' },
            { name: '🦴 Titan-Bone Fossil', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'The fossilized bone of a colossal, ancient being.' },
            { name: '🌍 Aegis of the Earth', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A slab of rock that can deflect any blow.' },
            { name: '❤️ Indomitus Shard', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A shard of pure, unyielding will.' }
        ] },
        
        // Woodcutting Sites (Woodcutting weakness) - Forest and Arctic biomes
        { name: 'Oak Tree', rarity: 80, baseStats: { hp: 40, dmg: 0, speed: 0 }, weakness: 'woodcutting', weaknessXp: 10, isBoss: false, biome: 'FOREST', drops: [
            { name: '🌳 Oak Wood', type: 'material', chance: 1.0, quantity: [3, 6], level: 1, quality: 'Common', description: 'Strong oak wood.' },
            { name: '🍂 Dry Twigs', type: 'material', chance: 0.3, quantity: [2, 5], level: 1, quality: 'Common', description: 'Useful as kindling.' },
            { name: '🍯 Golden Sap', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'A sticky sap that smells of honey.' },
            { name: '🪵 Iron-Hard Oak Knot', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A gnarled knot of wood, as hard as iron.' },
            { name: '🍄 Glimmerwood Fungus', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A mushroom that grows on ancient oaks and glimmers softly.' },
            { name: '🍃 Ancient Oak Leaf', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A perfectly preserved leaf from the heart of the tree.' }
        ] },
        { name: 'Pine Tree', rarity: 70, baseStats: { hp: 30, dmg: 0, speed: 0 }, weakness: 'woodcutting', weaknessXp: 8, isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🌲 Pine Wood', type: 'material', chance: 1.0, quantity: [2, 5], level: 1, quality: 'Common', description: 'Light pine wood.' },
            { name: '🌲 Pinecone', type: 'material', chance: 0.3, quantity: [2, 5], level: 1, quality: 'Common', description: 'A common pinecone.' },
            { name: '💧 Sticky Resin', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'Thick, sticky resin from a pine tree.' },
            { name: '🪵 Amber-Encrusted Pine Knot', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A knot of pine with fossilized resin.' },
            { name: '🍄 Frost-Kissed Toadstool', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A mushroom that thrives in the cold, glowing faintly.' },
            { name: '🍃 Needle of the North Wind', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A pine needle that is perpetually cold and sharp as steel.' }
        ] },
        { name: 'Maple Tree', rarity: 60, baseStats: { hp: 50, dmg: 0, speed: 0 }, weakness: 'woodcutting', weaknessXp: 12, isBoss: false, biome: 'FOREST', drops: [
            { name: '🍁 Maple Wood', type: 'material', chance: 1.0, quantity: [3, 7], level: 1, quality: 'Common', description: 'Beautiful maple wood.' },
            { name: '🍁 Maple Leaf', type: 'material', chance: 0.3, quantity: [2, 5], level: 1, quality: 'Common', description: 'A distinctively shaped leaf.' },
            { name: '💧 Sweet Sap', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'A sweet, watery sap.' },
            { name: '🪵 Sugarcrystal Wood', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'Wood infused with crystallized sap.' },
            { name: '🍄 Syrup-Cap Mushroom', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A mushroom that oozes a sweet, magical syrup.' },
            { name: '🍃 Crimson Autumn Leaf', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A leaf that holds the warmth of a thousand autumns.' }
        ] },
        { name: 'Birch Tree', rarity: 65, baseStats: { hp: 35, dmg: 0, speed: 0 }, weakness: 'woodcutting', weaknessXp: 9, isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🌳 Birch Wood', type: 'material', chance: 1.0, quantity: [2, 4], level: 1, quality: 'Common', description: 'Smooth birch wood.' },
            { name: '📜 Papery Bark', type: 'material', chance: 0.3, quantity: [2, 5], level: 1, quality: 'Common', description: 'Thin, paper-like bark.' },
            { name: '💧 Clear Sap', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'A clear, watery sap.' },
            { name: '🪵 Stone-White Birch Core', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A piece of birch as pale and hard as stone.' },
            { name: '🍄 Ghostly Polypore', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A pale, almost translucent fungus.' },
            { name: '🍃 Runic Birch Bark', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A piece of bark with naturally forming, glowing runes.' }
        ] },
        { name: 'Willow Tree', rarity: 75, baseStats: { hp: 25, dmg: 0, speed: 0 }, weakness: 'woodcutting', weaknessXp: 7, isBoss: false, biome: 'FOREST', drops: [
            { name: '🌳 Willow Wood', type: 'material', chance: 1.0, quantity: [2, 5], level: 1, quality: 'Common', description: 'Flexible willow wood.' },
            { name: '🌿 Willow Catkin', type: 'material', chance: 0.3, quantity: [2, 5], level: 1, quality: 'Common', description: 'A soft, fluffy catkin.' },
            { name: '💧 Weeping Sap', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'Sap that drips like tears.' },
            { name: '🪵 Bog-Preserved Willow Heart', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'The core of a willow branch, preserved for centuries.' },
            { name: '🍄 Weeping Glow-Moss', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'Moss that glows with a sad, gentle light.' },
            { name: '🍃 Spirit-Bound Willow Leaf', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A leaf that whispers the names of the departed.' }
        ] },
        { name: 'Cherry Tree', rarity: 50, baseStats: { hp: 60, dmg: 0, speed: 0 }, weakness: 'woodcutting', weaknessXp: 15, isBoss: false, biome: 'FOREST', drops: [
            { name: '🍒 Cherry Wood', type: 'material', chance: 1.0, quantity: [2, 4], level: 1, quality: 'Uncommon', description: 'Beautiful cherry wood.' },
            { name: '🌸 Cherry Blossom Petal', type: 'material', chance: 0.3, quantity: [3, 8], level: 1, quality: 'Common', description: 'A delicate pink petal.' },
            { name: '💧 Sweet Sap', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'A sweet, watery sap.' },
            { name: '🪵 Sakura Stone Wood', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'Petrified wood with the faint scent of blossoms.' },
            { name: '🍄 Blossom-Light Mushroom', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A mushroom that glows with the color of cherry blossoms.' },
            { name: '🍃 Petal-Carried Whisper', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A leaf that carries a gentle, encouraging whisper.' }
        ] },
        { name: 'Mahogany Tree', rarity: 30, baseStats: { hp: 100, dmg: 0, speed: 0 }, weakness: 'woodcutting', weaknessXp: 25, isBoss: false, biome: 'FOREST', drops: [
            { name: '🪵 Mahogany Wood', type: 'material', chance: 1.0, quantity: [2, 3], level: 1, quality: 'Rare', description: 'Precious mahogany wood.' },
            { name: '🍂 Rich Humus', type: 'material', chance: 0.3, quantity: [2, 5], level: 1, quality: 'Common', description: 'Dark, fertile soil from the tree\'s base.' },
            { name: '💧 Rich Sap', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'A dark, rich sap.' },
            { name: '🪵 Heartwood Splinter', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'An exceptionally hard splinter of wood.' },
            { name: '🍄 Deepwood Glowcap', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A fungus from the deepest part of the forest.' },
            { name: '🍃 Royal Mahogany Leaf', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A flawless leaf with a regal, deep red color.' }
        ] },
        { name: 'Ebony Tree', rarity: 20, baseStats: { hp: 120, dmg: 0, speed: 0 }, weakness: 'woodcutting', weaknessXp: 30, isBoss: false, biome: 'FOREST', drops: [
            { name: '🪵 Ebony Wood', type: 'material', chance: 1.0, quantity: [1, 2], level: 1, quality: 'Rare', description: 'Dark ebony wood.' },
            { name: '⚫ Shadowy Bark', type: 'material', chance: 0.3, quantity: [2, 5], level: 1, quality: 'Common', description: 'Bark that seems to absorb the light.' },
            { name: '⚫ Shadow Sap', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'Sap as dark as night.' },
            { name: '🪵 Void-Touched Heartwood', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'Wood that feels unnaturally empty.' },
            { name: '✨ Celestial Dewdrop', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A drop of dew from a leaf that touches the heavens.' },
            { name: '🍃 Shadow-Veiled Leaf', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A leaf that is cool and feels like woven shadows.' }
        ] },
        { name: 'Ancient Tree', rarity: 15, baseStats: { hp: 150, dmg: 0, speed: 0 }, weakness: 'woodcutting', weaknessXp: 40, isBoss: false, biome: 'FOREST', drops: [
            { name: '🌳 Ancient Wood', type: 'material', chance: 1.0, quantity: [1, 2], level: 1, quality: 'Epic', description: 'Magical ancient wood.' },
            { name: '🌿 Living Bough', type: 'material', chance: 0.3, quantity: [2, 5], level: 1, quality: 'Common', description: 'A branch that still pulses with life.' },
            { name: '💧 Sap of the Ages', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'Sap that contains the memories of a thousand years.' },
            { name: '🪵 Heartwood of Eternity', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A splinter of wood that does not age.' },
            { name: '✨ Starlight Dew', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'Dew that has captured the light of the stars.' },
            { name: '🌱 Seed of Yggdrasil', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A seed that could grow a new World Tree.' }
        ] },
        { name: 'World Tree', rarity: 5, baseStats: { hp: 200, dmg: 0, speed: 0 }, weakness: 'woodcutting', weaknessXp: 50, isBoss: false, biome: 'FOREST', drops: [
            { name: '💧 World Tree Sap', type: 'material', chance: 1.0, quantity: [1, 1], level: 1, quality: 'Epic', description: 'Sacred world tree sap.' },
            { name: '🌿 Branch of Worlds', type: 'material', chance: 0.3, quantity: [2, 5], level: 1, quality: 'Common', description: 'A branch that seems to exist in multiple places at once.' },
            { name: '💧 Sap of Creation', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'Sap that hums with the power of creation.' },
            { name: '🪵 Splinter of the Axis Mundi', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A splinter from the very core of the World Tree.' },
            { name: '✨ Dew of the Cosmos', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A drop of dew that contains a universe.' },
            { name: '🌱 Seed of a New Beginning', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A seed with the potential to grow a new reality.' }
        ] },

        // Fishing Sites (Fishing weakness) - Various biomes
        { name: 'Shallow Pond', rarity: 80, baseStats: { hp: 20, dmg: 0, speed: 0 }, weakness: 'fishing', weaknessXp: 5, isBoss: false, biome: 'FOREST', drops: [
            { name: '🐟 Minnow', type: 'material', chance: 1.0, quantity: [5, 10], level: 1, quality: 'Common', description: 'A tiny, common fish.' },
            { name: '👢 Old Boot', type: 'material', chance: 0.3, quantity: [1, 1], level: 1, quality: 'Common', description: 'Someone lost a boot. It is smelly.' },
            { name: '🪨 Mossy Rock', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'A slick rock covered in pond moss.' },
            { name: '📜 Soggy Diary Page', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A water-damaged page, hinting at a local secret.' },
            { name: '⚪ Murky Pearl', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A pearl from a freshwater mussel, with a dull luster.' },
            { name: '💧 Pond Spirit\'s Dewdrop', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A drop of water that never evaporates.' }
        ] },
        { name: 'Winding River', rarity: 75, baseStats: { hp: 30, dmg: 0, speed: 0 }, weakness: 'fishing', weaknessXp: 8, isBoss: false, biome: 'FOREST', drops: [
            { name: '🐠 Trout', type: 'material', chance: 1.0, quantity: [3, 7], level: 1, quality: 'Common', description: 'A freshwater fish, good for cooking.' },
            { name: '🪨 Smooth River Stone', type: 'material', chance: 0.3, quantity: [2, 4], level: 1, quality: 'Common', description: 'A stone worn smooth by the current.' },
            { name: '🍾 Message in a Bottle', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A sealed bottle with a note inside.' },
            { name: '📜 Traveler\'s Lost Map', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A map fragment, its destination unclear.' },
            { name: '⚪ Riverbed Pearl', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A lustrous pearl, polished by the river\'s flow.' },
            { name: '💧 River Spirit\'s Tear', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A teardrop-shaped gem that flows with a gentle current.' }
        ] },
        { name: 'Icy Lake', rarity: 70, baseStats: { hp: 35, dmg: 0, speed: 0 }, weakness: 'fishing', weaknessXp: 10, isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🐟 Arctic Char', type: 'material', chance: 1.0, quantity: [2, 6], level: 1, quality: 'Common', description: 'A cold-water fish.' },
            { name: '❄️ Ice Shard', type: 'material', chance: 0.3, quantity: [2, 4], level: 1, quality: 'Common', description: 'A shard of perfectly clear ice.' },
            { name: '🌿 Frozen Moss', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'Moss, frozen solid for decades.' },
            { name: '💎 Runic Stone', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'An ancient stone with a frost-covered rune.' },
            { name: '⚪ Frost-Rimmed Pearl', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A pearl that is cold to the touch.' },
            { name: '💧 Tears of the Frostmaiden', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A gem as cold as the heart of winter.' }
        ] },
        { name: 'Coastal Waters', rarity: 60, baseStats: { hp: 50, dmg: 0, speed: 0 }, weakness: 'fishing', weaknessXp: 12, isBoss: false, biome: 'ALL', drops: [
            { name: '🐟 Cod', type: 'material', chance: 1.0, quantity: [2, 5], level: 1, quality: 'Uncommon', description: 'A popular saltwater fish.' },
            { name: '🌿 Seaweed', type: 'material', chance: 0.3, quantity: [2, 4], level: 1, quality: 'Common', description: 'A clump of salty seaweed.' },
            { name: '🍾 Barnacle-Covered Bottle', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A bottle that has been at sea for a long time.' },
            { name: '🐚 Mother-of-Pearl', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'The iridescent inner layer of a large shell.' },
            { name: '🐉 Leviathan Scale', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A massive scale from an unseen deep-sea creature.' },
            { name: '💧 Tears of the Sea God', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A pearl formed from the sorrow of a deity.' }
        ] },
        { name: 'Secluded Grotto', rarity: 50, baseStats: { hp: 60, dmg: 0, speed: 0 }, weakness: 'fishing', weaknessXp: 15, isBoss: false, biome: 'FOREST', drops: [
            { name: '🐟 Cavefish', type: 'material', chance: 1.0, quantity: [2, 4], level: 1, quality: 'Uncommon', description: 'A pale, blind fish from dark waters.' },
            { name: '🍄 Glowing Mushroom', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A fungus that provides a soft light.' },
            { name: '✨ Bioluminescent Moss', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'Moss that glows with an eerie light.' },
            { name: '⚪ Cave Pearl', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A pearl formed in darkness, strangely beautiful.' },
            { name: '⚪ Grotto-Grown Pearl', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A pearl that has absorbed the grotto\'s ambient magic.' },
            { name: '💧 Echoing Water Droplet', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A drop of water that endlessly repeats the sound of the grotto.' }
        ] },
        { name: 'Frozen Fjord', rarity: 40, baseStats: { hp: 80, dmg: 0, speed: 0 }, weakness: 'fishing', weaknessXp: 20, isBoss: false, biome: 'ARCTIC', drops: [
            { name: '🐟 Glacierfin Tuna', type: 'material', chance: 1.0, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A powerful fish with fins like ice shards.' },
            { name: '❄️ Permafrost Shard', type: 'material', chance: 0.3, quantity: [2, 4], level: 1, quality: 'Common', description: 'Ice that never melts.' },
            { name: '❄️ Glacial Fragment', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'A piece of ancient, blue ice.' },
            { name: '💎 Frost-Carved Runic Stone', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A runic stone, carved by the fjord\'s ice.' },
            { name: '🐉 Jotun-Scale Fragment', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'The scale of a mythical frost giant\'s pet.' },
            { name: '💧 Heart of the Glacier', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'The frozen, beating heart of the fjord.' }
        ] },
        { name: 'Open Ocean', rarity: 30, baseStats: { hp: 100, dmg: 0, speed: 0 }, weakness: 'fishing', weaknessXp: 25, isBoss: false, biome: 'ALL', drops: [
            { name: '🗡️ Swordfish', type: 'material', chance: 1.0, quantity: [1, 2], level: 1, quality: 'Rare', description: 'A large, predatory fish with a long bill.' },
            { name: '🪵 Driftwood', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Wood worn smooth by the ocean.' },
            { name: '🗺️ Castaway\'s Chart', type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'A sea chart leading to a tiny, unknown island.' },
            { name: '🐚 Giant Conch Shell', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A large shell that echoes with the ocean\'s roar.' },
            { name: '🐉 Kraken Scale Shard', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A shard from the hide of the legendary Kraken.' },
            { name: '💧 Poseidon\'s Pearl', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A perfect pearl, crackling with the power of storms.' }
        ] },
        { name: 'Mystical Spring', rarity: 20, baseStats: { hp: 120, dmg: 0, speed: 0 }, weakness: 'fishing', weaknessXp: 35, isBoss: false, biome: 'FOREST', drops: [
            { name: '🌙 Moon-Crested Salmon', type: 'material', chance: 1.0, quantity: [1, 2], level: 1, quality: 'Epic', description: 'Shimmers with lunar energy.' },
            { name: '✨ Glowing Pebble', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A pebble that emits a soft, warm light.' },
            { name: '❤️ Lifestone', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'A stone that feels warm and alive.' },
            { name: "💧 Water-Sprite Essence", type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A bottle of shimmering, magical water.' },
            { name: '⚪ Pearl of Vitality', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A pearl that seems to pulse with life.' },
            { name: '💧 Spring Guardian\'s Tear', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'The crystallized tear of the spring\'s protector.' }
        ] },
        { name: 'Polar Abyss', rarity: 10, baseStats: { hp: 150, dmg: 0, speed: 0 }, weakness: 'fishing', weaknessXp: 45, isBoss: false, biome: 'ARCTIC', drops: [
            { name: '⚫ Voidfish', type: 'material', chance: 1.0, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A creature that seems to absorb light.' },
            { name: '❄️ Void-Touched Ice', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Ice that is unnaturally dark and cold.' },
            { name: '💎 Abyssal Crystal', type: 'material', chance: 0.2, quantity: [1, 2], level: 1, quality: 'Uncommon', description: 'A crystal formed under immense pressure and cold.' },
            { name: '📖 Waterlogged Runic Tome', type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'A book of forgotten frost magic.' },
            { name: '🐉 Abyssal Serpent Scale', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'The scale of a serpent that swims in the icy dark.' },
            { name: '⚫ Heart of the Void', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'A gem that absorbs all light and sound.' }
        ] },
        { name: 'Sunken Shipwreck', rarity: 5, baseStats: { hp: 200, dmg: 0, speed: 0 }, weakness: 'fishing', weaknessXp: 60, isBoss: false, biome: 'ALL', drops: [
            { name: '💰 Sunken Treasure', type: 'material', chance: 1.0, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A chest filled with forgotten riches.' },
            { name: '🪙 Barnacle-Encrusted Coin', type: 'material', chance: 0.3, quantity: [3, 8], level: 1, quality: 'Common', description: 'A coin from a long-lost kingdom.' },
            { name: "📖 Soggy Captain's Log", type: 'material', chance: 0.2, quantity: [1, 1], level: 1, quality: 'Uncommon', description: 'Details the ship\'s final, fateful voyage.' },
            { name: "🧭 Navigator's Sextant", type: 'material', chance: 0.1, quantity: [1, 1], level: 1, quality: 'Rare', description: 'An arcane device for navigating by the stars.' },
            { name: '🏴‍☠️ Cursed Pirate Cutlass', type: 'material', chance: 0.05, quantity: [1, 1], level: 1, quality: 'Epic', description: 'A cutlass that whispers of mutiny and treasure.' },
            { name: '❤️ Heart of the Trident', type: 'material', chance: 0.01, quantity: [1, 1], level: 1, quality: 'Legendary', description: 'The jeweled heart from a sea god\'s legendary trident.' }
        ] },

        // Bosses (Hunting weakness) - Biome specific
        { name: 'Ancient Dragon', rarity: 1, baseStats: { hp: 2000, dmg: 80, speed: 1.2 }, weakness: 'hunting', isBoss: true, biome: 'VOLCANIC', drops: [
            { name: '🐉 Obsidian Dragon Scale', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A scale as sharp and black as volcanic glass.' },
            { name: '🌋 Volcanic Ash', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Ash from the lair of the Ancient Dragon.' },
            { name: '🔥 Brimstone Chunk', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A chunk of sulfurous rock that smells of fire and damnation.' },
            { name: '🦷 Elder Dragon Tooth', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A tooth from the ancient beast, as long as a dagger.' },
            { name: '🔥 Orb of Dragon Fire', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A swirling orb containing the dragon\'s fiery breath.' },
            { name: '❤️ Ancient Dragon Heart', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The still-burning heart of the mighty dragon.' }
        ] },
        { name: 'Demon Lord', rarity: 1, baseStats: { hp: 1500, dmg: 70, speed: 1.4 }, weakness: 'hunting', isBoss: true, biome: 'VOLCANIC', drops: [
            { name: '👿 Demonic Ash', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'The corrupt ash left in the Demon Lord\'s wake.' },
            { name: '🤘 Broken Horn Shard', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A fragment of a demonic horn.' },
            { name: '😠 Essence of Hate', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A liquid manifestation of pure hatred.' },
            { name: '⛓️ Soul-Forged Chain Link', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A link from a chain forged from tormented souls.' },
            { name: '💧 Demonic Ichor', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The black, viscous blood of the Demon Lord.' },
            { name: '❤️ Heart of the Abyss', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A heart that beats with the rhythm of the abyss itself.' }
        ] },
        { name: 'Behemoth', rarity: 1, baseStats: { hp: 3000, dmg: 60, speed: 0.8 }, weakness: 'hunting', isBoss: true, biome: 'ARCTIC', drops: [
            { name: '🛡️ Thick Hide Fragment', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A piece of hide as thick as a shield.' },
            { name: '❄️ Frozen Earth Clump', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Earth frozen solid from the Behemoth\'s passage.' },
            { name: '🦷 Permafrost-Coated Tusk', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A giant tusk encased in magical ice.' },
            { name: '🦴 Unbreakable Beast Bone', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A bone that cannot be broken by conventional means.' },
            { name: '😡 Core of Primal Fury', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The source of the Behemoth\'s unstoppable rage.' },
            { name: '❤️ Heart of the Glacier', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'A heart of pure ice that freezes everything around it.' }
        ] },
        { name: 'Kraken', rarity: 1, baseStats: { hp: 2500, dmg: 75, speed: 1.0 }, weakness: 'hunting', isBoss: true, biome: 'ARCTIC', drops: [
            { name: '🐙 Small Tentacle Piece', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A severed piece of a lesser tentacle.' },
            { name: '💎 Abyss-Salt Crystal', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Salt crystallized under immense pressure from the deep sea.' },
            { name: '🌀 Giant Suction Cup', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A suction cup the size of a dinner plate.' },
            { name: "🦑 Kraken's Beak Fragment", type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A shard of the Kraken\'s mighty, ship-crushing beak.' },
            { name: '👁️ Eye of the Deep', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The colossal eye of the Kraken, which has witnessed the secrets of the abyss.' },
            { name: '❤️ Heart of the Unfathomable', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The heart of a beast that sleeps in the deepest trenches of the ocean.' }
        ] },
        { name: 'Titan', rarity: 1, baseStats: { hp: 4000, dmg: 90, speed: 0.6 }, weakness: 'hunting', isBoss: true, biome: 'DESERT', drops: [
            { name: '🗿 Petrified Skin Shard', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'A shard of skin that has turned to stone over eons.' },
            { name: '💨 Ancient Dust', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'Dust from the Titan\'s body, older than any kingdom.' },
            { name: "🦴 Titan's Marrow", type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'Marrow from a Titan\'s bone, heavy with the weight of ages.' },
            { name: '🗿 Fragment of a Lost Colossus', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A piece of the Titan that seems to remember being part of something larger.' },
            { name: '🌍 Core of the Earth Shaker', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'The source of the Titan\'s ability to cause earthquakes.' },
            { name: '❤️ Heart of the World-Bearer', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The heart of a being that once held up the sky.' }
        ] },
        { name: 'Ancient Treant', rarity: 1, baseStats: { hp: 1800, dmg: 65, speed: 0.9 }, weakness: 'hunting', isBoss: true, biome: 'FOREST', drops: [
            { name: '🌳 Living Bark', type: 'material', chance: 0.8, quantity: [1, 3], level: 1, quality: 'Common', description: 'Bark that slowly regrows even after being stripped.' },
            { name: '🍯 Golden Sap', type: 'material', chance: 0.3, quantity: [1, 3], level: 1, quality: 'Common', description: 'A thick, golden sap with restorative properties.' },
            { name: '🌸 Petal of a Sun-Kissed Flower', type: 'material', chance: 0.2, quantity: [1, 3], level: 1, quality: 'Uncommon', description: 'A flower petal from the Treant\'s back that never wilts.' },
            { name: '🪵 Heartwood Splinter', type: 'material', chance: 0.1, quantity: [1, 3], level: 1, quality: 'Rare', description: 'A splinter of wood as hard as iron from the Treant\'s core.' },
            { name: '🌱 Seed of the World Tree', type: 'material', chance: 0.05, quantity: [1, 3], level: 1, quality: 'Epic', description: 'A seed from the Ancient Treant that could grow a new forest.' },
            { name: '❤️ Heart of the Forest Itself', type: 'material', chance: 0.01, quantity: [1, 3], level: 1, quality: 'Legendary', description: 'The living, beating heart of the entire forest, embodied in the Treant.' }
        ] },
    ],

    // Team Settings
    TEAM_NAME_MIN_LENGTH: 3,
    TEAM_NAME_MAX_LENGTH: 15,

    // --- INTERNAL CONSTANTS (DO NOT MODIFY) ---
    ENTITY_TYPES: { MOB: 'mob', PLAYER: 'player', CONSTRUCTION_SITE: 'construction_site', SIEGE_MACHINE: 'siege' },
    
    // Join Policies
    JOIN_POLICIES: {
        OPEN: 'open',
        REQUEST: 'request',
        CLOSED: 'closed'
    }
};

// Export for use in browser
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Export for use in Node.js
if (typeof module !== 'undefined') {
    module.exports = { CONFIG };
}
