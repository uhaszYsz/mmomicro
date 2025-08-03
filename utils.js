// Utility functions for the game

// A simple seeded pseudo-random number generator
class SeededRandom {
    constructor(seedStr) {
        this.seed = this.hashCode(seedStr);
    }
    
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        if (this.seed < 0) this.seed += 233280;
        return this.seed / 233280;
    }

    // Get a random integer between min (inclusive) and max (inclusive)
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
    
    // Get a random element from an array
    choose(array) {
        return array[Math.floor(this.next() * array.length)];
    }
    
    // Choose an element based on weighted probabilities
    // weights should be an array of numbers representing the weight of each element
    weightedChoice(array, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let randomWeight = this.next() * totalWeight;
        
        for (let i = 0; i < array.length; i++) {
            randomWeight -= weights[i];
            if (randomWeight < 0) return array[i];
        }
        
        return array[array.length - 1]; // Fallback
    }
}

// Create a deep copy of an object
function structuredClone(obj) {
    if (obj === null || obj === undefined) {
        return obj;
    }
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (error) {
        console.error('structuredClone error:', error, 'for object:', obj);
        return obj; // Return original object if cloning fails
    }
}

// Format a timestamp
function formatTimestamp() {
    return new Date().toLocaleTimeString();
}

// Calculate the level-based multiplier
function getLevelMultiplier(level, baseMultiplier) {
    return 1 + (level - 1) * (baseMultiplier || 0.1);
}

// Calculate drop quantities
function calculateDropQuantity(drop) {
    const min = drop.quantity[0];
    const max = drop.quantity[1];
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check if a drop should be given based on its chance
function shouldDropItem(drop) {
    return Math.random() < drop.chance;
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.GameUtils = {
        SeededRandom,
        structuredClone,
        formatTimestamp,
        getLevelMultiplier,
        calculateDropQuantity,
        shouldDropItem
    };
}

// Export for use in Node.js
if (typeof module !== 'undefined') {
    module.exports = { 
        SeededRandom,
        structuredClone,
        formatTimestamp,
        getLevelMultiplier,
        calculateDropQuantity,
        shouldDropItem
    };
}