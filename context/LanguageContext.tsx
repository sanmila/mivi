import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '../constants/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru'); // Russian is default

  const t = (key: string) => {
    if (!key) return '';
    // 1. Try current selected language
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // 2. Safe Fallback: Always try Russian (Primary source of truth)
    if (translations['ru'] && translations['ru'][key]) {
      return translations['ru'][key];
    }
    // 3. Absolute fallback (should rarely happen now)
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
