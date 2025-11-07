import React, { useEffect } from 'react';
import Meta from '../components/Meta';
import BrandCrumb from '../components/BrandCrumb';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/TranslationContext';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRatings } from '../features/products/productSlice';
import { getProductImageUrl } from '../utils/imageHelper';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const AvisClients = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const allRatings = useSelector((state) => state?.product?.allRatings);
  const isLoading = useSelector((state) => state?.product?.isLoading);

  useEffect(() => {
    dispatch(getAllRatings());
  }, [dispatch]);

  // Avis statiques pour compléter si nécessaire
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
          
          {isLoading ? (
            <div className="row">
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3">Chargement des avis clients...</p>
              </div>
            </div>
          ) : (
            <div className="row">
              {/* Afficher d'abord les vrais avis de la base de données */}
              {allRatings && allRatings.length > 0 ? (
                allRatings.map((rating) => (
                  <div key={`real-${rating.id}`} className="col-lg-4 col-md-6 mb-3">
                    <div className="avis-card real-review">
                      <div className="avis-header">
                        <div className="customer-info">
                          <div className="customer-avatar">
                            <img 
                              src={getProductImageUrl(rating.product?.images)} 
                              alt={rating.product?.title}
                              onError={(e) => { e.target.src = '/images/default-product.jpg'; }}
                            />
                          </div>
                          <div className="customer-details">
                            <h6>{rating.user?.firstname} {rating.user?.lastname}</h6>
                            <Link to={`/product/${rating.product?.slug}`} className="product-name">
                              {rating.product?.title}
                            </Link>
                          </div>
                        </div>
                        <div className="rating">
                          {renderStars(rating.star)}
                        </div>
                      </div>
                      
                      <div className="avis-body">
                        <p className="commentaire">"{rating.comment}"</p>
                        <span className="date">{moment(rating.createdAt).format('D MMMM YYYY')}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : null}

              {/* Afficher les avis statiques en complément */}
              {avisData.map((avis) => (
                <div key={`static-${avis.id}`} className="col-lg-4 col-md-6 mb-3">
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

              {/* Message si aucun avis */}
              {(!allRatings || allRatings.length === 0) && avisData.length === 0 && (
                <div className="col-12">
                  <div className="no-reviews-message text-center py-5">
                    <h4>Aucun avis client pour le moment</h4>
                    <p>Soyez le premier à partager votre expérience !</p>
                    <Link to="/product" className="button mt-3">
                      Découvrir nos produits
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AvisClients;
