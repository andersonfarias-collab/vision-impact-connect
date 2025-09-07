import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-esg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="ESG Investment Platform Visualization" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            4Vision
            <span className="text-accent-light">ESG</span>
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-6 font-light max-w-4xl mx-auto leading-relaxed">
            Conectando Capital a um Futuro Sustentável
          </p>
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            A primeira plataforma que une empreendedores com projetos de impacto a investidores que valorizam o crescimento ESG real. Faça parte da vanguarda da nova economia.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
            <Button variant="hero" size="lg" className="px-12 py-6 text-lg">
              Comece Agora
            </Button>
            <Button variant="outline" size="lg" className="px-12 py-6 text-lg border-white/30 text-white hover:bg-white/10">
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background/20 to-transparent"></div>
    </section>
  );
};