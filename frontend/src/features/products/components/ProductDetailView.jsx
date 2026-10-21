import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { formatPrice } from '../../../utils/formatPrice';
import { buildWhatsappLink } from '../utils/buildWhatsappLink';

export default function ProductDetailView({ product }) {
  const wsLink = buildWhatsappLink(product.nombre);
  const fallbackImage = 'https://placehold.co/600x600/f5f5f5/a08020?text=Joya+con+Alma';
  const mainImage = product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : fallbackImage;

  return (
    <div className="detail-container">
      <div className="detail-image">
        <img
          src={mainImage}
          alt={product.nombre}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      <div className="detail-info">
        <span
          className="card-badge"
          style={{
            position: 'relative',
            top: 0,
            left: 0,
            display: 'inline-block',
            marginBottom: '1rem',
            borderColor: product.estado === 'EN_STOCK' ? 'var(--gold-primary)' : '#555',
            color: product.estado === 'EN_STOCK' ? 'var(--gold-primary)' : '#4A4A4A',
          }}
        >
          {product.estado ? product.estado.replace('_', ' ') : 'DISPONIBLE'}
        </span>

        <h1 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-main)', fontSize: '2.4rem', marginBottom: '0.5rem' }}>
          {product.nombre}
        </h1>

        {product.precioBase && (
          <p className="detail-price" style={{ color: 'var(--gold-primary)', fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0 1.5rem 0' }}>
            {formatPrice(product.precioBase)}
          </p>
        )}

        <p className="detail-desc" style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          {product.descripcion}
        </p>

        {product.detalles && product.detalles.length > 0 && (
          <div className="detail-attributes" style={{ marginBottom: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.1rem', fontFamily: 'var(--font-title)' }}>
              Detalles de la pieza
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {product.detalles.map((det, index) => (
                <li key={index} style={{ padding: '0.4rem 0', display: 'flex', borderBottom: '1px dashed #f0f0f0' }}>
                  <strong style={{ width: '130px', color: 'var(--text-main)' }}>{det.clave}:</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{det.valor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.hashtags && product.hashtags.length > 0 && (
          <div className="hashtags-container" style={{ marginBottom: '2rem' }}>
            {product.hashtags.map((tag) => (
              <Link
                key={tag}
                to={`/catalogo?hashtag=${encodeURIComponent(tag)}`}
                className="hashtag"
                style={{ textDecoration: 'none' }}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <a
          href={wsLink}
          target="_blank"
          rel="noreferrer"
          className="btn-whatsapp"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', textDecoration: 'none' }}
        >
          <FaWhatsapp size={24} /> Cotizar por WhatsApp
        </a>
      </div>
    </div>
  );
}
