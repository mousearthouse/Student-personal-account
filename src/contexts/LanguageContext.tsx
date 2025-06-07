import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import i18n from '../i18n';

type Language = 'ru' | 'en';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const storedLang = localStorage.getItem('lang') as Language | null;
    const [language, setLanguageState] = useState<Language>(storedLang || 'ru');

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
