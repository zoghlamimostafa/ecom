import React, { useState, useEffect, useRef } from 'react';
import './PhoneInput.css';

// Liste complète des pays avec codes (tous sauf Israël)
const countries = [
  // Afrique
  { code: '+213', flag: '🇩🇿', name: 'Algérie', country: 'DZ' },
  { code: '+244', flag: '🇦🇴', name: 'Angola', country: 'AO' },
  { code: '+229', flag: '🇧🇯', name: 'Bénin', country: 'BJ' },
  { code: '+267', flag: '🇧🇼', name: 'Botswana', country: 'BW' },
  { code: '+226', flag: '🇧🇫', name: 'Burkina Faso', country: 'BF' },
  { code: '+257', flag: '🇧🇮', name: 'Burundi', country: 'BI' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroun', country: 'CM' },
  { code: '+238', flag: '�🇻', name: 'Cap-Vert', country: 'CV' },
  { code: '+236', flag: '🇨�🇫', name: 'Rép. centrafricaine', country: 'CF' },
  { code: '+235', flag: '🇹�', name: 'Tchad', country: 'TD' },
  { code: '+269', flag: '🇰🇲', name: 'Comores', country: 'KM' },
  { code: '+242', flag: '🇨🇬', name: 'Congo', country: 'CG' },
  { code: '+243', flag: '🇨🇩', name: 'RD Congo', country: 'CD' },
  { code: '+225', flag: '🇨🇮', name: 'Côte d\'Ivoire', country: 'CI' },
  { code: '+253', flag: '🇩🇯', name: 'Djibouti', country: 'DJ' },
  { code: '+20', flag: '🇪🇬', name: 'Égypte', country: 'EG' },
  { code: '+240', flag: '🇬🇶', name: 'Guinée équatoriale', country: 'GQ' },
  { code: '+291', flag: '�🇷', name: 'Érythrée', country: 'ER' },
  { code: '+251', flag: '🇪🇹', name: 'Éthiopie', country: 'ET' },
  { code: '+241', flag: '🇬🇦', name: 'Gabon', country: 'GA' },
  { code: '+220', flag: '🇬🇲', name: 'Gambie', country: 'GM' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana', country: 'GH' },
  { code: '+224', flag: '🇬🇳', name: 'Guinée', country: 'GN' },
  { code: '+245', flag: '🇬🇼', name: 'Guinée-Bissau', country: 'GW' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya', country: 'KE' },
  { code: '+266', flag: '🇱🇸', name: 'Lesotho', country: 'LS' },
  { code: '+231', flag: '🇱🇷', name: 'Libéria', country: 'LR' },
  { code: '+218', flag: '🇱🇾', name: 'Libye', country: 'LY' },
  { code: '+261', flag: '🇲🇬', name: 'Madagascar', country: 'MG' },
  { code: '+265', flag: '🇲🇼', name: 'Malawi', country: 'MW' },
  { code: '+223', flag: '🇲🇱', name: 'Mali', country: 'ML' },
  { code: '+222', flag: '🇲🇷', name: 'Mauritanie', country: 'MR' },
  { code: '+230', flag: '🇲🇺', name: 'Maurice', country: 'MU' },
  { code: '+212', flag: '🇲🇦', name: 'Maroc', country: 'MA' },
  { code: '+258', flag: '🇲🇿', name: 'Mozambique', country: 'MZ' },
  { code: '+264', flag: '🇳🇦', name: 'Namibie', country: 'NA' },
  { code: '+227', flag: '🇳🇪', name: 'Niger', country: 'NE' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria', country: 'NG' },
  { code: '+250', flag: '🇷🇼', name: 'Rwanda', country: 'RW' },
  { code: '+221', flag: '🇸�', name: 'Sénégal', country: 'SN' },
  { code: '+248', flag: '🇸�🇨', name: 'Seychelles', country: 'SC' },
  { code: '+232', flag: '🇸🇱', name: 'Sierra Leone', country: 'SL' },
  { code: '+252', flag: '�🇴', name: 'Somalie', country: 'SO' },
  { code: '+27', flag: '🇿🇦', name: 'Afrique du Sud', country: 'ZA' },
  { code: '+211', flag: '🇸🇸', name: 'Soudan du Sud', country: 'SS' },
  { code: '+249', flag: '🇸🇩', name: 'Soudan', country: 'SD' },
  { code: '+268', flag: '🇸🇿', name: 'Eswatini', country: 'SZ' },
  { code: '+255', flag: '🇹🇿', name: 'Tanzanie', country: 'TZ' },
  { code: '+228', flag: '🇹🇬', name: 'Togo', country: 'TG' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisie', country: 'TN' },
  { code: '+256', flag: '🇺🇬', name: 'Ouganda', country: 'UG' },
  { code: '+260', flag: '🇿🇲', name: 'Zambie', country: 'ZM' },
  { code: '+263', flag: '🇿🇼', name: 'Zimbabwe', country: 'ZW' },
  
  // Amériques
  { code: '+1', flag: '🇺🇸', name: 'États-Unis', country: 'US' },
  { code: '+1', flag: '🇨🇦', name: 'Canada', country: 'CA' },
  { code: '+52', flag: '🇲🇽', name: 'Mexique', country: 'MX' },
  { code: '+54', flag: '🇦🇷', name: 'Argentine', country: 'AR' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivie', country: 'BO' },
  { code: '+55', flag: '🇧🇷', name: 'Brésil', country: 'BR' },
  { code: '+56', flag: '🇨🇱', name: 'Chili', country: 'CL' },
  { code: '+57', flag: '🇨🇴', name: 'Colombie', country: 'CO' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica', country: 'CR' },
  { code: '+53', flag: '🇨🇺', name: 'Cuba', country: 'CU' },
  { code: '+593', flag: '🇪🇨', name: 'Équateur', country: 'EC' },
  { code: '+503', flag: '🇸🇻', name: 'Salvador', country: 'SV' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala', country: 'GT' },
  { code: '+509', flag: '🇭🇹', name: 'Haïti', country: 'HT' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras', country: 'HN' },
  { code: '+876', flag: '🇯🇲', name: 'Jamaïque', country: 'JM' },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua', country: 'NI' },
  { code: '+507', flag: '🇵🇦', name: 'Panama', country: 'PA' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay', country: 'PY' },
  { code: '+51', flag: '🇵🇪', name: 'Pérou', country: 'PE' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay', country: 'UY' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela', country: 'VE' },
  
  // Asie
  { code: '+93', flag: '🇦🇫', name: 'Afghanistan', country: 'AF' },
  { code: '+966', flag: '🇸🇦', name: 'Arabie Saoudite', country: 'SA' },
  { code: '+374', flag: '🇦🇲', name: 'Arménie', country: 'AM' },
  { code: '+994', flag: '🇦🇿', name: 'Azerbaïdjan', country: 'AZ' },
  { code: '+973', flag: '🇧🇭', name: 'Bahreïn', country: 'BH' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh', country: 'BD' },
  { code: '+975', flag: '🇧🇹', name: 'Bhoutan', country: 'BT' },
  { code: '+673', flag: '🇧🇳', name: 'Brunei', country: 'BN' },
  { code: '+855', flag: '🇰🇭', name: 'Cambodge', country: 'KH' },
  { code: '+86', flag: '🇨🇳', name: 'Chine', country: 'CN' },
  { code: '+357', flag: '🇨🇾', name: 'Chypre', country: 'CY' },
  { code: '+850', flag: '🇰🇵', name: 'Corée du Nord', country: 'KP' },
  { code: '+82', flag: '🇰🇷', name: 'Corée du Sud', country: 'KR' },
  { code: '+971', flag: '🇦🇪', name: 'Émirats arabes unis', country: 'AE' },
  { code: '+995', flag: '🇬🇪', name: 'Géorgie', country: 'GE' },
  { code: '+91', flag: '🇮🇳', name: 'Inde', country: 'IN' },
  { code: '+62', flag: '🇮🇩', name: 'Indonésie', country: 'ID' },
  { code: '+98', flag: '🇮🇷', name: 'Iran', country: 'IR' },
  { code: '+964', flag: '🇮🇶', name: 'Irak', country: 'IQ' },
  { code: '+81', flag: '🇯🇵', name: 'Japon', country: 'JP' },
  { code: '+962', flag: '🇯🇴', name: 'Jordanie', country: 'JO' },
  { code: '+7', flag: '🇰�', name: 'Kazakhstan', country: 'KZ' },
  { code: '+996', flag: '🇰�🇬', name: 'Kirghizistan', country: 'KG' },
  { code: '+965', flag: '🇰🇼', name: 'Koweït', country: 'KW' },
  { code: '+856', flag: '🇱🇦', name: 'Laos', country: 'LA' },
  { code: '+961', flag: '��🇧', name: 'Liban', country: 'LB' },
  { code: '+60', flag: '🇲🇾', name: 'Malaisie', country: 'MY' },
  { code: '+960', flag: '🇲🇻', name: 'Maldives', country: 'MV' },
  { code: '+976', flag: '🇲🇳', name: 'Mongolie', country: 'MN' },
  { code: '+95', flag: '🇲🇲', name: 'Myanmar', country: 'MM' },
  { code: '+977', flag: '🇳🇵', name: 'Népal', country: 'NP' },
  { code: '+968', flag: '🇴🇲', name: 'Oman', country: 'OM' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan', country: 'PK' },
  { code: '+970', flag: '🇵🇸', name: 'Palestine', country: 'PS' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines', country: 'PH' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar', country: 'QA' },
  { code: '+65', flag: '🇸🇬', name: 'Singapour', country: 'SG' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka', country: 'LK' },
  { code: '+963', flag: '🇸🇾', name: 'Syrie', country: 'SY' },
  { code: '+992', flag: '🇹🇯', name: 'Tadjikistan', country: 'TJ' },
  { code: '+66', flag: '🇹🇭', name: 'Thaïlande', country: 'TH' },
  { code: '+670', flag: '🇹🇱', name: 'Timor oriental', country: 'TL' },
  { code: '+993', flag: '🇹🇲', name: 'Turkménistan', country: 'TM' },
  { code: '+90', flag: '🇹🇷', name: 'Turquie', country: 'TR' },
  { code: '+998', flag: '🇺🇿', name: 'Ouzbékistan', country: 'UZ' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam', country: 'VN' },
  { code: '+967', flag: '🇾🇪', name: 'Yémen', country: 'YE' },
  
  // Europe
  { code: '+355', flag: '🇦🇱', name: 'Albanie', country: 'AL' },
  { code: '+49', flag: '🇩🇪', name: 'Allemagne', country: 'DE' },
  { code: '+376', flag: '🇦🇩', name: 'Andorre', country: 'AD' },
  { code: '+43', flag: '🇦🇹', name: 'Autriche', country: 'AT' },
  { code: '+32', flag: '🇧🇪', name: 'Belgique', country: 'BE' },
  { code: '+375', flag: '🇧🇾', name: 'Biélorussie', country: 'BY' },
  { code: '+387', flag: '🇧🇦', name: 'Bosnie-Herzégovine', country: 'BA' },
  { code: '+359', flag: '🇧🇬', name: 'Bulgarie', country: 'BG' },
  { code: '+385', flag: '🇭🇷', name: 'Croatie', country: 'HR' },
  { code: '+45', flag: '🇩🇰', name: 'Danemark', country: 'DK' },
  { code: '+34', flag: '🇪🇸', name: 'Espagne', country: 'ES' },
  { code: '+372', flag: '🇪🇪', name: 'Estonie', country: 'EE' },
  { code: '+358', flag: '🇫🇮', name: 'Finlande', country: 'FI' },
  { code: '+33', flag: '🇫🇷', name: 'France', country: 'FR' },
  { code: '+30', flag: '🇬🇷', name: 'Grèce', country: 'GR' },
  { code: '+36', flag: '🇭🇺', name: 'Hongrie', country: 'HU' },
  { code: '+353', flag: '🇮🇪', name: 'Irlande', country: 'IE' },
  { code: '+354', flag: '🇮🇸', name: 'Islande', country: 'IS' },
  { code: '+39', flag: '🇮🇹', name: 'Italie', country: 'IT' },
  { code: '+383', flag: '🇽🇰', name: 'Kosovo', country: 'XK' },
  { code: '+371', flag: '��', name: 'Lettonie', country: 'LV' },
  { code: '+423', flag: '🇱🇮', name: 'Liechtenstein', country: 'LI' },
  { code: '+370', flag: '🇱�🇹', name: 'Lituanie', country: 'LT' },
  { code: '+352', flag: '🇱🇺', name: 'Luxembourg', country: 'LU' },
  { code: '+389', flag: '🇲🇰', name: 'Macédoine du Nord', country: 'MK' },
  { code: '+356', flag: '🇲🇹', name: 'Malte', country: 'MT' },
  { code: '+373', flag: '🇲�', name: 'Moldavie', country: 'MD' },
  { code: '+377', flag: '🇲🇨', name: 'Monaco', country: 'MC' },
  { code: '+382', flag: '��', name: 'Monténégro', country: 'ME' },
  { code: '+47', flag: '�🇳🇴', name: 'Norvège', country: 'NO' },
  { code: '+31', flag: '🇳🇱', name: 'Pays-Bas', country: 'NL' },
  { code: '+48', flag: '🇵🇱', name: 'Pologne', country: 'PL' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal', country: 'PT' },
  { code: '+40', flag: '��', name: 'Roumanie', country: 'RO' },
  { code: '+44', flag: '�🇬🇧', name: 'Royaume-Uni', country: 'GB' },
  { code: '+7', flag: '🇷🇺', name: 'Russie', country: 'RU' },
  { code: '+378', flag: '🇸🇲', name: 'Saint-Marin', country: 'SM' },
  { code: '+381', flag: '🇷🇸', name: 'Serbie', country: 'RS' },
  { code: '+421', flag: '🇸🇰', name: 'Slovaquie', country: 'SK' },
  { code: '+386', flag: '🇸🇮', name: 'Slovénie', country: 'SI' },
  { code: '+46', flag: '🇸🇪', name: 'Suède', country: 'SE' },
  { code: '+41', flag: '🇨🇭', name: 'Suisse', country: 'CH' },
  { code: '+420', flag: '🇨🇿', name: 'Tchéquie', country: 'CZ' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine', country: 'UA' },
  { code: '+379', flag: '🇻🇦', name: 'Vatican', country: 'VA' },
  
  // Océanie
  { code: '+61', flag: '🇦🇺', name: 'Australie', country: 'AU' },
  { code: '+679', flag: '🇫🇯', name: 'Fidji', country: 'FJ' },
  { code: '+686', flag: '🇰🇮', name: 'Kiribati', country: 'KI' },
  { code: '+692', flag: '🇲🇭', name: 'Îles Marshall', country: 'MH' },
  { code: '+691', flag: '🇫🇲', name: 'Micronésie', country: 'FM' },
  { code: '+674', flag: '🇳🇷', name: 'Nauru', country: 'NR' },
  { code: '+64', flag: '🇳🇿', name: 'Nouvelle-Zélande', country: 'NZ' },
  { code: '+680', flag: '��', name: 'Palaos', country: 'PW' },
  { code: '+675', flag: '🇵🇬', name: 'Papouasie-Nouvelle-Guinée', country: 'PG' },
  { code: '+685', flag: '🇼🇸', name: 'Samoa', country: 'WS' },
  { code: '+677', flag: '🇸🇧', name: 'Îles Salomon', country: 'SB' },
  { code: '+676', flag: '🇹🇴', name: 'Tonga', country: 'TO' },
  { code: '+688', flag: '🇹🇻', name: 'Tuvalu', country: 'TV' },
  { code: '+678', flag: '🇻🇺', name: 'Vanuatu', country: 'VU' },
  
  // NOTE: Israël (+972, IL) est EXCLU de cette liste
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
  const [countryCode, setCountryCode] = useState('+216'); // Tunisie par défaut
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
