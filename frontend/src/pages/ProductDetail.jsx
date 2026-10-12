import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../api/productService';
import { FaWhatsapp, FaArrowLeft } from 'react-icons/fa';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>Cargando detalles de la pieza...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '1rem' }}>Joya no encontrada</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          La pieza que buscas podría estar agotada o no encontrarse disponible en este momento.
        </p>
        <Link to="/catalogo" className="btn-primary">
          <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Volver al catálogo
        </Link>
      </div>
    );
  }

  const wsLink = `https://wa.me/${waNumber}?text=Hola,%20me%20interesa%20la%20pieza%20"${encodeURIComponent(product.nombre)}"%20que%20vi%20en%20su%20catálogo%20web.%20¿Me%20podrían%20dar%20información?`;
  const fallbackImage = 'https://placehold.co/600x600/f5f5f5/a08020?text=Joya+con+Alma';
  const mainImage = product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : fallbackImage;

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      {/* Botón Volver */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/catalogo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>
          <FaArrowLeft size={14} /> Volver al catálogo
        </Link>
      </div>

      {/* VISTA DETALLE */}
      <div className="detail-container">
        {/* Columna Foto */}
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

        {/* Columna Info */}
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
              ${product.precioBase.toLocaleString('es-MX')}
            </p>
          )}

          <p className="detail-desc" style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
            {product.descripcion}
          </p>

          {/* Atributos Dinámicos */}
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

          {/* Hashtags Clicables */}
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

          {/* Botón Principal CTA */}
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

      {/* PRODUCTOS RELACIONADOS */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '5rem', borderTop: '1px solid #eee', paddingTop: '3rem' }}>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>
            Te podría interesar
          </h2>
          <div className="catalog-grid">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
