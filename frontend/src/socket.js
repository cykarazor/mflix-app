import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_BASE_URL, {
  transports: ['polling'], // fallback method that avoids wss
  withCredentials: true,
  reconnectionAttempts: 5,
  timeout: 10000,
});

export default socket;
