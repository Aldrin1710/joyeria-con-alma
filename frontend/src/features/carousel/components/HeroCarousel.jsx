import { Link } from 'react-router-dom';

export default function HeroCarousel({ activeSlide }) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: activeSlide?.imageUrl ? `url(${activeSlide.imageUrl})` : 'none',
        backgroundColor: '#1a1a1a',
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>{activeSlide?.titulo || 'Joyería con Alma'}</h1>
        <p>{activeSlide?.subtitulo || 'Piezas artesanales únicas'}</p>
        <Link to={activeSlide?.targetUrl || '/catalogo'} className="btn-primary">
          Ver Colección
        </Link>
      </div>
    </section>
  );
}
