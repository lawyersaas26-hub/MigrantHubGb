
import { createContext, useContext } from 'react';
import type { LanguageContextType } from '../types';
import { translations } from '../constants/translations';

export const LanguageContext = createContext<LanguageContextType>({
    language: 'ku',
    translations: translations.ku,
    toggleLanguage: () => {},
    setLanguage: () => {},
});

export const LanguageProvider = LanguageContext.Provider;

export const useTranslations = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslations must be used within a LanguageProvider');
    }
    return context;
};
