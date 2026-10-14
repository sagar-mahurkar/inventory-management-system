import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const configuredTimeout = Number(import.meta.env.VITE_API_TIMEOUT);
const timeout = Number.isFinite(configuredTimeout) && configuredTimeout > 0
  ? configuredTimeout
  : 10_000;

export const apiClient = axios.create({
  baseURL: apiUrl,
  timeout,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
