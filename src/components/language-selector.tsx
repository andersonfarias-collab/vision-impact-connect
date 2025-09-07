import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

const languages = [
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if i18n is properly initialized
    if (i18n && typeof i18n.changeLanguage === 'function') {
      setIsReady(true);
    }
  }, [i18n]);

  const handleLanguageChange = (languageCode: string) => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(languageCode);
    }
  };

  // Don't render until i18n is ready
  if (!isReady) {
    return (
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-white/80" />
        <div className="w-32 h-8 bg-white/10 rounded animate-pulse"></div>
      </div>
    );
  }

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-white/80" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32 h-8 bg-white/10 border-white/20 text-white text-sm">
          <SelectValue>
            <span className="flex items-center gap-1">
              {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <span className="flex items-center gap-2">
                {language.flag} {language.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};