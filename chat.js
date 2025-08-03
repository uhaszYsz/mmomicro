// Chat-related functions

const { CONFIG } = require('./config');

/**
 * Handles a chat message from a player
 */
function handleChatMessage(game, playerId, data) {
    const player = game.findPlayerById(playerId);
    if (!player) return false;

    const message = {
        channel: data.channel,
        senderId: player.id,
        senderName: player.name,
        senderTeam: player.team,
        text: data.text || data.message, // Handle both text and message fields
        timestamp: new Date().toLocaleTimeString(),
        location: { x: player.x, y: player.y },
        targetId: player.attacking
    };

    game.state.chatMessages.push(message);
    if (game.state.chatMessages.length > CONFIG.CHAT_MESSAGE_LIMIT) {
        game.state.chatMessages.shift();
    }
    // Check if quiet mode is enabled (access through global if available)
    const isQuietMode = typeof global !== 'undefined' && global.quietMode !== undefined ? global.quietMode : false;
    if (!isQuietMode) {
        console.log(`Chat message added: ${message.senderName}: ${message.text} (${game.state.chatMessages.length}/${CONFIG.CHAT_MESSAGE_LIMIT} messages)`);
    }
    game.broadcast({ type: 'chat', message });
    return true;
}

module.exports = {
    handleChatMessage
};