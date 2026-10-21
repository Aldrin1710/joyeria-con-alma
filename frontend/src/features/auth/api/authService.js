import apiClient from '../../../api/client.js';

export const authService = {
  async login({ username, password }) {
    const response = await apiClient.post('/auth/login', {
      username: username.trim(),
      password,
    });
    return response.data;
  },

  async logout() {
    const response = await apiClient.post('/auth/logout', {});
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export const { login, logout, getMe } = authService;
