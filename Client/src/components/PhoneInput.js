import React, { useState, useEffect, useRef } from 'react';
import './PhoneInput.css';

// Liste des pays avec codes
const countries = [
  { code: '+213', flag: '🇩🇿', name: 'Algérie', country: 'DZ' },
  { code: '+33', flag: '🇫🇷', name: 'France', country: 'FR' },
  { code: '+32', flag: '🇧🇪', name: 'Belgique', country: 'BE' },
  { code: '+41', flag: '🇨🇭', name: 'Suisse', country: 'CH' },
  { code: '+1', flag: '🇺🇸', name: 'USA/Canada', country: 'US' },
  { code: '+44', flag: '🇬🇧', name: 'UK', country: 'GB' },
  { code: '+49', flag: '🇩🇪', name: 'Allemagne', country: 'DE' },
  { code: '+34', flag: '🇪🇸', name: 'Espagne', country: 'ES' },
  { code: '+39', flag: '🇮🇹', name: 'Italie', country: 'IT' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal', country: 'PT' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc', country: 'MA' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie', country: 'TN' },
  { code: '+20', flag: '🇪🇬', name: 'Égypte', country: 'EG' },
  { code: '+966', flag: '🇸🇦', name: 'Arabie Saoudite', country: 'SA' },
  { code: '+971', flag: '🇦🇪', name: 'Émirats', country: 'AE' },
];

const PhoneInput = ({ 
  value = '', 
  onChange, 
  onBlur,
  name = 'mobile',
  error = '',
  touched = false,
  placeholder = 'Numéro de téléphone'
}) => {
  const [countryCode, setCountryCode] = useState('+213'); // Algérie par défaut
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const selectorRef = useRef(null);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.phone-input-wrapper')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Initialiser depuis la valeur complète
  useEffect(() => {
    if (value) {
      const foundCountry = countries.find(c => value.startsWith(c.code.replace('+', '')));
      if (foundCountry) {
        setCountryCode(foundCountry.code);
        setPhoneNumber(value.substring(foundCountry.code.replace('+', '').length));
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handleCountryChange = (code, e) => {
    e.stopPropagation();
    setCountryCode(code);
    setShowDropdown(false);
    const fullNumber = code.replace('+', '') + phoneNumber;
    if (onChange) {
      onChange({
        target: {
          name,
          value: fullNumber
        }
      });
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!showDropdown && selectorRef.current) {
      const rect = selectorRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
    setShowDropdown(!showDropdown);
  };

  const handlePhoneChange = (e) => {
    const newNumber = e.target.value.replace(/\D/g, ''); // Seulement les chiffres
    setPhoneNumber(newNumber);
    const fullNumber = countryCode.replace('+', '') + newNumber;
    
    if (onChange) {
      onChange({
        target: {
          name,
          value: fullNumber
        }
      });
    }
  };

  const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

  return (
    <div className="phone-input-wrapper">
      <div className={`phone-input-container ${touched && error ? 'error' : ''}`}>
        <div 
          ref={selectorRef}
          className="country-selector" 
          onClick={toggleDropdown}
        >
          <span className="country-flag">{selectedCountry.flag}</span>
          <span className="country-code">{selectedCountry.code}</span>
          <i className={`fas fa-chevron-down ${showDropdown ? 'rotated' : ''}`}></i>
        </div>
        
        <input
          type="tel"
          name={name}
          value={phoneNumber}
          onChange={handlePhoneChange}
          onBlur={(e) => {
            setShowDropdown(false);
            if (onBlur) onBlur(e);
          }}
          placeholder={placeholder}
          className="phone-number-input"
          maxLength={15}
        />
      </div>
      
      {phoneNumber && (
        <div className="phone-preview">
          <i className="fas fa-phone"></i>
          <span>Numéro complet: {countryCode} {phoneNumber}</span>
        </div>
      )}
      
      {touched && error && (
        <div className="phone-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      {showDropdown && (
        <div 
          className="country-dropdown" 
          style={{ 
            top: `${dropdownPosition.top}px`, 
            left: `${dropdownPosition.left}px` 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {countries.map((country) => (
            <div
              key={country.country}
              className={`country-option ${country.code === countryCode ? 'selected' : ''}`}
              onClick={(e) => handleCountryChange(country.code, e)}
            >
              <span className="country-flag">{country.flag}</span>
              <span className="country-name">{country.name}</span>
              <span className="country-code">{country.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Fonction de validation
export const validateInternationalPhone = (value) => {
  if (!value) return false;
  
  const foundCountry = countries.find(c => value.startsWith(c.code.replace('+', '')));
  if (!foundCountry) return false;
  
  const phoneNumber = value.substring(foundCountry.code.replace('+', '').length);
  return phoneNumber.length >= 6 && phoneNumber.length <= 15 && /^\d+$/.test(phoneNumber);
};

export default PhoneInput;
