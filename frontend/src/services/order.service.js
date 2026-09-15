import api from './api.js';

export const orderService = {
  async getOrders() {
    return api.get('/orders');
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
