import { io } from 'socket.io-client';

// connect to the backend server
export const socket = io('http://localhost:3001');
