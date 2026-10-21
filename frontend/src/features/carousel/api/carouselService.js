import apiClient from '../../../api/client.js';

export const carouselService = {
  async getSlides() {
    const response = await apiClient.get('/carrusel');
    return response.data?.data || [];
  },
};

export const { getSlides } = carouselService;
