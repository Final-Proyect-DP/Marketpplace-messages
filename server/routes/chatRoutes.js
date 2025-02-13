const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Start a chat
router.post('/start', chatController.startChat);

// Get messages from a chat
router.get('/:chatId/messages', chatController.getChatMessages);

// Get all chats of a user
router.get('/user/:userId', chatController.getUserChats);

// Delete a chat and its associated messages
router.delete('/:chatId', chatController.deleteChat);

// Health check route
router.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'chat' });
});

module.exports = router;