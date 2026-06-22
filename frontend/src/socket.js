import { API_URL } from './config';
import { io } from 'socket.io-client';

// connect to the backend server
export const socket = io(API_URL);
