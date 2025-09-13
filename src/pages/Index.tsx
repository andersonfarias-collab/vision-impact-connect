import { Suspense, lazy } from "react";
import { HeroSection } from "@/components/hero-section";

// Lazy load below-the-fold sections to reduce initial bundle size
const TargetAudienceSection = lazy(() => import("@/components/target-audience-section").then(module => ({ default: module.TargetAudienceSection })));
const MethodologySection = lazy(() => import("@/components/methodology-section").then(module => ({ default: module.MethodologySection })));
const PreRegistrationSection = lazy(() => import("@/components/pre-registration-section").then(module => ({ default: module.PreRegistrationSection })));
const Footer = lazy(() => import("@/components/footer").then(module => ({ default: module.Footer })));

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Suspense fallback={<div className="h-20 bg-muted animate-pulse" />}>
        <TargetAudienceSection />
      </Suspense>
      <Suspense fallback={<div className="h-20 bg-muted animate-pulse" />}>
        <MethodologySection />
      </Suspense>
      <Suspense fallback={<div className="h-20 bg-muted animate-pulse" />}>
        <PreRegistrationSection />
      </Suspense>
      <Suspense fallback={<div className="h-20 bg-muted animate-pulse" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
