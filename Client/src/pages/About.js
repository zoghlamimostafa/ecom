import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import SEOEnhancer from '../components/SEOEnhancer';
import Container from '../components/Container';
import HeroSection from '../components/HeroSection';
import { FaStore, FaUsers, FaShieldAlt, FaTruck, FaHeart, FaStar, FaEnvelope, FaPhone, FaMapMarkerAlt, FaAward, FaRocket, FaHandshake } from 'react-icons/fa';
import '../styles/About-minimalist.css';

const About = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <SEOEnhancer 
        title={t('aboutPageTitle')}
        description={t('aboutPageDescription')}
        keywords={t('aboutPageKeywords')}
        pageType="about"
      />
      <Meta title={t('aboutPageTitle')} />
      <BreadCrumb title={t('about')} />
      <Container class1="about-wrapper-pro py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            
            {/* Hero avec Image E-commerce */}
            <div className="about-hero-image">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <img src="/images/logosanny.png" alt="Sanny Store" className="about-logo mb-4" />
                  <h1>Bienvenue chez Sanny Store</h1>
                  <p className="lead">Votre boutique en ligne de confiance pour tous vos besoins</p>
                  <div className="about-text-hero">
                    <p>
                      <strong>Sanny Store</strong> est votre boutique en ligne de référence en Tunisie. 
                      Achetez en ligne facilement parmi des milliers de produits : électronique, mode, 
                      maison, beauté, accessoires et bien plus encore.
                    </p>
                    <p>
                      Commandez depuis chez vous, payez en ligne ou à la livraison, et recevez vos achats 
                      rapidement partout en Tunisie. Shopping en ligne simple, sécurisé et fiable.
                    </p>
                  </div>
                </div>
                <div className="col-lg-6">
                            <div className="col-md-6">
            <div className="about-image-wrapper">
              <img 
                src="/images/empty-cart.jpg" 
                alt="Sanny Store E-commerce" 
                className="about-main-image"
              />
            </div>
          </div>
                </div>
              </div>
            </div>

            {/* Comment Acheter */}
            <div className="about-how-to-buy">
              <h2>Comment Acheter sur Sanny Store ?</h2>
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="step-box">
                    <div className="step-number">1</div>
                    <FaStore className="step-icon" />
                    <h3>Parcourez</h3>
                    <p>Explorez notre catalogue de produits</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="step-box">
                    <div className="step-number">2</div>
                    <FaShieldAlt className="step-icon" />
                    <h3>Commandez</h3>
                    <p>Ajoutez au panier et finalisez</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="step-box">
                    <div className="step-number">3</div>
                    <FaPhone className="step-icon" />
                    <h3>Confirmation</h3>
                    <p>Recevez la confirmation par SMS/Email</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="step-box">
                    <div className="step-number">4</div>
                    <FaTruck className="step-icon" />
                    <h3>Recevez</h3>
                    <p>Livraison à votre domicile</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Avantages E-Commerce */}
            <div className="about-services">
              <h2>Pourquoi Acheter en Ligne sur Sanny Store ?</h2>
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="service-box">
                    <FaStore className="service-icon" />
                    <h3>Shopping 24/7</h3>
                    <p>Achetez à toute heure depuis chez vous</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="service-box">
                    <FaTruck className="service-icon" />
                    <h3>Livraison Rapide</h3>
                    <p>Livraison 7 DT partout en Tunisie</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="service-box">
                    <FaShieldAlt className="service-icon" />
                    <h3>Paiement Flexible</h3>
                    <p>En ligne ou à la livraison</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="service-box">
                    <FaUsers className="service-icon" />
                    <h3>Service Client</h3>
                    <p>Assistance rapide et efficace</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nos Valeurs */}
            <div className="about-values">
              <h2>Nos Valeurs</h2>
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="value-box">
                    <FaAward className="value-icon" />
                    <h3>Qualité</h3>
                    <p>Produits authentiques et vérifiés</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="value-box">
                    <FaHandshake className="value-icon" />
                    <h3>Confiance</h3>
                    <p>Transparence dans nos services</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="value-box">
                    <FaHeart className="value-icon" />
                    <h3>Satisfaction</h3>
                    <p>Votre bonheur est notre priorité</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="about-contact">
              <h2>Contactez-Nous</h2>
              <div className="row">
                <div className="col-lg-4 mb-4">
                  <div className="contact-box">
                    <FaEnvelope className="contact-icon" />
                    <h3>Email</h3>
                    <p>Sannyshop02@gmail.com</p>
                  </div>
                </div>
                <div className="col-lg-4 mb-4">
                  <div className="contact-box">
                    <FaPhone className="contact-icon" />
                    <h3>Téléphone</h3>
                    <p>+216 99 249 987</p>
                  </div>
                </div>
                <div className="col-lg-4 mb-4">
                  <div className="contact-box">
                    <FaMapMarkerAlt className="contact-icon" />
                    <h3>Localisation</h3>
                    <p>Tunisie</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </>
  );
};

export default About;
