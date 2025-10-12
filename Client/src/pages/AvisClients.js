import React from 'react';
import Meta from '../components/Meta';
import BrandCrumb from '../components/BrandCrumb';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/TranslationContext';
import { FaUsers, FaShoppingBag, FaStar, FaShippingFast } from 'react-icons/fa';

const AvisClients = () => {
  const { t } = useTranslation();
  const avisData = [
    {
      id: 1,
      nom: "Amira Ben Salem",
      note: 5,
      commentaire: "Service exceptionnel ! Livraison ultra-rapide et produits de qualité premium. L'équipe Sanny dépasse toutes mes attentes. Une expérience shopping parfaite !",
      date: "25 Janvier 2024",
      produit: "Smartphone Samsung Galaxy S24",
      avatar: "👩‍💼"
    },
    {
      id: 2,
      nom: "Mohamed Trabelsi",
      note: 5,
      commentaire: "Interface intuitive et professionnelle ! J'ai vendu mes produits en un temps record grâce à leur équipe dédiée. Sanny révolutionne le e-commerce en Tunisie.",
      date: "22 Janvier 2024",
      produit: "MacBook Pro M3",
      avatar: "👨‍💻"
    },
    {
      id: 3,
      nom: "Fatma Gharbi",
      note: 5,
      commentaire: "Expérience d'achat remarquable ! Produits authentiques, service client réactif 24/7. Sanny est devenu ma plateforme de confiance pour tous mes achats.",
      date: "20 Janvier 2024",
      produit: "Collection Mode Élégante",
      avatar: "👩‍🎨"
    },
    {
      id: 4,
      nom: "Ahmed Maalej",
      note: 5,
      commentaire: "Parfait sous tous les angles ! Catalogue impressionnant, prix compétitifs et livraison express. Sanny redéfinit les standards du commerce électronique.",
      date: "18 Janvier 2024",
      produit: "Équipement Sport Premium",
      avatar: "👨‍🏋️"
    },
    {
      id: 5,
      nom: "Leila Khouja",
      note: 5,
      commentaire: "Sécurité maximale et confiance totale ! Interface moderne, paiements sécurisés. Sanny transforme chaque achat en une expérience mémorable.",
      date: "15 Janvier 2024",
      produit: "Cosmétiques Bio Luxe",
      avatar: "👩‍🔬"
    },
    {
      id: 6,
      nom: "Karim Nasri",
      note: 5,
      commentaire: "Plateforme révolutionnaire ! Gamme diversifiée, service après-vente exceptionnel. Sanny élève le e-commerce tunisien vers de nouveaux sommets.",
      date: "12 Janvier 2024",
      produit: "Accessoires Auto Haut Gamme",
      avatar: "👨‍🔧"
    }
  ];

  const renderStars = (note) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < note ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  return (
    <>
      <Meta title={t('customerReviewsPageTitle')} />
      <BrandCrumb title={t('customerReviews')} />
      
      {/* Hero Section - Full Width */}
      <div className="avis-hero-fullwidth">
        <div className="hero-image-container">
          <img src="/images/hero5.jpg" alt="Sanny Hero" className="hero-bg-image" />
          <div className="hero-overlay">
            <div className="hero-text">
              <h1>{t('welcomeToSanny')}</h1>
              <p>
                {t('sannyDescription')}
              </p>
              <Link to="/product" className="button shop-now-btn">
                {t('shopNow')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Avis Clients Section */}
      <div className="avis-wrapper py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="section-heading text-center mb-5">
                <h2>{t('whatCustomersSay')}</h2>
                <p>{t('discoverTestimonials')}</p>
              </div>
            </div>
          </div>
          
          <div className="row">
            {avisData.map((avis) => (
              <div key={avis.id} className="col-lg-4 col-md-6 mb-3">
                <div className="avis-card">
                  <div className="avis-header">
                    <div className="customer-info">
                      <div className="customer-details">
                        <h6>{avis.nom}</h6>
                        <p className="product-name">{avis.produit}</p>
                      </div>
                    </div>
                    <div className="rating">
                      {renderStars(avis.note)}
                    </div>
                  </div>
                  
                  <div className="avis-body">
                    <p className="commentaire">"{avis.commentaire}"</p>
                    <span className="date">{avis.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Statistics Section - Améliorée */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="stats-section-modern">
                <div className="stats-header text-center mb-4">
                  <h3 className="stats-title">{t('ourAchievements') || 'Nos Réalisations'}</h3>
                  <p className="stats-subtitle">{t('inNumbers') || 'En Chiffres'}</p>
                </div>
                <div className="row g-4">
                  <div className="col-lg-3 col-md-6 col-6">
                    <div className="stat-card-modern">
                      <div className="stat-icon-wrapper customers">
                        <FaUsers className="stat-icon" />
                      </div>
                      <div className="stat-content">
                        <h4 className="stat-number">{t('stats2500Plus')}</h4>
                        <p className="stat-label">{t('satisfiedCustomers')}</p>
                      </div>
                      <div className="stat-bg-circle"></div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    <div className="stat-card-modern">
                      <div className="stat-icon-wrapper products">
                        <FaShoppingBag className="stat-icon" />
                      </div>
                      <div className="stat-content">
                        <h4 className="stat-number">{t('stats15KPlus')}</h4>
                        <p className="stat-label">{t('productsSold')}</p>
                      </div>
                      <div className="stat-bg-circle"></div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    <div className="stat-card-modern">
                      <div className="stat-icon-wrapper rating">
                        <FaStar className="stat-icon" />
                      </div>
                      <div className="stat-content">
                        <h4 className="stat-number">{t('stats49Rating')}</h4>
                        <p className="stat-label">{t('averageRating')}</p>
                      </div>
                      <div className="stat-bg-circle"></div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    <div className="stat-card-modern">
                      <div className="stat-icon-wrapper delivery">
                        <FaShippingFast className="stat-icon" />
                      </div>
                      <div className="stat-content">
                        <h4 className="stat-number">{t('statsExpress')}</h4>
                        <p className="stat-label">{t('expressDelivery')}</p>
                      </div>
                      <div className="stat-bg-circle"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AvisClients;
