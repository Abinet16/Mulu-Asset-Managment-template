// src/services/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const apiService = {
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }
    
    return response.json();
  }
};