import { useCarousel } from '../features/carousel/hooks/useCarousel';
import { useFeaturedProducts } from '../features/products/hooks/useFeaturedProducts';
import HeroCarousel from '../features/carousel/components/HeroCarousel';
import FeaturedSlider from '../features/products/components/FeaturedSlider';
import AboutSection from '../components/layout/AboutSection';

export default function Home() {
  const { activeSlide } = useCarousel();
  const { products: featuredProducts, loading: isLoading } = useFeaturedProducts(4);

  return (
    <div>
      <HeroCarousel activeSlide={activeSlide} />
      <FeaturedSlider products={featuredProducts} loading={isLoading} />
      <AboutSection />
    </div>
  );
}
