import api from './api.js';

export const orderService = {
  // Admin: all orders (optional params: page, limit, status)
  async getOrders(params = {}) {
    return api.get('/orders', { params });
  },

  // Customer: only their own orders
  async getMyOrders() {
    return api.get('/orders/mine');
  },

  // Admin dashboard stats
  async getStats() {
    return api.get('/orders/stats');
  },

  async getOrder(id) {
    return api.get(`/orders/${id}`);
  },

  async createOrder(orderData) {
    return api.post('/orders', orderData);
  },

  async updateOrderStatus(id, status) {
    return api.put(`/orders/${id}/status`, { status });
  },

  async deleteOrder(id) {
    return api.delete(`/orders/${id}`);
  }
};
