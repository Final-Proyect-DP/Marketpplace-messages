const Chat = require('../models/chat');
const Message = require('../models/Message');

// Start a chat
exports.startChat = async (req, res) => {
  const { userId1, userId2, token, requesterId } = req.body;

  // Validate the token and requesterId (you can add your authentication logic here)
  if (requesterId !== userId1) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Check if a chat already exists between these users
    const existingChat = await Chat.findOne({
      $or: [
        { userId1, userId2 },
        { userId1: userId2, userId2: userId1 },
      ],
    });

    if (existingChat) {
      return res.json({ chatId: existingChat._id });
    }

    // Create a new chat
    const newChat = new Chat({ userId1, userId2 });
    await newChat.save();

    res.json({ chatId: newChat._id });
  } catch (err) {
    res.status(500).json({ error: 'Error starting chat' });
  }
};

// Get chat message history
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort('timestamp');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error getting messages' });
  }
};

// Get all chats of a user
exports.getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({
      $or: [
        { userId1: userId },
        { userId2: userId },
      ],
    }).sort('createdAt');
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Error getting chats' });
  }
};

// Delete a chat and its associated messages
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Delete messages associated with the chat
    await Message.deleteMany({ chatId });

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.json({ message: 'Chat and messages deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting chat and messages' });
  }
};