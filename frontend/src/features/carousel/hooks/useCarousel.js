import { useState, useEffect } from 'react';
import { carouselService } from '../api/carouselService.js';

const DEFAULT_SLIDE = {
  titulo: 'Tradición que brilla',
  subtitulo: 'Colección Exclusiva de Joyería Artesanal',
  imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop',
  targetUrl: '/catalogo',
};

export function useCarousel() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        setError(null);
        const slidesData = await carouselService.getSlides();

        if (slidesData && slidesData.length > 0) {
          setSlides(slidesData);
        } else {
          setSlides([DEFAULT_SLIDE]);
        }
      } catch (err) {
        console.error('Error cargando slides:', err);
        setError('No fue posible cargar el carrusel.');
        setSlides([DEFAULT_SLIDE]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide] || slides[0] || {};

  return {
    data: slides,
    slides,
    activeSlide,
    currentSlide,
    setCurrentSlide,
    loading,
    error,
  };
}
