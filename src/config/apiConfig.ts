export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://172.40.20.114:2880',
  auth: {
    username: import.meta.env.VITE_AUTH_USERNAME || '911',
    password: import.meta.env.VITE_AUTH_PASSWORD || '911-System'
  }
};