import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { formatPrice } from '../../../utils/formatPrice';
import { buildWhatsappLink } from '../utils/buildWhatsappLink';

export default function ProductCard({ product }) {
  const wsLink = buildWhatsappLink(product.nombre);
  const fallbackImage = 'https://placehold.co/600x600/f5f5f5/a08020?text=Joya+con+Alma';
  const displayImage = product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : fallbackImage;

  return (
    <div className="product-card">
      <Link to={`/producto/${product._id}`} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={displayImage}
            alt={product.nombre}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImage;
            }}
          />
          <span
            className="card-badge"
            style={{
              borderColor: product.estado === 'EN_STOCK' ? 'var(--gold-primary)' : '#555',
              color: product.estado === 'EN_STOCK' ? 'var(--gold-primary)' : '#4A4A4A',
            }}
          >
            {product.estado ? product.estado.replace('_', ' ') : 'DISPONIBLE'}
          </span>
        </div>
        <div className="card-content">
          <h3 className="card-title">{product.nombre}</h3>
          {product.precioBase && (
            <p className="card-price">{formatPrice(product.precioBase)}</p>
          )}
        </div>
      </Link>

      {/* Quick Action WhatsApp Button */}
      <div style={{ padding: '0 1rem 1rem 1rem' }}>
        <a href={wsLink} target="_blank" rel="noreferrer" className="btn-quick-wa">
          <FaWhatsapp size={18} /> Cotiza ya
        </a>
      </div>
    </div>
  );
}
