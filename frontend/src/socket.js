import { io } from 'socket.io-client';

const socket = io('https://mflix-app-a7wd.onrender.com', {
  transports: ['websocket'], // optional but can help with connection stability
});

export default socket;
