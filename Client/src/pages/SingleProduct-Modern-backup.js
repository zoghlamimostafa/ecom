import React, { useEffect, useState } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import ProductCard from '../components/ProductCard';
import ReactStars from "react-rating-stars-component";
import ReactImageZoom from 'react-image-zoom';
import Color from '../components/Color';
import { TbGitCompare, TbTruck, TbShield, TbHeart, TbShare, TbShoppingCart, TbZoomIn } from "react-icons/tb";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiMinus, BiPlus, BiCheck } from "react-icons/bi";
import { BsStarFill, BsStarHalf, BsStar, BsWhatsapp, BsFacebook, BsInstagram } from "react-icons/bs";
import { FaRegClock, FaShippingFast } from "react-icons/fa";
import Container from '../components/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRating, getAProduct, getAllProducts } from '../features/products/productSlice';
import { toast } from 'react-toastify';
import { addProdToCart, getUserCart, setBuyNowItem, toggleProductWishlist } from '../features/user/userSlice';
import { useTranslation } from '../contexts/TranslationContext';

const SingleProductModern = () => {
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

  const location = useLocation();
  const navigate = useNavigate();
  const getProductSlug = location.pathname.split("/")[2];
  const dispatch = useDispatch();

  const productState = useSelector(state => state?.product?.singleproduct);
  const cartState = useSelector(state => state?.auth?.cartProducts);
  const productState1 = useSelector(state => state?.product?.product);
  const authState = useSelector(state => state?.auth?.user);

  const [loading, setLoading] = useState(true);

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
      toast.error(t('pleaseWriteComment'));
      return;
    }
    
    dispatch(addRating({ star, comment, prodId: productState?.id }));
    setStar(0);
    setComment('');
    setTimeout(() => {
      dispatch(getAProduct(getProductSlug));
    }, 100);
    toast.success(t('reviewAddedSuccess'));
  };

  const uploadCart = () => {
    if (!authState) {
      toast.error(t('pleaseLoginForCart'));
      navigate('/login');
      return;
    }

    dispatch(addProdToCart({
      productId: productState?.id,
      quantity,
      color: color || null,
      price: productState?.price
    }));
    
        toast.success(t('productAddedToCart'));
  };

  const addToWish = (id) => {
    if (!user) {
      toast.error(t('pleaseLoginForWishlist'));
  };

  const addToWishlist = () => {
    if (!authState) {
      toast.error(t('pleaseLoginForWishlist'));
      navigate('/login');
      return;
    }

    dispatch(toggleProductWishlist(productState?.id));
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? t('removedFromWishlist') : t('addedToWishlist'));
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
    toast.success("Redirection vers la commande");
  };

  const shareProduct = (platform) => {
    const url = window.location.href;
    const title = productState?.title || t('discoverThisProduct');
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'instagram':
        navigator.clipboard.writeText(url);
        toast.success(t('linkCopiedInstagram'));
        break;
      default:
        navigator.clipboard.writeText(url);
        toast.success(t('productLinkCopied'));
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<BsStarFill key={i} className="star-filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<BsStarHalf key={i} className="star-half" />);
      } else {
        stars.push(<BsStar key={i} className="star-empty" />);
      }
    }
    return stars;
  };

  if (!productState) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('loadingProduct')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Meta title={productState?.title || "Product"} />
      <BrandCrumb title={productState?.title || "Product"} />
      
      <div className="modern-product-page">
        {/* Section principale du produit */}
        <Container class1="modern-product-container py-5">
          <div className="row g-5">
            {/* Galerie d'images */}
            <div className="col-lg-6">
              <div className="modern-product-gallery">
                {/* Image principale */}
                <div className={`main-image-container ${isZoomed ? 'zoomed' : ''}`}>
                  <div className="image-badges">
                    {productState?.tags?.includes('special') && (
                      <span className="badge badge-special">{t('specialBadge')}</span>
                    )}
                    {productState?.tags?.includes('new') && (
                      <span className="badge badge-new">{t('newBadge')}</span>
                    )}
                  </div>
                  
                  <div className="image-actions">
                    <button 
                      className="action-btn zoom-btn"
                      onClick={() => setIsZoomed(!isZoomed)}
                      title="Zoom"
                    >
                      <TbZoomIn />
                    </button>
                    <button 
                      className={`action-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
                      onClick={addToWishlist}
                      title={t('addToFavorites')}
                    >
                      {isWishlisted ? <AiFillHeart /> : <AiOutlineHeart />}
                    </button>
                  </div>

                  <div className="main-image">
                    {productState?.images?.[selectedImage] ? (
                      isZoomed ? (
                        <ReactImageZoom
                          width={500}
                          height={500}
                          zoomWidth={300}
                          img={productState.images[selectedImage].url}
                          zoomStyle="opacity: 1; background-color: white;"
                        />
                      ) : (
                        <img
                          src={productState.images[selectedImage].url}
                          alt={productState.title}
                          className="product-main-image"
                        />
                      )
                    ) : (
                      <div className="no-image">
                        <p>{t('imageNotAvailable')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {productState?.images?.length > 1 && (
                  <div className="image-thumbnails">
                    {productState.images.map((image, index) => (
                      <div
                        key={index}
                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img src={image.url} alt={`${productState.title} ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Détails du produit */}
            <div className="col-lg-6">
              <div className="modern-product-details">
                {/* En-tête produit */}
                <div className="product-header">
                  <div className="brand-category">
                    <span className="brand">{productState?.brand}</span>
                    <span className="category">{productState?.Category}</span>
                  </div>
                  <h1 className="product-title">{productState?.title}</h1>
                  
                  {/* Évaluation */}
                  <div className="product-rating">
                    <div className="stars">
                      {renderStars(productState?.totalratings || 0)}
                    </div>
                    <span className="rating-text">
                      ({productState?.totalratings || 0}) • <button className="review-link" onClick={() => setShowReviews(!showReviews)}>{t('seeReviews')}</button>
                    </span>
                  </div>
                </div>

                {/* Prix */}
                <div className="product-pricing">
                  <div className="price-container">
                    <span className="current-price">{productState?.price} TND</span>
                    {productState?.oldPrice && (
                      <span className="old-price">{productState.oldPrice} TND</span>
                    )}
                  </div>
                  <div className="stock-status">
                    <BiCheck className="stock-icon" />
                    <span>{t('inStockFastDelivery')}</span>
                  </div>
                </div>

                {/* Options produit */}
                <div className="product-options">
                  {/* Couleurs */}
                  {productState?.color && productState.color.length > 0 && !alreadyAdded && (
                    <div className="option-group">
                      <label className="option-label">{t('colorLabel')}</label>
                      <div className="color-options">
                        <Color setColor={setColor} colorData={productState.color} />
                      </div>
                    </div>
                  )}

                  {/* Quantité et actions */}
                  {!alreadyAdded && (
                    <div className="option-group">
                      <label className="option-label">{t('quantityLabel')}</label>
                      <div className="quantity-selector">
                        <button 
                          className="qty-btn"
                          onClick={() => handleQuantityChange(false)}
                          disabled={quantity <= 1}
                        >
                          <BiMinus />
                        </button>
                        <span className="qty-display">{quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => handleQuantityChange(true)}
                          disabled={quantity >= 10}
                        >
                          <BiPlus />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="product-actions">
                  <div className="main-actions">
                    <button 
                      className={`btn btn-cart ${alreadyAdded ? 'in-cart' : ''}`}
                      onClick={() => alreadyAdded ? navigate('/cart') : uploadCart()}
                    >
                      <TbShoppingCart />
                      {alreadyAdded ? t('viewCart') : t('addToCartBtn')}
                    </button>
                    
                    <button className="btn btn-buy" onClick={buyNow}>
                      {t('buyNowBtn')}
                    </button>
                  </div>

                  <div className="secondary-actions">
                    <button className="action-link" onClick={() => {}}>
                      <TbGitCompare />
                      Comparer
                    </button>
                    <div className="share-dropdown">
                      <button className="action-link">
                        <TbShare />
                        Partager
                      </button>
                      <div className="share-options">
                        <button onClick={() => shareProduct('whatsapp')}><BsWhatsapp /> WhatsApp</button>
                        <button onClick={() => shareProduct('facebook')}><BsFacebook /> Facebook</button>
                        <button onClick={() => shareProduct('instagram')}><BsInstagram /> Instagram</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations de livraison */}
                <div className="delivery-info">
                  <div className="info-item">
                    <FaShippingFast className="info-icon" />
                    <div>
                      <strong>{t('fastDeliveryInfo')}</strong>
                      <p>{t('deliveryTime')}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <TbShield className="info-icon" />
                    <div>
                      <strong>Garantie</strong>
                      <p>Garantie fabricant incluse</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaRegClock className="info-icon" />
                    <div>
                      <strong>Support</strong>
                      <p>Service client 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Section avec onglets */}
        <Container class1="product-tabs-section py-5">
          <div className="row">
            <div className="col-12">
              <div className="modern-tabs">
                <div className="tab-navigation">
                  <button 
                    className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('specifications')}
                  >
                    Spécifications
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Avis clients
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shipping')}
                  >
                    Livraison
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === 'description' && (
                    <div className="tab-pane active">
                      <div className="description-content">
                        <h3>Description du produit</h3>
                        <div dangerouslySetInnerHTML={{ __html: productState?.description || 'Aucune description disponible.' }} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'specifications' && (
                    <div className="tab-pane active">
                      <div className="specifications-content">
                        <h3>Spécifications techniques</h3>
                        <div className="spec-list">
                          <div className="spec-item">
                            <span className="spec-label">Marque :</span>
                            <span className="spec-value">{productState?.brand}</span>
                          </div>
                          <div className="spec-item">
                            <span className="spec-label">Catégorie :</span>
                            <span className="spec-value">{productState?.Category}</span>
                          </div>
                          {productState?.color && productState.color.length > 0 && (
                            <div className="spec-item">
                              <span className="spec-label">Couleurs disponibles :</span>
                              <span className="spec-value">{productState.color.map(c => c.title).join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="tab-pane active">
                      <div className="reviews-content">
                        <div className="reviews-header">
                          <h3>Avis clients</h3>
                          <div className="overall-rating">
                            <div className="rating-display">
                              <span className="rating-number">{productState?.totalratings || 0}</span>
                              <div className="rating-stars">
                                {renderStars(productState?.totalratings || 0)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Formulaire d'avis */}
                        <div className="write-review">
                          <h4>Écrire un avis</h4>
                          <div className="review-form">
                            <div className="rating-input">
                              <label>Votre note :</label>
                              <ReactStars
                                count={5}
                                size={24}
                                value={star}
                                onChange={(newRating) => setStar(newRating)}
                                activeColor="#FF6F00"
                              />
                            </div>
                            <div className="comment-input">
                              <textarea
                                placeholder={t('shareYourExperience')}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                              />
                            </div>
                            <button className="submit-review-btn" onClick={addRatingToProduct}>
                              Publier l'avis
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="tab-pane active">
                      <div className="shipping-content">
                        <h3>Informations de livraison</h3>
                        <div className="shipping-options">
                          <div className="shipping-option">
                            <TbTruck className="shipping-icon" />
                            <div>
                              <h4>Livraison standard</h4>
                              <p>Livraison en 3-5 jours ouvrables partout en Tunisie</p>
                              <span className="shipping-price">Gratuite pour commandes &gt; 50 TND</span>
                            </div>
                          </div>
                          <div className="shipping-option">
                            <FaShippingFast className="shipping-icon" />
                            <div>
                              <h4>Livraison express</h4>
                              <p>Livraison en 24-48h dans les grandes villes</p>
                              <span className="shipping-price">5 TND</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Produits similaires */}
        <Container class1="related-products py-5">
          <div className="row">
            <div className="col-12">
              <div className="section-header">
                <h2>Produits recommandés</h2>
                <p>Découvrez d'autres produits que vous pourriez aimer</p>
              </div>
              
              <div className="products-grid">
                {popularProduct.length > 0 ? (
                  popularProduct.map((prod, index) => (
                    <div key={index} className="product-item">
                      <ProductCard data={prod} gridView={true} />
                    </div>
                  ))
                ) : (
                  <p className="no-products">Aucun produit recommandé pour le moment.</p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default SingleProductModern;