import api from './api.js';

export const authService = {
  async login(username, password) {
    return api.post('/auth/login', { username, password });
  },

  async register(username, password) {
    return api.post('/auth/register', { username, password });
  },

  getUser() {
    const raw = localStorage.getItem('bb_user');
    return raw ? JSON.parse(raw) : null;
  },

  saveUser(user) {
    localStorage.setItem('bb_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('bb_user');
    // Keep cart intact so it's preserved across sessions
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  isAdmin() {
    const u = this.getUser();
    return u?.role === 'admin';
  },

  isCustomer() {
    const u = this.getUser();
    return u?.role === 'customer';
  }
};
