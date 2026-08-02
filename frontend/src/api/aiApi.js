import api from './axios.js';

export const aiApi = {
  // Send query + context city to SkyWise AI assistant
  askAI: (city, message) => api.post('/ai/chat', { city, message }),
};