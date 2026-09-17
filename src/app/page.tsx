import { HeroSection } from '@/components/landing/HeroSection';
import { BrandsSection } from '@/components/landing/BrandsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <HeroSection />
      <BrandsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
