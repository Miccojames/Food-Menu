import api from './api.js';

export const foodService = {
  async getFoods(params = {}) {
    return api.get('/foods', { params });
  },

  async getFood(id) {
    return api.get(`/foods/${id}`);
  },

  async createFood(foodData) {
    return api.post('/foods', foodData);
  },

  async updateFood(id, foodData) {
    return api.put(`/foods/${id}`, foodData);
  },

  async deleteFood(id) {
    return api.delete(`/foods/${id}`);
  }
};
