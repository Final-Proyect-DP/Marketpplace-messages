const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors
const chatRoutes = require('./routes/chatRoutes');
const chatSocket = require('./sockets/chatSocket');

// Load environment variables
dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI); // Add this line for debugging
console.log('PORT:', process.env.PORT); // Add this line for debugging
console.log('SERVER_URL:', process.env.SERVER_URL); // Add this line for debugging

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Create Express server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all cross-origin requests
    methods: ["GET", "POST"]
  }
});

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // Use cors

// Routes
app.use('/api/chat', chatRoutes);

// Configure Socket.IO
chatSocket(io);

// Start server
const PORT = process.env.PORT;
const SERVER_URL = process.env.SERVER_URL; // Add this line
server.listen(PORT, () => {
  console.log(`Server running at ${SERVER_URL}:${PORT}`); // Update this line
});