import { io } from 'socket.io-client';

const socket = io('https://mflix-app-a7wd.onrender.com', {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
