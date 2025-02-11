const Message = require('../models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a chat
    socket.on('join_chat', ({ chatId, userId }) => {
      socket.join(chatId);
      console.log(`User ${userId} joined chat ${chatId}`);
    });

    // Send a message
    socket.on('send_message', async ({ chatId, senderId, receiverId, message }) => {
      try {
        // Save the message to the database
        const newMessage = new Message({ chatId, senderId, receiverId, message });
        await newMessage.save();

        // Emit the message to everyone in the chat room
        io.to(chatId).emit('receive_message', newMessage);
        console.log('Message sent:', newMessage);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    });

    // Disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};