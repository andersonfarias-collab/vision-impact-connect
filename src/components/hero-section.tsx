import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import heroImage from "@/assets/hero-background.png";
import { useTranslation } from 'react-i18next';
export const HeroSection = () => {
  const { t } = useTranslation();
  
  return <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Language Selector - Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <LanguageSelector />
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="4Vision ESG Global Network Platform" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            4Vision
            <span className="text-accent-light">ESG</span>
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-6 font-light max-w-4xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
          <div className="bg-accent/20 backdrop-blur-sm rounded-2xl p-6 mb-12 max-w-2xl mx-auto border border-accent/30">
            <p className="text-white font-semibold text-lg mb-2">{t('hero.coming_soon')}</p>
            <p className="text-white/90">
              {t('hero.coming_soon_description')}
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
            <Button variant="hero" size="lg" className="px-12 py-6 text-lg" onClick={() => document.getElementById('pre-registration')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              {t('hero.register_free')}
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('target-audience')?.scrollIntoView({
            behavior: 'smooth'
          })} className="px-12 py-6 border-white/30 text-lg bg-transparent text-slate-50">
              {t('hero.learn_more')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background/20 to-transparent"></div>
    </section>;
};