import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from './ProductCard';

export default function FeaturedSlider({ products, loading }) {
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="container featured-section">
      <h2 className="section-title">Productos Destacados</h2>

      <div className="slider-wrapper">
        <button className="slider-arrow left" onClick={() => scrollSlider('left')} aria-label="Mover a la izquierda">
          <FaChevronLeft />
        </button>

        <div className="featured-slider" ref={sliderRef}>
          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>
              Cargando piezas destacadas...
            </div>
          )}

          {!loading &&
            products.map((product) => (
              <div key={product._id} className="featured-item">
                <ProductCard product={product} />
              </div>
            ))}

          <div className="featured-item">
            <Link
              to="/catalogo"
              className="product-card view-more-card"
              style={{ height: '100%', minHeight: '350px' }}
            >
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', marginBottom: '1rem', fontSize: '1.5rem' }}>
                  Ver Colección Completa
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Descubre todas nuestras creaciones exclusivas
                </p>
                <span className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                  Explorar
                </span>
              </div>
            </Link>
          </div>
        </div>

        <button className="slider-arrow right" onClick={() => scrollSlider('right')} aria-label="Mover a la derecha">
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
}
