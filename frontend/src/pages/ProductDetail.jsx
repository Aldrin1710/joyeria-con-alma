import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useProduct } from '../features/products/hooks/useProduct';
import ProductDetailView from '../features/products/components/ProductDetailView';
import RelatedProducts from '../features/products/components/RelatedProducts';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function ProductDetail() {
  const { id } = useParams();
  const { product, relatedProducts, loading: isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="container">
        <Loader message="Cargando detalles de la pieza..." padding="6rem 0" />
      </div>
    );
  }

  if (error || !product) {
    return <ErrorMessage />;
  }

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/catalogo"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.95rem',
          }}
        >
          <FaArrowLeft size={14} /> Volver al catálogo
        </Link>
      </div>

      <ProductDetailView product={product} />
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
