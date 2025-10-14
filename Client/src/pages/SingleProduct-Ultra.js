import React, { useEffect, useState, useRef } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import ProductCard from '../components/ProductCard';
import ReactStars from "react-rating-stars-component";
import ReactImageZoom from 'react-image-zoom';
import Color from '../components/Color';
import { 
  TbGitCompare, TbTruck, TbShield, TbHeart, TbShare, TbShoppingCart, TbZoomIn, 
  TbSparkles, TbFlash, TbStar, TbTrending, TbEye, TbDownload, TbGift
} from "react-icons/tb";
import { 
  AiOutlineHeart, AiFillHeart, AiOutlineFire, AiFillSafetyCertificate,
  AiOutlineThunderbolt, AiOutlineCrown
} from "react-icons/ai";
import { BiMinus, BiPlus, BiCheck, BiLike, BiDislike } from "react-icons/bi";
import { 
  BsStarFill, BsStarHalf, BsStar, BsWhatsapp, BsFacebook, BsInstagram,
  BsLightning, BsShield, BsChatDots, BsHeart, BsBookmark
} from "react-icons/bs";
import { 
  FaRegClock, FaShippingFast, FaMedal, FaCertificate, FaUserCheck,
  FaRocket, FaMagic, FaGem
} from "react-icons/fa";
import { 
  MdVerified, MdLocalOffer, MdTrendingUp, MdSecurity, MdFlashOn,
  MdFavorite, MdShare, MdShoppingCart
} from "react-icons/md";
import Container from '../components/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../contexts/TranslationContext';
import { addRating, getAProduct, getAllProducts } from '../features/products/productSlice';
import { toast } from 'react-toastify';
import { addProdToCart, getUserCart, setBuyNowItem, toggleProductWishlist } from '../features/user/userSlice';

const SingleProductUltra = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [color, setColor] = useState(null);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState('');
  const [popularProduct, setPopularProduct] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showProductVideo, setShowProductVideo] = useState(false);
  const [viewersCount, setViewersCount] = useState(0);
  const [recommendedByAI, setRecommendedByAI] = useState(false);
  const [flashSale, setFlashSale] = useState(false);

  const imageRef = useRef(null);
  const parallaxRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const getProductSlug = location.pathname.split("/")[2];
  const dispatch = useDispatch();

  const productState = useSelector(state => state?.product?.singleproduct);
  const cartState = useSelector(state => state?.auth?.cartProducts);
  const productState1 = useSelector(state => state?.product?.product);
  const authState = useSelector(state => state?.auth?.user);

  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  // Effet parallaxe
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (parallaxRef.current) {
        const rect = parallaxRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x: x - 0.5, y: y - 0.5 });
      }
    };

    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Simulation AI et analytics
  useEffect(() => {
    // Simuler viewers en temps réel
    const interval = setInterval(() => {
      setViewersCount(prev => Math.max(12, prev + Math.floor(Math.random() * 3) - 1));
    }, 3000);

    // Simuler recommandation AI
    setTimeout(() => {
      setRecommendedByAI(Math.random() > 0.7);
    }, 2000);

    // Simuler flash sale
    const flashInterval = setInterval(() => {
      setFlashSale(prev => !prev);
    }, 5000);

    setViewersCount(Math.floor(Math.random() * 20) + 15);

    return () => {
      clearInterval(interval);
      clearInterval(flashInterval);
    };
  }, []);

  useEffect(() => {
    if (loading) {
      dispatch(getAProduct(getProductSlug));
      dispatch(getAllProducts());
      
      if (authState) {
        dispatch(getUserCart());
      }
      
      setLoading(false);
    }
  }, [dispatch, getProductSlug, loading, authState]);

  useEffect(() => {
    if (Array.isArray(productState1)) {
      const popularProducts = productState1.filter(product => product.tags === 'popular').slice(0, 8);
      setPopularProduct(popularProducts);
    }
  }, [productState1]);

  useEffect(() => {
    if (cartState && cartState.length > 0 && productState) {
      const isAlreadyAdded = cartState.some(item => item?.productId?.id === productState.id);
      setAlreadyAdded(isAlreadyAdded);
    }
  }, [cartState, productState]);

  const handleQuantityChange = (increment) => {
    if (increment && quantity < 10) {
      setQuantity(quantity + 1);
    } else if (!increment && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addRatingToProduct = () => {
    if (star === 0) {
      toast.error(t('pleaseAddStarRating'));
      return;
    }
    if (!comment.trim()) {
      toast.error("Veuillez écrire un commentaire sur le produit");
      return;
    }
    
    dispatch(addRating({ star, comment, prodId: productState?.id }));
    setStar(0);
    setComment('');
    setTimeout(() => {
      dispatch(getAProduct(getProductSlug));
    }, 100);
    toast.success("Avis ajouté avec succès!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const uploadCart = () => {
    if (!authState) {
      toast.error(t('loginRequired'), {
        position: "top-center",
        icon: "🔐"
      });
      navigate('/login');
      return;
    }

    dispatch(addProdToCart({
      productId: productState?.id,
      quantity,
      color: color || null,
      price: productState?.price
    }));
    
    toast.success("🎉 Produit ajouté au panier!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const addToWishlist = () => {
    if (!authState) {
      toast.error(t('pleaseLoginForWishlist'));
      navigate('/login');
      return;
    }

    dispatch(toggleProductWishlist(productState?.id));
    setIsWishlisted(!isWishlisted);
    
    if (!isWishlisted) {
      toast.success("❤️ Ajouté à vos favoris!", {
        position: "top-left",
        autoClose: 2000,
      });
    } else {
      toast.info("Retiré de vos favoris");
    }
  };

  const buyNow = () => {
    if (!authState) {
      toast.error("Veuillez vous connecter pour continuer");
      navigate('/login');
      return;
    }

    const buyNowItemData = {
      _id: Date.now(),
      productId: {
        _id: productState?.id,
        title: productState?.title,
        images: productState?.images
      },
      quantity: parseInt(quantity),
      color: color || null,
      price: productState?.price
    };

    dispatch(setBuyNowItem(buyNowItemData));
    navigate('/checkout');
    toast.success("🚀 Redirection vers la commande!");
  };

  const shareProduct = (platform) => {
    const url = window.location.href;
    const title = productState?.title || 'Découvrez ce produit incroyable';
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'instagram':
        navigator.clipboard.writeText(url);
        toast.success('📋 Lien copié! Partagez-le sur Instagram');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('🔗 Lien du produit copié!');
        break;
      default:
        setShowShareModal(true);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<BsStarFill key={i} className="star-filled animate-pulse" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<BsStarHalf key={i} className="star-half" />);
      } else {
        stars.push(<BsStar key={i} className="star-empty" />);
      }
    }
    return stars;
  };

  const handleImageChange = (index) => {
    setSelectedImage(index);
    setImageLoading(true);
    setTimeout(() => setImageLoading(false), 300);
  };

  if (!productState) {
    return (
      <div className="ultra-loading-container">
        <div className="ultra-loading-spinner">
          <div className="spinner-ultra">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
          <h3>Chargement du produit...</h3>
          <p>Préparation de l'expérience premium</p>
        </div>
      </div>
    );
  }

  const discount = productState?.oldPrice ? Math.round(((productState.oldPrice - productState.price) / productState.oldPrice) * 100) : 0;

  return (
    <>
      <Meta title={productState?.title || "Product"} />
      <BrandCrumb title={productState?.title || "Product"} />
      
      <div className="ultra-product-page" ref={parallaxRef}>
        {/* Particules d'arrière-plan */}
        <div className="particles-background">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        {/* Header avec stats en temps réel */}
        <div className="ultra-header-stats">
          <div className="stats-container">
            <div className="stat-item pulse">
              <TbEye className="stat-icon" />
              <span>{viewersCount} personnes regardent</span>
            </div>
            {recommendedByAI && (
              <div className="stat-item ai-recommended">
                <TbSparkles className="stat-icon" />
                <span>Recommandé par IA</span>
              </div>
            )}
            {flashSale && (
              <div className="stat-item flash-sale">
                <TbFlash className="stat-icon animate-bounce" />
                <span>Vente Flash!</span>
              </div>
            )}
          </div>
        </div>

        {/* Section principale du produit */}
        <Container class1="ultra-product-container py-5">
          <div className="row g-5">
            {/* Galerie d'images ultra-moderne */}
            <div className="col-lg-6">
              <div className="ultra-product-gallery">
                {/* Image principale avec effets 3D */}
                <div 
                  className={`main-image-container-ultra ${isZoomed ? 'zoomed' : ''} ${isImageHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setIsImageHovered(true)}
                  onMouseLeave={() => setIsImageHovered(false)}
                  style={{
                    transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
                  }}
                >
                  {/* Badges premium */}
                  <div className="ultra-badges">
                    {productState?.tags?.includes('special') && (
                      <div className="badge-ultra special">
                        <FaGem className="badge-icon" />
                        <span>Spécial</span>
                      </div>
                    )}
                    {productState?.tags?.includes('new') && (
                      <div className="badge-ultra new">
                        <FaRocket className="badge-icon" />
                        <span>Nouveau</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="badge-ultra discount">
                        <MdLocalOffer className="badge-icon" />
                        <span>-{discount}%</span>
                      </div>
                    )}
                    {recommendedByAI && (
                      <div className="badge-ultra ai">
                        <FaMagic className="badge-icon" />
                        <span>IA</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions flottantes */}
                  <div className="floating-actions">
                    <button 
                      className="floating-btn zoom-btn"
                      onClick={() => setIsZoomed(!isZoomed)}
                      title="Zoom"
                    >
                      <TbZoomIn />
                    </button>
                    <button 
                      className={`floating-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
                      onClick={addToWishlist}
                      title="Favoris"
                    >
                      {isWishlisted ? <AiFillHeart /> : <AiOutlineHeart />}
                    </button>
                    <button 
                      className="floating-btn share-btn"
                      onClick={() => shareProduct()}
                      title="Partager"
                    >
                      <TbShare />
                    </button>
                  </div>

                  {/* Indicateur de qualité */}
                  <div className="quality-indicator">
                    <div className="quality-badge premium">
                      <MdVerified className="quality-icon" />
                      <span>Premium</span>
                    </div>
                  </div>

                  {/* Image principale */}
                  <div className="main-image-ultra">
                    {imageLoading && <div className="image-loader">Chargement...</div>}
                    {productState?.images?.[selectedImage] ? (
                      isZoomed ? (
                        <ReactImageZoom
                          width={600}
                          height={600}
                          zoomWidth={400}
                          img={productState.images[selectedImage].url}
                          zoomStyle="opacity: 1; background-color: white; border-radius: 15px;"
                        />
                      ) : (
                        <img
                          src={productState.images[selectedImage].url}
                          alt={productState.title}
                          className={`product-main-image-ultra ${imageLoading ? 'loading' : 'loaded'}`}
                          onLoad={() => setImageLoading(false)}
                          ref={imageRef}
                        />
                      )
                    ) : (
                      <div className="no-image-ultra">
                        <TbGift className="no-image-icon" />
                        <p>Image non disponible</p>
                      </div>
                    )}
                  </div>

                  {/* Effets de lumière */}
                  <div className="light-effects">
                    <div className="light-ray light-1"></div>
                    <div className="light-ray light-2"></div>
                    <div className="light-ray light-3"></div>
                  </div>
                </div>

                {/* Carousel de thumbnails 3D */}
                {productState?.images?.length > 1 && (
                  <div className="ultra-thumbnails">
                    <div className="thumbnails-container">
                      {productState.images.map((image, index) => (
                        <div
                          key={index}
                          className={`thumbnail-ultra ${selectedImage === index ? 'active' : ''}`}
                          onClick={() => handleImageChange(index)}
                          style={{
                            transform: `translateZ(${selectedImage === index ? '10px' : '0px'}) scale(${selectedImage === index ? '1.1' : '1'})`
                          }}
                        >
                          <img src={image.url} alt={`${productState.title} ${index + 1}`} />
                          <div className="thumbnail-overlay">
                            <TbEye className="overlay-icon" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Détails du produit ultra-modernes */}
            <div className="col-lg-6">
              <div className="ultra-product-details">
                {/* En-tête avec certifications */}
                <div className="product-header-ultra">
                  <div className="brand-category-ultra">
                    <span className="brand-ultra">
                      <FaCertificate className="brand-icon" />
                      {productState?.brand}
                    </span>
                    <span className="category-ultra">{productState?.Category}</span>
                  </div>
                  
                  <h1 className="product-title-ultra">
                    {productState?.title}
                    <FaMedal className="title-icon" />
                  </h1>
                  
                  {/* Évaluation premium */}
                  <div className="product-rating-ultra">
                    <div className="stars-container-ultra">
                      <div className="stars-ultra">
                        {renderStars(productState?.totalratings || 0)}
                      </div>
                      <div className="rating-info">
                        <span className="rating-number">{productState?.totalratings || 0}</span>
                        <span className="rating-separator">•</span>
                        <button className="review-link-ultra" onClick={() => setShowReviews(!showReviews)}>
                          <BsChatDots />
                          {t('viewReviews')}
                        </button>
                      </div>
                    </div>
                    
                    {/* Certificats de qualité */}
                    <div className="quality-certificates">
                      <div className="certificate verified">
                        <MdVerified />
                        <span>Vérifié</span>
                      </div>
                      <div className="certificate secure">
                        <MdSecurity />
                        <span>Sécurisé</span>
                      </div>
                      <div className="certificate trending">
                        <MdTrendingUp />
                        <span>Tendance</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing premium avec animations */}
                <div className="product-pricing-ultra">
                  <div className="price-container-ultra">
                    <div className="current-price-ultra">
                      {productState?.price} TND
                      <div className="price-sparkle">✨</div>
                    </div>
                    {productState?.oldPrice && (
                      <div className="old-price-ultra">
                        <span className="strikethrough">{productState.oldPrice} TND</span>
                        <div className="savings-badge">
                          Économisez {(productState.oldPrice - productState.price).toFixed(2)} TND
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="stock-status-ultra">
                    <div className="stock-indicator">
                      <div className="stock-dot animate-pulse"></div>
                      <span>En stock - Expédition rapide</span>
                    </div>
                    <div className="urgency-indicator">
                      <BsLightning className="urgency-icon" />
                      <span>Seulement quelques unités restantes!</span>
                    </div>
                  </div>
                </div>

                {/* Options produit améliorées */}
                <div className="product-options-ultra">
                  {/* Couleurs avec preview */}
                  {productState?.color && productState.color.length > 0 && !alreadyAdded && (
                    <div className="option-group-ultra">
                      <label className="option-label-ultra">
                        <span>Couleur</span>
                        <span className="option-count">({productState.color.length} disponibles)</span>
                      </label>
                      <div className="color-options-ultra">
                        <Color setColor={setColor} colorData={productState.color} />
                      </div>
                    </div>
                  )}

                  {/* Quantité avec style premium */}
                  {!alreadyAdded && (
                    <div className="option-group-ultra">
                      <label className="option-label-ultra">Quantité</label>
                      <div className="quantity-selector-ultra">
                        <button 
                          className="qty-btn-ultra minus"
                          onClick={() => handleQuantityChange(false)}
                          disabled={quantity <= 1}
                        >
                          <BiMinus />
                        </button>
                        <div className="qty-display-ultra">
                          <span>{quantity}</span>
                          <div className="qty-animation"></div>
                        </div>
                        <button 
                          className="qty-btn-ultra plus"
                          onClick={() => handleQuantityChange(true)}
                          disabled={quantity >= 10}
                        >
                          <BiPlus />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Boutons d'action premium */}
                <div className="product-actions-ultra">
                  <div className="main-actions-ultra">
                    <button 
                      className={`btn-ultra btn-cart-ultra ${alreadyAdded ? 'in-cart' : ''}`}
                      onClick={() => alreadyAdded ? navigate('/cart') : uploadCart()}
                    >
                      <div className="btn-content">
                        <MdShoppingCart className="btn-icon" />
                        <span>{alreadyAdded ? t('viewCart') : t('addToCart')}</span>
                      </div>
                      <div className="btn-shine"></div>
                    </button>
                    
                    <button className="btn-ultra btn-buy-ultra" onClick={buyNow}>
                      <div className="btn-content">
                        <FaRocket className="btn-icon" />
                        <span>{t('buyNow')}</span>
                      </div>
                      <div className="btn-glow"></div>
                    </button>
                  </div>

                  {/* Actions secondaires */}
                  <div className="secondary-actions-ultra">
                    <button className="action-link-ultra" onClick={() => {}}>
                      <TbGitCompare />
                      <span>Comparer</span>
                    </button>
                    <button className="action-link-ultra" onClick={addToWishlist}>
                      <MdFavorite className={isWishlisted ? 'active' : ''} />
                      <span>Favoris</span>
                    </button>
                    <button className="action-link-ultra" onClick={() => shareProduct()}>
                      <MdShare />
                      <span>Partager</span>
                    </button>
                  </div>
                </div>

                {/* Informations de livraison premium */}
                <div className="delivery-info-ultra">
                  <div className="delivery-grid">
                    <div className="delivery-item">
                      <div className="delivery-icon">
                        <FaShippingFast />
                      </div>
                      <div className="delivery-content">
                        <h4>Livraison Express</h4>
                        <p>Livraison en 24-48h</p>
                        <span className="delivery-price">Gratuite dès 50 TND</span>
                      </div>
                    </div>
                    
                    <div className="delivery-item">
                      <div className="delivery-icon">
                        <BsShield />
                      </div>
                      <div className="delivery-content">
                        <h4>Garantie Premium</h4>
                        <p>Garantie fabricant 2 ans</p>
                        <span className="delivery-price">Incluse</span>
                      </div>
                    </div>
                    
                    <div className="delivery-item">
                      <div className="delivery-icon">
                        <FaUserCheck />
                      </div>
                      <div className="delivery-content">
                        <h4>Support 24/7</h4>
                        <p>Assistance client premium</p>
                        <span className="delivery-price">Incluse</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Reste du composant avec les onglets et produits recommandés... */}
        {/* (continuera dans la partie 2 pour éviter un fichier trop long) */}
      </div>
    </>
  );
};

export default SingleProductUltra;