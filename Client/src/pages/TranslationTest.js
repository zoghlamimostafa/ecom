import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

const TranslationTest = () => {
  const { t, currentLanguage, changeLanguage, availableLanguages } = useTranslation();

  const testKeys = [
    'siteTitle',
    'home',
    'products',
    'cart',
    'contact',
    'login',
    'register',
    'welcomeToSanny',
    'addToCart',
    'price',
    'description',
    'loading',
    'error',
    'success',
    'search',
    'categories'
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🌍 Test de Traduction - {t('siteTitle')}</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Langue actuelle: {currentLanguage}</h3>
        <div>
          {availableLanguages.map(lang => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              style={{
                margin: '0 5px',
                padding: '8px 16px',
                backgroundColor: currentLanguage === lang ? '#ff6b35' : '#f0f0f0',
                color: currentLanguage === lang ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {lang === 'fr' ? '🇫🇷 Français' : lang === 'en' ? '🇺🇸 English' : '🇲🇦 العربية'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {testKeys.map(key => (
          <div key={key} style={{ 
            border: '1px solid #ddd', 
            padding: '10px', 
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
          }}>
            <strong style={{ color: '#ff6b35' }}>{key}:</strong> <br/>
            <span>{t(key)}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>🧪 Test de Navigation</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            🏠 <strong>{t('home')}:</strong> {t('welcomeToSanny')}
          </li>
          <li style={{ margin: '10px 0' }}>
            🛒 <strong>{t('cart')}:</strong> {t('addToCart')}
          </li>
          <li style={{ margin: '10px 0' }}>
            📱 <strong>{t('contact')}:</strong> {t('contactUs')}
          </li>
          <li style={{ margin: '10px 0' }}>
            👤 <strong>{t('login')}:</strong> {t('welcomeBack')}
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
        <h3>✅ Instructions de test</h3>
        <ol>
          <li>Cliquez sur 🇫🇷 Français - tout doit être en français</li>
          <li>Cliquez sur 🇺🇸 English - tout doit être en anglais</li>
          <li>Cliquez sur 🇲🇦 العربية - tout doit être en arabe</li>
          <li>Vérifiez que les changements sont instantanés</li>
          <li>Naviguez vers d'autres pages pour tester</li>
        </ol>
      </div>
    </div>
  );
};

export default TranslationTest;