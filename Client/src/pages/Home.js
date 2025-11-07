import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from '../contexts/TranslationContext';
import Meta from '../components/Meta';
import SEO from '../components/SEO';
import SEOEnhancer from '../components/SEOEnhancer';
import ProductCard from '../components/ProductCard';
import Container from '../components/Container';
import BrandCarousel from '../components/BrandCarousel';
import HeroSection from '../components/HeroSection';
import { getFeaturedProducts, getPopularProducts, getAllProducts } from '../features/products/productSlice';
import { getAllBrands } from '../features/brands/brandSlice';
import { getAllCategories } from '../features/category/categorySlice';
import { 
  FaCar, FaHeartbeat, FaTools, FaLaptop, FaTshirt, FaBook, 
  FaRocket, FaShieldAlt, FaCheckCircle, FaShippingFast, 
  FaCreditCard, FaUndo, FaHeadset, FaClock, FaAward,
  FaBaby, FaHome, FaSpa, FaMobileAlt, FaFutbol, FaGamepad,
  FaMusic, FaCamera, FaPaw, FaUtensils, FaTree, FaBoxOpen,
  FaShoppingCart, FaTags, FaPercentage, FaStar
} from 'react-icons/fa';
import TestimonialsSection from '../components/TestimonialsSection';
import '../styles/Home.css';
import '../styles/Testimonials.css';
import '../styles/ServicesGuarantee.css';

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const featuredProducts = useSelector((state) => state.product.featured);
  const popularProducts = useSelector((state) => state.product.popular);
  const allProducts = useSelector((state) => state.product.product);
  const brands = useSelector((state) => state.brand.brands);
  const categoriesData = useSelector((state) => state.category.categories);

  useEffect(() => {
    // Récupérer les produits featured, populaires et tous les produits
    dispatch(getFeaturedProducts());
    dispatch(getPopularProducts());
    dispatch(getAllProducts());
    // Récupérer les marques pour le carrousel
    dispatch(getAllBrands());
    // Récupérer toutes les catégories
    dispatch(getAllCategories());
    
    // Rafraîchir les marques toutes les 5 minutes pour récupérer les nouvelles
    const brandRefreshInterval = setInterval(() => {
      dispatch(getAllBrands());
    }, 300000); // 5 minutes
    
    return () => clearInterval(brandRefreshInterval);
  }, [dispatch]);

  // Fonction pour filtrer les produits par tag
  const filterProductsByTag = (products, tagValue) => {
    if (!products || products.length === 0) {
      console.log(`⚠️ filterProductsByTag(${tagValue}): Aucun produit disponible`);
      return [];
    }
    
    console.log(`🔍 Filtrage pour tag "${tagValue}" parmi ${products.length} produits`);
    
    const filtered = products.filter(product => {
      let productTags = product.tags;
      
      // Si tags est vide, null ou undefined
      if (!productTags || productTags === 'null' || productTags === '' || productTags === '[]' || productTags === '""') {
        return false;
      }
      
      // Debug: afficher les tags du produit
      console.log(`  📦 Produit "${product.title}":`, productTags, typeof productTags);
      
      // Si c'est déjà un tableau
      if (Array.isArray(productTags)) {
        return productTags.includes(tagValue);
      }
      
      // Si c'est une chaîne JSON
      if (typeof productTags === 'string') {
        // Essayer de parser comme JSON
        if (productTags.startsWith('[') || productTags.startsWith('{')) {
          try {
            const parsed = JSON.parse(productTags);
            if (Array.isArray(parsed)) {
              return parsed.includes(tagValue);
            }
          } catch (e) {
            console.log(`    ⚠️ Erreur parsing JSON pour "${product.title}":`, e.message);
          }
        }
        
        // Si c'est une chaîne simple, vérifier les correspondances
        // "promo" → "promotion", "new" → "new", etc.
        const tagMap = {
          'promo': 'promotion',
          'promotion': 'promotion',
          'new': 'new',
          'nouveau': 'new',
          'bestseller': 'bestseller',
          'best-seller': 'bestseller',
          'featured': 'featured',
          'vedette': 'featured'
        };
        
        const normalizedTag = productTags.toLowerCase().replace(/['"]/g, '').trim();
        const mappedTag = tagMap[normalizedTag];
        
        console.log(`    🔄 Tag normalisé: "${normalizedTag}" → "${mappedTag}"`);
        
        return mappedTag === tagValue;
      }
      
      return false;
    });
    
    console.log(`✅ ${filtered.length} produit(s) trouvé(s) avec tag "${tagValue}"`);
    return filtered;
  };

  // Filtrer les produits par statut
  const promotionProducts = filterProductsByTag(allProducts, 'promotion');
  const bestsellerProducts = filterProductsByTag(allProducts, 'bestseller');
  const newProducts = filterProductsByTag(allProducts, 'new');
  const featuredProductsFiltered = filterProductsByTag(allProducts, 'featured');
  
  // Debug: afficher les résultats
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      console.log('📊 Résumé des produits filtrés:');
      console.log('  🔥 Promotions:', promotionProducts.length);
      console.log('  ⭐ Best-sellers:', bestsellerProducts.length);
      console.log('  🆕 Nouveaux:', newProducts.length);
      console.log('  💎 En vedette:', featuredProductsFiltered.length);
    }
  }, [allProducts, promotionProducts.length, bestsellerProducts.length, newProducts.length, featuredProductsFiltered.length]);

  // Mapping des icônes pour chaque catégorie (principales ET sous-catégories)
  const categoryIcons = {
    // Catégories principales
    'Électronique': <FaMobileAlt />,
    'Electronics': <FaMobileAlt />,
    'Vêtements': <FaTshirt />,
    'Clothing': <FaTshirt />,
    'Mode': <FaTshirt />,
    'Fashion': <FaTshirt />,
    'Sport': <FaFutbol />,
    'Sports': <FaFutbol />,
    'Maison': <FaHome />,
    'Home': <FaHome />,
    'Beauté': <FaSpa />,
    'Beauty': <FaSpa />,
    'Auto': <FaCar />,
    'Automobile': <FaCar />,
    
    // Sous-catégories Électronique
    'Smartphones': <FaMobileAlt />,
    'Accessoires Tech': <FaLaptop />,
    'Appareils Photo': <FaCamera />,
    'Consoles de Jeu': <FaGamepad />,
    'Ordinateurs': <FaLaptop />,
    'Tablettes': <FaMobileAlt />,
    'Écouteurs': <FaMusic />,
    'Audio': <FaMusic />,
    
    // Sous-catégories Vêtements
    'Femme': <FaTshirt />,
    'Homme': <FaTshirt />,
    'Enfants': <FaBaby />,
    'Bébé': <FaBaby />,
    'Baby': <FaBaby />,
    'Accessoires Mode': <FaSpa />,
    'Chaussures': <FaTshirt />,
    'Bijoux': <FaSpa />,
    'Montres': <FaClock />,
    
    // Sous-catégories Sport
    'Fitness': <FaHeartbeat />,
    'Cyclisme': <FaFutbol />,
    'Natation': <FaFutbol />,
    'Running': <FaFutbol />,
    'Yoga': <FaHeartbeat />,
    'Sports Collectifs': <FaFutbol />,
    'Camping': <FaTree />,
    
    // Sous-catégories Maison
    'Cuisine': <FaUtensils />,
    'Décoration': <FaHome />,
    'Bricolage': <FaTools />,
    'Jardin': <FaTree />,
    'Meubles': <FaHome />,
    'Électroménager': <FaHome />,
    'Rangement': <FaBoxOpen />,
    
    // Sous-catégories Beauté
    'Maquillage': <FaSpa />,
    'Parfums': <FaSpa />,
    'Soins': <FaSpa />,
    'Cheveux': <FaSpa />,
    'Ongles': <FaSpa />,
    'Bien-être': <FaHeartbeat />,
    
    // Autres catégories
    'Informatique': <FaLaptop />,
    'Computers': <FaLaptop />,
    'Livres': <FaBook />,
    'Books': <FaBook />,
    'Santé': <FaHeartbeat />,
    'Health': <FaHeartbeat />,
    'Jeux': <FaGamepad />,
    'Games': <FaGamepad />,
    'Jouets': <FaGamepad />,
    'Toys': <FaGamepad />,
    'Musique': <FaMusic />,
    'Music': <FaMusic />,
    'Photo': <FaCamera />,
    'Camera': <FaCamera />,
    'Animaux': <FaPaw />,
    'Pets': <FaPaw />,
    'Bagagerie': <FaBoxOpen />,
    'Sacs': <FaBoxOpen />,
    'Autres': <FaBoxOpen />,
    'Other': <FaBoxOpen />
  };

  // Fonction pour obtenir l'icône d'une catégorie
  const getCategoryIcon = (categoryTitle) => {
    // D'abord essayer le mapping local
    if (categoryIcons[categoryTitle]) {
      return categoryIcons[categoryTitle];
    }
    
    // Sinon, retourner une icône par défaut basée sur des mots-clés
    const title = categoryTitle.toLowerCase();
    if (title.includes('auto') || title.includes('moto') || title.includes('voiture')) return <FaCar />;
    if (title.includes('beauté') || title.includes('maquillage') || title.includes('parfum')) return <FaHeartbeat />;
    if (title.includes('bricolage') || title.includes('outil') || title.includes('jardin')) return <FaTools />;
    if (title.includes('cuisine') || title.includes('électroménager')) return <FaUtensils />;
    if (title.includes('epicerie') || title.includes('alimentaire')) return <FaUtensils />;
    if (title.includes('bureau') || title.includes('papeterie')) return <FaBook />;
    if (title.includes('high-tech') || title.includes('téléphone') || title.includes('tech')) return <FaMobileAlt />;
    if (title.includes('hygiène') || title.includes('santé')) return <FaSpa />;
    if (title.includes('sport') || title.includes('fitness')) return <FaFutbol />;
    if (title.includes('maison') || title.includes('mobilier')) return <FaHome />;
    
    return <FaBoxOpen />;
  };

  // Afficher TOUTES les catégories (principales ET sous-catégories)
  const allCategories = categoriesData || [];

  return (
    <>
      <SEO 
        title="Sanny Shop - Boutique en Ligne | Smartphones, Électronique & Mode"
        description="Découvrez notre large sélection de smartphones, produits électroniques, mode et accessoires. Livraison rapide et paiement sécurisé."
        keywords="sanny shop, boutique en ligne, e-commerce, smartphones, iPhone, Samsung, électronique, mode, accessoires"
      />
      <SEOEnhancer 
        title={t('homePageTitle')}
        description={t('homePageDescription')}
        keywords={t('homePageKeywords')}
      />
      <Meta title={t('homePageTitle')} />

      {/* Hero Section */}
      <HeroSection 
        title={t('welcomeToSanny')} 
        subtitle={t('buyAndSellConfidently')}
      />

      {/* E-commerce Trust Bar */}
      <div className="ecommerce-trust-bar">
        <Container>
          <div className="trust-bar-items">
            <div className="trust-item">
              <FaShoppingCart className="trust-icon" />
              <div className="trust-text">
                <span className="trust-number">{allProducts?.length || 0}+</span>
                <span className="trust-label">Produits</span>
              </div>
            </div>
            <div className="trust-item">
              <FaShieldAlt className="trust-icon" />
              <div className="trust-text">
                <span className="trust-number">100%</span>
                <span className="trust-label">Sécurisé</span>
              </div>
            </div>
            <div className="trust-item">
              <FaShippingFast className="trust-icon" />
              <div className="trust-text">
                <span className="trust-number">24/48h</span>
                <span className="trust-label">Livraison</span>
              </div>
            </div>
            <div className="trust-item">
              <FaHeadset className="trust-icon" />
              <div className="trust-text">
                <span className="trust-number">24/7</span>
                <span className="trust-label">Support</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Promotions Section */}
      <Container class1="promotions-wrapper py-5">
        <div className="section-title-wrapper">
          <div className="title-with-badge">
            <h2 className="section-title">{t('bestOffersOfTheMoment')}</h2>
            <span className="promo-badge"><FaPercentage /> Promos</span>
          </div>
          <p className="section-subtitle">{t('discoverBestDeals')}</p>
        </div>
        <div className="row">
          {promotionProducts && promotionProducts.length > 0 ? (
            promotionProducts.slice(0, 3).map((product) => (
              <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product.id}>
                <ProductCard data={product} gridView={true} />
              </div>
            ))
          ) : (
            // Fallback: afficher les produits featured si pas de promotions
            featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 3).map((product) => (
                <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product.id}>
                  <ProductCard data={product} gridView={true} />
                </div>
              ))
            ) : (
              <p className="text-center w-100">{t('noPromotionsAvailable')}</p>
            )
          )}
        </div>
        <div className="text-center mt-4">
          <Link to="/product" className="btn btn-outline-primary">
            {t('seeAllOffers')}
          </Link>
        </div>
      </Container>

      {/* Section Produits Populaires / Best-sellers */}
      <Container class1="popular-products-wrapper py-5" style={{backgroundColor: "var(--sanny-bg-light)"}}>
        <div className="section-title-wrapper">
          <div className="title-with-badge">
            <h2 className="section-title">{t('popularProducts')}</h2>
            <span className="popular-badge"><FaStar /> Best-seller</span>
          </div>
          <p className="section-subtitle">{t('discoverMostAppreciated')}</p>
        </div>
        <div className="row">
          {bestsellerProducts && bestsellerProducts.length > 0 ? (
            bestsellerProducts.slice(0, 6).map((product) => (
              <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product.id}>
                <ProductCard data={product} gridView={true} />
              </div>
            ))
          ) : (
            // Fallback: afficher les produits populaires ou tous les produits
            popularProducts && popularProducts.length > 0 ? (
              popularProducts.slice(0, 6).map((product) => (
                <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product.id}>
                  <ProductCard data={product} gridView={true} />
                </div>
              ))
            ) : allProducts && allProducts.length > 0 ? (
              allProducts.slice(0, 6).map((product) => (
                <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product.id}>
                  <ProductCard data={product} gridView={true} />
                </div>
              ))
            ) : (
              <p className="text-center w-100">{t('noProductsAvailable')}</p>
            )
          )}
        </div>
        <div className="text-center mt-4">
          <Link to="/product" className="btn btn-primary">
            {t('seeAllProducts')}
          </Link>
        </div>
      </Container>

      {/* Section Nouveaux Produits */}
      <Container class1="new-products-wrapper py-5">
        <div className="section-title-wrapper">
          <div className="title-with-badge">
            <h2 className="section-title">{t('newProducts')}</h2>
            <span className="new-badge"><FaTags /> Nouveau</span>
          </div>
          <p className="section-subtitle">{t('latestArrivals')}</p>
        </div>
        <div className="row">
          {newProducts && newProducts.length > 0 ? (
            newProducts.slice(0, 6).map((product) => (
              <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product.id}>
                <ProductCard data={product} gridView={true} />
              </div>
            ))
          ) : (
            // Fallback: afficher les derniers produits par date de création
            allProducts && allProducts.length > 0 ? (
              allProducts
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6)
                .map((product) => (
                  <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product.id}>
                    <ProductCard data={product} gridView={true} />
                  </div>
                ))
            ) : (
              <p className="text-center w-100">{t('noNewProducts')}</p>
            )
          )}
        </div>
        <div className="text-center mt-4">
          <Link to="/product" className="btn btn-outline-primary">
            {t('seeAllNewProducts')}
          </Link>
        </div>
      </Container>

      {/* Section Produits en Vedette */}
      {featuredProductsFiltered && featuredProductsFiltered.length > 0 && (
        <Container class1="featured-products-wrapper py-5" style={{backgroundColor: "var(--sanny-bg-light)"}}>
          <div className="section-title-wrapper">
            <div className="title-with-badge">
              <h2 className="section-title">Produits en Vedette</h2>
              <span className="featured-badge" style={{backgroundColor: "#9333ea", color: "white"}}>💎 Vedette</span>
            </div>
            <p className="section-subtitle">Notre sélection exclusive pour vous</p>
          </div>
          <div className="row">
            {featuredProductsFiltered.slice(0, 3).map((product) => (
              <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product.id}>
                <ProductCard data={product} gridView={true} />
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/product" className="btn btn-primary">
              Voir tous les produits en vedette
            </Link>
          </div>
        </Container>
      )}

      {/* Categories Section - Carrousel Automatique */}
      <Container class1="categories-carousel-wrapper py-5" style={{backgroundColor: "var(--sanny-bg-light)"}}>
        <div className="section-title-wrapper">
          <h2 className="section-title">{t('exploreCategories')}</h2>
          <p className="section-subtitle">Trouvez exactement ce que vous cherchez</p>
        </div>
        <div className="categories-carousel-container">
          <div className="categories-carousel-track">
            {allCategories && allCategories.length > 0 ? (
              <>
                {/* Premier ensemble de catégories */}
                {allCategories.map((category) => (
                  <Link 
                    to={`/product?category=${encodeURIComponent(category.title)}`} 
                    className="category-carousel-item" 
                    key={`${category.id || category.id}-1`}
                  >
                    <div className="category-icon-wrapper">
                      {getCategoryIcon(category.title)}
                    </div>
                    <p className="category-name">{category.title}</p>
                  </Link>
                ))}
                {/* Dupliquer pour un défilement infini */}
                {allCategories.map((category) => (
                  <Link 
                    to={`/product?category=${encodeURIComponent(category.title)}`} 
                    className="category-carousel-item" 
                    key={`${category.id || category.id}-2`}
                  >
                    <div className="category-icon-wrapper">
                      {getCategoryIcon(category.title)}
                    </div>
                    <p className="category-name">{category.title}</p>
                  </Link>
                ))}
              </>
            ) : (
              <p className="text-center w-100">{t('noCategories')}</p>
            )}
          </div>
        </div>
      </Container>

      {/* Carrousel des Marques */}
      <Container class1="brands-carousel-wrapper py-5">
        <div className="section-title-wrapper">
          <h2 className="section-title">{t('ourPartnerBrands')}</h2>
          <p className="section-subtitle">Des marques de confiance</p>
        </div>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <BrandCarousel brands={brands} />
        </div>
      </Container>

      {/* Pourquoi Sanny Section */}
      <Container class1="why-sanny-wrapper py-5">
        <div className="section-title-wrapper">
          <h2 className="section-title">{t('whyChooseSanny')}</h2>
          <p className="section-subtitle">{t('whyChooseSannySubtitle')}</p>
        </div>
        <div className="row justify-content-center g-4">
            <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                    <div className="feature-card-icon">
                        <FaRocket />
                    </div>
                    <h3 className="feature-card-title">{t('fastService')}</h3>
                    <p className="feature-card-description">
                        {t('fastServiceDescription')}
                    </p>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                    <div className="feature-card-icon">
                        <FaShieldAlt />
                    </div>
                    <h3 className="feature-card-title">{t('reliableTransactions')}</h3>
                    <p className="feature-card-description">
                        {t('reliableTransactionsDescription')}
                    </p>
                </div>
            </div>
            <div className="col-lg-4 col-md-6">
                <div className="feature-card">
                    <div className="feature-card-icon">
                        <FaCheckCircle />
                    </div>
                    <h3 className="feature-card-title">{t('securePayment')}</h3>
                    <p className="feature-card-description">
                        {t('securePaymentDescription')}
                    </p>
                </div>
            </div>
        </div>
      </Container>

      {/* Section Garanties et Services - Carrousel Animé */}
      <Container class1="services-guarantee-wrapper py-5">
        <div className="section-title-wrapper">
          <h2 className="section-title">{t('ourGuarantees')}</h2>
          <p className="section-subtitle">{t('ourGuaranteesSubtitle')}</p>
        </div>
        <div className="services-carousel-container">
          <div className="services-track">
            <div className="service-card">
              <div className="service-icon">
                <FaShippingFast />
              </div>
              <h4 className="service-title">{t('fastDelivery')}</h4>
              <p className="service-description">{t('fastDeliveryDesc')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <FaCreditCard />
              </div>
              <h4 className="service-title">{t('securePayment')}</h4>
              <p className="service-description">{t('securePaymentDesc')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <FaUndo />
              </div>
              <h4 className="service-title">{t('freeReturn')}</h4>
              <p className="service-description">{t('freeReturnDesc')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <FaHeadset />
              </div>
              <h4 className="service-title">{t('support247')}</h4>
              <p className="service-description">{t('support247Desc')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <FaClock />
              </div>
              <h4 className="service-title">{t('expressDelivery')}</h4>
              <p className="service-description">{t('expressDeliveryDesc')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <FaAward />
              </div>
              <h4 className="service-title">{t('qualityGuarantee')}</h4>
              <p className="service-description">{t('qualityGuaranteeDesc')}</p>
            </div>
            {/* Duplicate cards for infinite scroll effect */}
            <div className="service-card">
              <div className="service-icon">
                <FaShippingFast />
              </div>
              <h4 className="service-title">{t('fastDelivery')}</h4>
              <p className="service-description">{t('fastDeliveryDesc')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <FaCreditCard />
              </div>
              <h4 className="service-title">{t('securePayment')}</h4>
              <p className="service-description">{t('securePaymentDesc')}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <FaUndo />
              </div>
              <h4 className="service-title">{t('freeReturn')}</h4>
              <p className="service-description">{t('freeReturnDesc')}</p>
            </div>
          </div>
        </div>
      </Container>

      {/* Testimonials Section */}
      <TestimonialsSection />

    </>
  );
};

export default Home;