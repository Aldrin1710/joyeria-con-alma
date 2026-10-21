import apiClient from '../../../api/client.js';

export const productService = {
  // Obtener catálogo con paginación de 15, búsqueda y hashtags
  async getProducts({ page = 1, limit = 15, hashtag = '', search = '' } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (hashtag && hashtag !== 'Todos') params.append('hashtag', hashtag);
    if (search) params.append('search', search);

    const response = await apiClient.get(`/productos?${params.toString()}`);
    return response.data;
  },

  // Obtener sugerencias de autocompletado en tiempo real
  async getSearchSuggestions(query) {
    if (!query || query.trim().length < 2) return [];
    const response = await apiClient.get(`/productos/search-suggestions?q=${encodeURIComponent(query.trim())}`);
    return response.data?.data || [];
  },

  // Obtener detalle de joya y joyas relacionadas
  async getProductById(id) {
    const response = await apiClient.get(`/productos/${id}`);
    return response.data;
  },

  // Obtener lista única de hashtags
  async getUniqueHashtags() {
    const response = await apiClient.get('/productos/hashtags');
    return response.data?.data || [];
  },
};

export const {
  getProducts,
  getSearchSuggestions,
  getProductById,
  getUniqueHashtags,
} = productService;
