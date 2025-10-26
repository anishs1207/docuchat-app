import {
  NavBar,
  Footer,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
  HeroSection,
  FAQ
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQ />
      <Footer />
    </div>
  );
}
