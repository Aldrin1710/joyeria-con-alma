import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../api/productService';
import { carouselService } from '../api/carouselService';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import creadoraImg from '../assets/creadora.png';

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [slidesData, productsData] = await Promise.all([
          carouselService.getSlides(),
          productService.getProducts({ limit: 4 }),
        ]);

        if (slidesData && slidesData.length > 0) {
          setSlides(slidesData);
        } else {
          setSlides([
            {
              titulo: 'Tradición que brilla',
              subtitulo: 'Colección Exclusiva de Joyería Artesanal',
              imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop',
              targetUrl: '/catalogo',
            },
          ]);
        }

        setFeaturedProducts(productsData?.data || []);
      } catch (error) {
        console.error('Error cargando datos de inicio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeSlide = slides[currentSlide] || slides[0] || {};

  return (
    <div>
      {/* HERO SECTION (COMPACTO EN MÓVIL) */}
      <section
        className="hero"
        style={{
          backgroundImage: activeSlide.imageUrl ? `url(${activeSlide.imageUrl})` : 'none',
          backgroundColor: '#1a1a1a',
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{activeSlide.titulo || 'Joyería con Alma'}</h1>
          <p>{activeSlide.subtitulo || 'Piezas artesanales únicas'}</p>
          <Link to={activeSlide.targetUrl || '/catalogo'} className="btn-primary">
            Ver Colección
          </Link>
        </div>
      </section>

      {/* DESTACADOS (FEATURED SLIDER CON FLECHAS VISIBLES EN MÓVIL) */}
      <section className="container featured-section">
        <h2 className="section-title">Productos Destacados</h2>

        <div className="slider-wrapper">
          <button className="slider-arrow left" onClick={() => scrollSlider('left')} aria-label="Mover a la izquierda">
            <FaChevronLeft />
          </button>

          <div className="featured-slider" ref={sliderRef}>
            {isLoading && (
              <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: 'var(--text-muted)' }}>
                Cargando piezas destacadas...
              </div>
            )}

            {!isLoading &&
              featuredProducts.map((product) => (
                <div key={product._id} className="featured-item">
                  <ProductCard product={product} />
                </div>
              ))}

            {/* Tarjeta de Ver Más */}
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

      {/* SECCIÓN SOBRE NOSOTROS Y COMUNIDAD */}
      <section id="nosotros" className="container" style={{ margin: '6rem auto 3rem auto' }}>
        <div className="about-grid">
          {/* Columna Historia */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', fontSize: '0.85rem' }}>
              Nuestra Historia
            </span>
            <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-main)', fontSize: '2.5rem', margin: '0.5rem 0 1.5rem 0' }}>
              Joyería con Alma
            </h2>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <img
                src={creadoraImg}
                alt="Creadora de Joyería con Alma"
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold-primary)' }}
              />
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                "Cada pieza lleva consigo horas de dedicación, amor y la magia de nuestras tradiciones."
              </p>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Somos un taller artesanal dedicado a rescatar y exaltar la belleza de la joyería tradicional con un toque contemporáneo. Diseñamos tocados, rosarios y aretes que acompañan tus momentos más memorables.
            </p>
          </div>

          {/* Columna Facebook Embed */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--text-main)', marginBottom: '1.5rem', textAlign: 'center' }}>
              Síguenos en Facebook
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100027233036988&tabs=timeline&width=340&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                width="340"
                height="400"
                style={{ border: 'none', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Facebook Wireframe"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
