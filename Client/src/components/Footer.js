import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLinkedinIn, FaArrowUp } from 'react-icons/fa';
import { useTranslation } from '../contexts/TranslationContext';
import logosanny from "../images/logosanny.png";

const Footer = () => {
  const { t } = useTranslation();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      {/* Décoration du haut */}
      <div className="footer-decoration"></div>
      
      <div className="container-xxl">
        <div className="footer-content">
          {/* Section principale */}
          <div className="footer-main">
            <div className="footer-column footer-brand">
              <img src={logosanny} alt="Logo Sanny" className="footer-logo" />
              <p className="footer-brand-description">
                {t('footerDescription')}
              </p>
            </div>

            <div className="footer-column">
              <h5>{t('categories')}</h5>
              <ul className="footer-links">
                <li><Link to="/product?category=1">Électronique</Link></li>
                <li><Link to="/product?category=381">Mode Femme</Link></li>
                <li><Link to="/product?category=233">High-Tech</Link></li>
                <li><Link to="/product?category=3">Sport</Link></li>
                <li><Link to="/product?category=4">Maison</Link></li>
                <li><Link to="/product?category=386">Santé et Beauté</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h5>{t('help')}</h5>
              <ul className="footer-links">
                <li><Link to="/contact">{t('contact')}</Link></li>
                <li><Link to="/faq">{t('faq')}</Link></li>
                <li><Link to="/about">{t('about')}</Link></li>
                <li><Link to="/mentions-legales">{t('legalNotice')}</Link></li>
              </ul>
            </div>

            <div className="footer-column footer-contact">
              <h5>{t('contactUs')}</h5>
              <div className="contact-info">
                <div className="contact-item">
                  <span>{t('location')}</span>
                </div>
                <div className="contact-item">
                  <span>📞 +216 99 249 987</span>
                </div>
                <div className="contact-item">
                  <span>📧 Sannyshop02@gmail.com</span>
                </div>
              </div>
              
              <div className="footer-social-section">
                <h6>{t('followUs')}</h6>
                <div className="footer-socials">
                  <a href="https://www.facebook.com/profile.php?id=61551214524462" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
                    <FaFacebookF />
                    <span>{t('facebook')}</span>
                  </a>
                  <a href="https://www.instagram.com/sanny_tn/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
                    <FaInstagram />
                    <span>{t('instagram')}</span>
                  </a>
                  <a href="https://wa.me/21699249987" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-link">
                    <FaWhatsapp />
                    <span>WhatsApp</span>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
                    <FaLinkedinIn />
                    <span>{t('linkedin')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <div className="newsletter-content">
              <h4>📧 {t('stayInformed')}</h4>
              <p>{t('newsletterDescription')}</p>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder={t('emailPlaceholder')} 
                  className="newsletter-input"
                />
                <button className="newsletter-btn">{t('subscribeNewsletter')}</button>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <div className="footer-copyright">
                <p>&copy; {new Date().getFullYear()} Sanny Marketplace. {t('allRightsReserved')}</p>
              </div>
              <div className="footer-bottom-links">
                <span>{t('securePayment')}</span>
                <span>•</span>
                <span>{t('fastDelivery')}</span>
                <span>•</span>
                <span>{t('support247')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      <button className="scroll-to-top" onClick={scrollToTop} aria-label={t('backToTop')}>
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
