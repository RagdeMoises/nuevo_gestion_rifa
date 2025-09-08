// src/services/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'https://backrifa-production.up.railway.app';

export const api = {
  // Función genérica para hacer requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          ...options.headers,
        },
        ...options,
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La respuesta del servidor no es JSON');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Métodos específicos
  getRaffleInfo() {
    return this.request('/api/raffle-info');
  },

  purchaseTickets(ticketData) {
    return this.request('/api/tickets/purchase', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  verifyTicket(ticketNumber, idNumber) {
    return this.request('/api/tickets/verify', {
      method: 'POST',
      body: JSON.stringify({ ticketNumber, idNumber }),
    });
  }
};