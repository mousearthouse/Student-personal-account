import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './translationSwitch.scss';
import ru from '@/assets/icons/languages/ru.svg';
import eng from '@/assets/icons/languages/eng.svg';

const LANGUAGES = {
    ru: {
        label: 'Русский',
        flag: ru,
    },
    en: {
        label: 'English',
        flag: eng,
    },
};

const TranslationSwitch = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const changeLanguage = (lng: 'ru' | 'en') => {
        i18n.changeLanguage(lng);
        localStorage.setItem('lang', lng);
        setIsOpen(false);
    };

    const currentLang = LANGUAGES[i18n.language as 'ru' | 'en'] || LANGUAGES.ru;

    return (
        <div className="language-switcher">
            <button onClick={toggleDropdown}>
                <span>{currentLang.label}</span>
                <img src={currentLang.flag} alt={i18n.language} width={20} />
                <span className="arrow">▾</span>
            </button>

            {isOpen && (
                <div className="dropdown">
                    {Object.entries(LANGUAGES).map(([code, { label, flag }]) => (
                        <button key={code} onClick={() => changeLanguage(code as 'ru' | 'en')}>
                            <img src={flag} alt={code} width={18} style={{ marginRight: '8px' }} />
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TranslationSwitch;
