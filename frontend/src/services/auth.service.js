import api, { tokenService } from './api.js';

export const authService = {
  async login(username, password) {
    const res = await api.post('/auth/login', { username, password });
    this.saveUser(res.data);
    return res;
  },

  async register(username, password) {
    const res = await api.post('/auth/register', { username, password });
    this.saveUser(res.data);
    return res;
  },

  getUser() {
    try {
      const raw = localStorage.getItem('bb_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveUser(user) {
    const { token, ...rest } = user;
    localStorage.setItem('bb_user', JSON.stringify(rest));
    if (token) tokenService.set(token);
  },

  logout() {
    localStorage.removeItem('bb_user');
    tokenService.clear();
    // Keep cart intact so it's preserved across sessions
  },

  isLoggedIn() {
    return !!this.getUser() && !!tokenService.get();
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
