import HeroSection from '@/components/HeroSection';
import CatalogSection from '@/components/CatalogSection';
import PickupPointsSection from '@/components/PickupPointsSection';
import ReviewsSection from '@/components/ReviewsSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CatalogSection />
      <PickupPointsSection />
      <ReviewsSection />
    </>
  );
}