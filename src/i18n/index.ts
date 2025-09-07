import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';
import es from './locales/es.json';
import zh from './locales/zh.json';

const resources = {
  'pt-BR': {
    translation: ptBR
  },
  en: {
    translation: en
  },
  es: {
    translation: es
  },
  zh: {
    translation: zh
  }
};

// Initialize i18n asynchronously to avoid blocking React
const initI18n = async () => {
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'pt-BR', // default language
      fallbackLng: 'pt-BR',
      
      interpolation: {
        escapeValue: false, // react already does escaping
      },
    });
};

// Initialize i18n
initI18n();

export default i18n;