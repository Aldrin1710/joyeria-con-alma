import { useState, useEffect } from 'react';
import { productService } from '../api/productService.js';

export function useFeaturedProducts(limit = 4) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productService.getProducts({ limit });
        setProducts(result?.data || []);
      } catch (err) {
        console.error('Error cargando productos destacados:', err);
        setError('No fue posible cargar los productos destacados.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return {
    data: products,
    products,
    loading,
    error,
  };
}
