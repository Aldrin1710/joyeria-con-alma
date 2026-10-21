import apiClient from '../../../api/client.js';

const multipartConfig = {
  headers: { 'Content-Type': 'multipart/form-data' },
};

export const adminService = {
  // --- PRODUCTOS ---
  async getProducts() {
    const res = await apiClient.get('/admin/productos');
    return res.data?.data || res.data || [];
  },

  async getTrashProducts() {
    const res = await apiClient.get('/admin/productos?isTrash=true');
    return res.data?.data || res.data || [];
  },

  async createProduct(formData) {
    const res = await apiClient.post('/admin/productos', formData, multipartConfig);
    return res.data;
  },

  async updateProduct(id, formData) {
    const res = await apiClient.put(`/admin/productos/${id}`, formData, multipartConfig);
    return res.data;
  },

  async softDeleteProduct(id) {
    const res = await apiClient.delete(`/admin/productos/${id}`);
    return res.data;
  },

  async restoreProduct(id) {
    const res = await apiClient.patch(`/admin/productos/${id}/restore`, {});
    return res.data;
  },

  async permanentDeleteProduct(id) {
    const res = await apiClient.delete(`/admin/productos/${id}/permanent`);
    return res.data;
  },

  async emptyTrash() {
    const res = await apiClient.delete('/admin/papelera');
    return res.data;
  },

  // --- SLIDES CARRUSEL ---
  async getSlides() {
    const res = await apiClient.get('/admin/slides');
    return res.data?.data || res.data || [];
  },

  async createSlide(formData) {
    const res = await apiClient.post('/admin/slides', formData, multipartConfig);
    return res.data;
  },

  async deleteSlide(id) {
    const res = await apiClient.delete(`/admin/slides/${id}`);
    return res.data;
  },
};
