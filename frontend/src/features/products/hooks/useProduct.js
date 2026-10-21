import { useState, useEffect } from 'react';
import { productService } from '../api/productService.js';

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productService.getProductById(id);

        if (result?.data) {
          setProduct(result.data);
          setRelatedProducts(result.related || []);
          document.title = `${result.data.nombre} | Joyería con Alma`;
        } else {
          setError('No encontramos los detalles de esta pieza.');
        }
      } catch (err) {
        console.error('Error al cargar detalle de producto:', err);
        setError('No fue posible cargar la información de la joya.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return {
    data: product,
    product,
    relatedProducts,
    loading,
    error,
  };
}
