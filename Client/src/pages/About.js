import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import SEOEnhancer from '../components/SEOEnhancer';
import Container from '../components/Container';
import HeroSection from '../components/HeroSection';
import { FaStore, FaUsers, FaShieldAlt, FaTruck, FaHeart, FaStar, FaEnvelope, FaPhone, FaMapMarkerAlt, FaAward, FaRocket, FaHandshake } from 'react-icons/fa';

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
      <HeroSection 
        title={t('aboutSanny')} 
        subtitle={t('yourTrustedPartner')}
      />
      <BreadCrumb title={t('about')} />
      <Container class1="about-wrapper-pro py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            
            {/* Hero Section with Company Overview */}
            <div className="about-hero-section">
              <div className="row align-items-center">
                <div className="col-lg-7">
                  <div className="about-content">
                    <span className="about-badge">{t('since2024')}</span>
                    <h1 className="about-main-title">Sanny Store</h1>
                    <p className="about-subtitle">{t('revolutionizeOnlineShopping')}</p>
                    <p className="about-description">
                      {t('sannyDescription')}
                    </p>
                    <div className="about-features">
                      <div className="feature-item">
                        <FaShieldAlt className="feature-icon" />
                        <span>{t('guaranteedSecurity')}</span>
                      </div>
                      <div className="feature-item">
                        <FaTruck className="feature-icon" />
                        <span>{t('expressDelivery')}</span>
                      </div>
                      <div className="feature-item">
                        <FaAward className="feature-icon" />
                        <span>{t('premiumQuality')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="about-visual">
                    <div className="logo-container">
                      <img src="/images/logosanny.png" alt="Logo Sanny" className="main-logo" />
                      <div className="logo-glow"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="stats-section">
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <div className="stat-item">
                    <div className="stat-number">50K+</div>
                    <div className="stat-label">{t('happyCustomers')}</div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="stat-item">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">{t('availableProducts')}</div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="stat-item">
                    <div className="stat-number">99.5%</div>
                    <div className="stat-label">{t('satisfactionRate')}</div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="stat-item">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">{t('customerSupport')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="mission-vision-section">
              <div className="row">
                <div className="col-lg-6">
                  <div className="mission-card">
                    <div className="card-header">
                      <FaRocket className="header-icon" />
                      <h3>{t('ourMission')}</h3>
                    </div>
                    <p>
                      {t('missionDescription')}
                    </p>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="vision-card">
                    <div className="card-header">
                      <FaStar className="header-icon" />
                      <h3>{t('ourVision')}</h3>
                    </div>
                    <p>
                      {t('visionDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="values-section">
              <div className="section-header">
                <h2>Nos Valeurs Fondamentales</h2>
                <p>Les principes qui guident chacune de nos actions</p>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <div className="value-card-pro">
                    <div className="value-icon-wrapper">
                      <FaHandshake />
                    </div>
                    <h4>Confiance</h4>
                    <p>Transparence et fiabilité dans chaque transaction</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="value-card-pro">
                    <div className="value-icon-wrapper">
                      <FaAward />
                    </div>
                    <h4>Excellence</h4>
                    <p>Standards élevés dans la sélection et le service</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="value-card-pro">
                    <div className="value-icon-wrapper">
                      <FaHeart />
                    </div>
                    <h4>Passion</h4>
                    <p>Engagement total envers la satisfaction client</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="services-grid-section">
              <div className="section-header">
                <h2>Nos Services Exclusifs</h2>
                <p>Une gamme complète pour répondre à tous vos besoins</p>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <div className="service-card-pro">
                    <FaStore className="service-icon-pro" />
                    <h5>Catalogue Premium</h5>
                    <p>Sélection rigoureuse de produits de qualité</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="service-card-pro">
                    <FaTruck className="service-icon-pro" />
                    <h5>Livraison Express</h5>
                    <p>Réception rapide dans toute la Tunisie</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="service-card-pro">
                    <FaShieldAlt className="service-icon-pro" />
                    <h5>Paiement Sécurisé</h5>
                    <p>Protection maximale de vos données</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="service-card-pro">
                    <FaUsers className="service-icon-pro" />
                    <h5>Support Expert</h5>
                    <p>Assistance professionnelle continue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="contact-section-pro">
              <div className="section-header">
                <h2>Restons en Contact</h2>
                <p>Notre équipe est à votre disposition</p>
              </div>
              <div className="row">
                <div className="col-lg-4">
                  <div className="contact-card-pro">
                    <div className="contact-icon-wrapper">
                      <FaEnvelope />
                    </div>
                    <h5>Email</h5>
                    <p>Sannyshop02@gmail.com</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="contact-card-pro">
                    <div className="contact-icon-wrapper">
                      <FaPhone />
                    </div>
                    <h5>Téléphone</h5>
                    <p>+216 99 249 987</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="contact-card-pro">
                    <div className="contact-icon-wrapper">
                      <FaMapMarkerAlt />
                    </div>
                    <h5>Localisation</h5>
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
