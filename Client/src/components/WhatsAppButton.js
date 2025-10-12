import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from '../contexts/TranslationContext';

const WhatsAppButton = () => {
  const { t } = useTranslation();
  const phoneNumber = "21699249987"; // Numéro sans espaces ni caractères spéciaux
  const message = t('whatsAppMessage');
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="whatsapp-button" onClick={handleWhatsAppClick}>
      <FaWhatsapp className="whatsapp-icon" />
      <span className="whatsapp-tooltip">{t('contactUsWhatsApp')}</span>
    </div>
  );
};

export default WhatsAppButton;
