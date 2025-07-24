// backend/socket.js
const { Server } = require('socket.io');

let io;

function initSocket(server) {
  io = new Server(server, {
      cors: {
        origin: 'https://flower-marigold.netlify.app',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
      transports: ['polling'],
      allowEIO3: true, // Optional: helps with backward compatibility
    });

  io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

module.exports = {
  initSocket,
  getIO,
};
