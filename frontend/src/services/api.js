/**
 * api.js - Base Axios API client configuration
 * All backend API calls go through this instance.
 * API keys are NEVER stored here — they live on the backend only.
 */
import axios from 'axios';

// Session ID for guest user tracking (persisted in localStorage)
const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem('vv_session_id');
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('vv_session_id', sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 120000, // 2 minutes — AI generation can take time
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach session ID to all requests
api.interceptors.request.use((config) => {
  config.headers['x-session-id'] = getOrCreateSessionId();
  return config;
});

// Global error response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.';

    // Return a structured error for components to handle
    return Promise.reject({
      message,
      status: error.response?.status,
      details: error.response?.data?.details,
    });
  }
);

export default api;
export { getOrCreateSessionId };
