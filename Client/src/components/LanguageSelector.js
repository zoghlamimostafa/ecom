import React, { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, availableLanguages, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Définir les langues avec leurs propriétés
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' }
  ].filter(lang => availableLanguages && availableLanguages.includes(lang.code));

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  // Si pas de langues disponibles, ne rien afficher
  if (!languages.length) {
    return null;
  }

  return (
    <div className="language-selector">
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('selectLanguage') || 'Sélectionner la langue'}
      >
        <span className="flag">{currentLang?.flag}</span>
        <span className="language-name">{currentLang?.name}</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="flag">{language.flag}</span>
              <span className="language-name">{language.name}</span>
              {currentLanguage === language.code && (
                <span className="check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;