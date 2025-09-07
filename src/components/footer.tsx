import { Separator } from "@/components/ui/separator";
import { Leaf, Mail, Linkedin, Twitter } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  
  return <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">4Vision<span className="text-accent-light">ESG</span></span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>
          
          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.links.platform')}</h3>
            <ul className="space-y-3 text-primary-foreground/80">
              <li><a href="#" className="hover:text-accent-light transition-colors">Para Empreendedores</a></li>
              <li><a href="#" className="hover:text-accent-light transition-colors">Para Investidores</a></li>
              <li><a href="#" className="hover:text-accent-light transition-colors">Como Funciona</a></li>
              <li><a href="#" className="hover:text-accent-light transition-colors">Metodologia ESG</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recursos</h3>
            <ul className="space-y-3 text-primary-foreground/80">
              <li><a href="#" className="hover:text-accent-light transition-colors">Blog ESG</a></li>
              <li><a href="#" className="hover:text-accent-light transition-colors">Relatórios</a></li>
              <li><a href="#" className="hover:text-accent-light transition-colors">Estudos de Caso</a></li>
              <li><a href="#" className="hover:text-accent-light transition-colors">Centro de Ajuda</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.contact.title')}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <span>{t('footer.contact.email')}</span>
              </div>
              
            </div>
          </div>
        </div>
        
        <Separator className="bg-primary-foreground/20 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-primary-foreground/60">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-accent-light transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-accent-light transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-accent-light transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>;
};