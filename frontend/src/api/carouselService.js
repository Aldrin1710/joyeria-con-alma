import apiClient from './client.js';

export const carouselService = {
  async getSlides() {
    const response = await apiClient.get('/carrusel');
    return response.data?.data || [];
  },
};
