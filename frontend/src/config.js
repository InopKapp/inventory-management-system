// this allows the frontend to dynamically connect to localhost during development,
// and automatically switch to the render backend URL when deployed
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
