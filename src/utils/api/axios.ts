import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3300';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
