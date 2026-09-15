import api from './api.js';

export const categoryService = {
  async getCategories() {
    return api.get('/categories');
  },

  async createCategory(categoryData) {
    return api.post('/categories', categoryData);
  },

  async updateCategory(id, categoryData) {
    return api.put(`/categories/${id}`, categoryData);
  },

  async deleteCategory(id) {
    return api.delete(`/categories/${id}`);
  }
};
