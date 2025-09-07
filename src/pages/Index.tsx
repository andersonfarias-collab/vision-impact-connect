import { HeroSection } from "@/components/hero-section";
import { TargetAudienceSection } from "@/components/target-audience-section";
import { MethodologySection } from "@/components/methodology-section";
import { PreRegistrationSection } from "@/components/pre-registration-section";
import { Footer } from "@/components/footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TargetAudienceSection />
      <MethodologySection />
      <PreRegistrationSection />
      <Footer />
    </div>
  );
};

export default Index;
