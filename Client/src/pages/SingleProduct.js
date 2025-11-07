import React, { useEffect, useState, useRef } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import ReactStars from "react-rating-stars-component";
import ReactImageZoom from 'react-image-zoom';
import Color from '../components/Color';
import { TbGitCompare } from "react-icons/tb";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import Container from '../components/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRating, getAProduct, getAllProducts, getAllRatings } from '../features/products/productSlice';
import { toast } from 'react-toastify';
import { addProdToCart, getUserCart, setBuyNowItem, toggleProductWishlist } from '../features/user/userSlice';
import { useTranslation } from '../contexts/TranslationContext';
import { getProductImageUrl, getAllProductImageUrls } from '../utils/imageHelper';
import './SingleProduct.css'; // Import des styles CSS

const SingleProduct = () => {
  const { t } = useTranslation();
  const [color, setColor] = useState(null);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [star, setStar] = useState(null);
  const [comment, setComment] = useState(null);
  const [popularProduct, setPopularProduct] = useState([]);
  const [orderProduct, setOrderProduct] = useState(true); // Etat pour contrôler l'affichage du formulaire de commentaire
  const [selectedImage, setSelectedImage] = useState(null);
  const mainImageRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 400, height: 400 });

  const location = useLocation();
  const navigate = useNavigate();
  const getProductSlug = location.pathname.split("/")[2]; // This now gets the slug instead of ID
  const dispatch = useDispatch();

  const productState = useSelector(state => state?.product?.singleproduct);
  const cartState = useSelector(state => state?.auth?.cartProducts);
  const productState1 = useSelector(state => state?.product?.product);
  const authState = useSelector(state => state?.auth?.user); // Corrected path

  // Logs de débogage
  console.log('🔍 SingleProduct Debug:');
  console.log('  Slug:', getProductSlug);
  console.log('  ProductState:', productState);
  console.log('  Images:', productState?.images);

  // Etat pour éviter les appels multiples
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (loading) {
      dispatch(getAProduct(getProductSlug)); // Charger le produit spécifique
      dispatch(getAllProducts()); // Charger tous les produits
      
      // Only fetch cart if user is authenticated
      if (authState) {
        dispatch(getUserCart()); // Charger le panier de l'utilisateur
      }
      
      setLoading(false); // Mettre à jour l'état pour indiquer que le chargement est terminé
    }
  }, [dispatch, getProductSlug, loading, authState]);

  useEffect(() => {
    // Extraire les produits populaires - s'assurer que productState1 est un tableau
    if (Array.isArray(productState1)) {
      const popularProducts = productState1.filter(product => product.tags === 'popular');
      setPopularProduct(popularProducts);
    }
  }, [productState1]);

  useEffect(() => {
    // Vérifier si le produit est déjà dans le panier
    if (cartState && cartState.length > 0 && productState) {
      const isAlreadyAdded = cartState.some(item => item?.productId?.id === productState.id);
      setAlreadyAdded(isAlreadyAdded);
    }
  }, [cartState, productState]);

  useEffect(() => {
    if (productState?.images && Array.isArray(productState.images) && productState.images.length > 0) {
      // Prendre la première image et la normaliser
      const firstImage = productState.images[0];
      const imageUrl = typeof firstImage === 'object' ? firstImage.url : firstImage;
      setSelectedImage(imageUrl);
      console.log('🖼️ Image sélectionnée:', imageUrl);
    }
  }, [productState]);

  // When selectedImage or container size changes, load image to get natural dimensions and measure container
  useEffect(() => {
    if (!selectedImage) return;

    let mounted = true;
    const img = new window.Image();
    img.src = selectedImage;
    img.onload = () => {
      if (!mounted) return;
      const naturalW = img.naturalWidth || 400;
      const naturalH = img.naturalHeight || 400;

      // Measure container width if possible
      let displayW = naturalW;
      if (mainImageRef.current && mainImageRef.current.clientWidth) {
        displayW = mainImageRef.current.clientWidth;
      } else if (window.innerWidth) {
        // fallback to a responsive width (approx half of viewport for desktop layouts)
        displayW = Math.min(naturalW, Math.floor(window.innerWidth * 0.45));
      }

      const displayH = Math.max(120, Math.round(displayW * (naturalH / naturalW)));

      setImageDimensions({ width: Math.max(120, displayW), height: displayH });
    };
    img.onerror = () => {
      // keep defaults
    };

    // Recompute on window resize to keep zoom correct
    const onResize = () => {
      if (!selectedImage) return;
      if (mainImageRef.current && mainImageRef.current.clientWidth) {
        const w = mainImageRef.current.clientWidth;
        setImageDimensions(prev => ({ ...prev, width: w, height: Math.max(120, Math.round(w * (prev.height / prev.width || 1))) }));
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', onResize);
    };
  }, [selectedImage]);

  const addRatingToProduct = async () => {
    if (!productState?.id) {
      toast.error("ID produit manquant");
      return false;
    }
    if (star === null) {
      toast.error("Veuillez ajouter une note");
      return false;
    } else if (comment === null || comment.trim() === '') {
      toast.error("Veuillez écrire un commentaire sur le produit");
      return false;
    } else {
      try {
        // Debug log for prodId
        console.log('[DEBUG] Sending rating with prodId:', productState.id, 'star:', star, 'comment:', comment);
        
        // Dispatch l'action et attendre la réponse
        await dispatch(addRating({ star, comment, prodId: productState.id })).unwrap();
        
        // Réinitialiser le formulaire
        setStar(null);
        setComment('');
        
        // Recharger immédiatement le produit pour afficher le nouvel avis
        await dispatch(getAProduct(getProductSlug)).unwrap();
        
        // 🔄 NOUVEAU : Rafraîchir également tous les avis pour la section Témoignages de Home
        dispatch(getAllRatings());
        
        toast.success("✅ Votre avis a été ajouté avec succès et apparaît ci-dessous !");
      } catch (error) {
        console.error('❌ Error adding rating:', error);
        toast.error("Erreur lors de l'ajout de l'avis");
      }
    }
    return false;
  };

  const uploadCart = () => {
    // Check if user is authenticated
    if (!authState) {
      toast.error(t('loginRequired'));
      navigate('/my-Profile');
      return;
    }

    // Vérification du stock disponible
    const stock = productState?.quantity ?? 0;
    if (stock > 0 && quantity > stock) {
      toast.error(`Stock insuffisant : il reste seulement ${stock} exemplaire(s) en stock.`);
      return;
    }

    dispatch(addProdToCart({
      productId: productState?.id,
      quantity,
      color: color || null, // Send null if no color is selected
      price: productState?.price
    }));
  };

  const addToWishlist = async () => {
    console.log('❤️ ADD TO WISHLIST clicked for product:', productState?.id);
    console.log('Auth State:', !!authState);
    console.log('Product State:', productState);
    
    // Check if user is authenticated
    if (!authState) {
      toast.error(t('pleaseLoginForWishlist'));
      navigate('/my-Profile');
      return;
    }

    if (!productState?.id) {
      toast.error("ID produit manquant");
      console.error('Product ID missing:', productState);
      return;
    }

    try {
      console.log('📦 Dispatching toggleProductWishlist with ID:', productState.id);
      const result = await dispatch(toggleProductWishlist(productState.id)).unwrap();
      console.log('✅ Wishlist success result:', result);
      toast.success(t('wishlistUpdateSuccess'));
    } catch (error) {
      console.error("❌ Error toggling wishlist:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      toast.error(error.message || "Erreur lors de la modification de la wishlist");
    }
  };

  const buyNow = () => {
    // Check if user is authenticated
    if (!authState) {
      toast.error("Veuillez vous connecter pour continuer");
      navigate('/login');
      return;
    }

    // Create the item data for immediate checkout
    const buyNowItemData = {
      _id: Date.now(), // Temporary ID for buy now item
      productId: {
        _id: productState?.id,
        title: productState?.title,
        images: productState?.images
      },
      quantity: parseInt(quantity),
      color: color || null,
      price: productState?.price
    };

    // Set the item in Redux state
    dispatch(setBuyNowItem(buyNowItemData));
    
    // Navigate to checkout
    navigate('/checkout');
    toast.success("Redirection vers la commande");
  };

  const props = {
    width: 500,
    height: 500,
    img: selectedImage || "/images/default-product.jpg",
    zoomPosition: "original",
    scale: 1.5
  };

  const copyToClipboard = (text) => {
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    toast.success(t('linkCopied'));
  };

  return (
    <>
      <SEO 
        title={productState?.title ? `${productState.title} - Sanny Shop` : "Produit - Sanny Shop"}
        description={productState?.description ? productState.description.replace(/<[^>]*>/g, '').substring(0, 160) : "Découvrez ce produit sur Sanny Shop"}
        keywords={`${productState?.title || 'produit'}, ${productState?.brand || 'e-commerce'}, acheter en ligne, Sanny Shop`}
        image={productState?.images?.[0]?.url || productState?.images?.[0]}
        type="product"
      />
      <Meta title={productState?.title || "Product"} />
      <BrandCrumb title={productState?.title || "Product"} />
      <Container class1="product-main-wrapper home-wrapper-2">
        <div className="modern-single-product-layout">
          {/* Section Image - Responsive */}
          <div className="product-image-gallery">
            <div className="main-image-container">
              {/* Badge flottant */}
              {productState?.quantity > 0 && (
                <div className="product-badge">En Stock</div>
              )}
              {productState?.quantity === 0 && (
                <div className="product-badge" style={{background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'}}>
                  Rupture
                </div>
              )}
              
              <div className="zoom-wrapper">
                <ReactImageZoom {...props} />
              </div>
            </div>

            {/* Thumbnails responsive */}
            <div className="product-thumbnails">
              {productState?.images && Array.isArray(productState.images) && productState.images.map((item, index) => {
                // Normaliser l'URL de l'image
                const imageUrl = typeof item === 'object' ? item.url : item;
                return (
                  <img
                    key={index}
                    src={imageUrl}
                    className={`thumbnail-image ${selectedImage === imageUrl ? 'active' : ''}`}
                    alt={`${productState?.title} ${index + 1}`}
                    onClick={() => setSelectedImage(imageUrl)}
                  />
                );
              })}
            </div>
          </div>

          {/* Section Détails - Responsive */}
          <div className="product-details-panel">
            <div className="product-header-section">
              <h1 className="modern-product-title">{productState?.title}</h1>
              
              {/* Rating responsive */}
              <div className="product-rating-display">
                <div className="rating-stars-container">
                  <ReactStars
                    count={5}
                    size={window.innerWidth < 768 ? 20 : 24}
                    value={Number(productState?.totalRating) || 0}
                    edit={false}
                    activeColor="#FF6F00"
                  />
                  <span className="rating-count">({productState?.ratings?.length || 0} avis)</span>
                </div>
                <a href="#review" className="write-review-link">
                  ✍️ Écrire un avis
                </a>
              </div>

              <div className="price-display">
                <span className="current-price">{productState?.price} DT</span>
                {productState?.quantity > 0 && <span className="price-badge">Disponible</span>}
              </div>
            </div>

            {/* Description responsive */}
            <div className="product-description-section">
              <h3>Description</h3>
              <div className="product-description-text">
                {productState?.description && (() => {
                  // Créer un élément temporaire pour décoder les entités HTML
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = productState.description;
                  // Extraire le texte sans balises HTML
                  const textContent = tempDiv.textContent || tempDiv.innerText || '';
                  // Nettoyer les espaces multiples et trim
                  return textContent.replace(/\s+/g, ' ').trim();
                })()}
              </div>
            </div>

            {/* Informations produit - Disponibilité uniquement */}
            <div className="product-specifications">
              <div className="spec-item">
                <span className="spec-label">Disponibilité</span>
                <span className="spec-value">{productState?.quantity > 0 ? `${productState?.quantity} en stock` : 'Rupture de stock'}</span>
              </div>
            </div>

            {/* Sélecteur de couleur responsive */}
            {!alreadyAdded && productState?.color && Array.isArray(productState.color) && productState.color.length > 0 && (
              <div className="color-selection-section">
                <h4>Couleur disponible</h4>
                <div className="color-options-container">
                  <Color setColor={setColor} colorData={productState?.color} />
                </div>
              </div>
            )}

            {/* Actions produit responsives */}
            <div className="product-action-panel">
              {!alreadyAdded && productState?.quantity > 0 && (
                <div className="quantity-selection">
                  <label htmlFor="quantity" className="quantity-label">Quantité :</label>
                  <div className="quantity-input-wrapper">
                    <button 
                      type="button" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="quantity-btn"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(productState.quantity, parseInt(e.target.value) || 1));
                        setQuantity(val);
                      }}
                      value={quantity}
                      type="number"
                      className="quantity-input"
                      min={1}
                      max={productState.quantity}
                      disabled={productState.quantity === 0}
                    />
                    <button 
                      type="button" 
                      onClick={() => setQuantity(Math.min(productState.quantity, quantity + 1))}
                      className="quantity-btn"
                      disabled={quantity >= productState.quantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              <div className="action-buttons-container">
                <button 
                  className="action-button primary"
                  onClick={() => { alreadyAdded ? navigate('/cart') : uploadCart() }}
                  disabled={productState?.quantity === 0}
                  style={productState?.quantity === 0 ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                >
                  <AiOutlineShoppingCart />
                  {alreadyAdded ? t('viewCart') : (productState?.quantity === 0 ? 'Rupture de stock' : t('addToCart'))}
                </button>
                
                <button 
                  className="action-button secondary"
                  onClick={buyNow}
                >
                  ⚡ {t('buyNow')}
                </button>
                
                <button 
                  className="action-button outline"
                  onClick={() => addToWishlist()}
                >
                  <AiOutlineHeart /> Favoris
                </button>
                
                <button 
                  className="action-button outline"
                  onClick={() => copyToClipboard(window.location.href)}
                >
                  🔗 Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Reviews Section - Complete */}
      <Container class1="reviews-container-modern py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="reviews-wrapper-modern">
              {/* Section: Écrire un Avis */}
              {orderProduct && (
                <div className="write-review-section-modern" id="review">
                  <h3 className="section-title-reviews">✍️ Écrire un Avis</h3>
                  <p className="section-subtitle-reviews">Partagez votre expérience avec ce produit</p>
                  
                  <div className="review-form-modern">
                    <div className="rating-input-section">
                      <label className="rating-label-modern">Votre note :</label>
                      <ReactStars
                        count={5}
                        size={36}
                        value={star}
                        onChange={(newRating) => setStar(newRating)}
                        activeColor="#FF6F00"
                        color="#E0E0E0"
                        isHalf={false}
                      />
                    </div>
                    
                    <textarea
                      className="comment-textarea-modern"
                      name="comment"
                      placeholder="Décrivez votre expérience avec ce produit (optionnel)..."
                      onChange={(e) => setComment(e.target.value)}
                      value={comment || ''}
                      rows="4"
                    />
                    
                    <button className="submit-review-btn-modern" onClick={addRatingToProduct}>
                      <span className="btn-icon">📝</span>
                      <span className="btn-text">Publier mon Avis</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Section: Liste des Avis Clients */}
              {productState?.ratings && productState.ratings.length > 0 && (
                <div className="customer-reviews-section-modern">
                  <div className="reviews-header-modern">
                    <h3 className="section-title-reviews">
                      💬 Avis des Clients
                      <span className="reviews-count-badge">{productState.ratings.length}</span>
                    </h3>
                    <div className="reviews-summary">
                      <div className="average-rating-display">
                        <span className="avg-rating-number">{Number(productState?.totalRating || 0).toFixed(1)}</span>
                        <div className="avg-rating-stars">
                          <ReactStars
                            count={5}
                            size={20}
                            value={Number(productState?.totalRating) || 0}
                            edit={false}
                            activeColor="#FF6F00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="reviews-list-modern">
                    {productState.ratings.slice().reverse().map((rating, idx) => (
                      <div key={rating.id || idx} className="review-card-modern">
                        <div className="review-card-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              <span className="avatar-icon">👤</span>
                            </div>
                            <div className="reviewer-details">
                              <span className="reviewer-name">Client vérifié</span>
                              <span className="review-date">
                                {new Date(rating.createdAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="review-rating-display">
                            <ReactStars
                              count={5}
                              size={18}
                              value={Number(rating.star) || 0}
                              edit={false}
                              activeColor="#FF6F00"
                            />
                          </div>
                        </div>
                        
                        {rating.comment && (
                          <div className="review-card-body">
                            <p className="review-comment-text">{rating.comment}</p>
                          </div>
                        )}
                        
                        <div className="review-card-footer">
                          <button className="review-helpful-btn">
                            👍 Utile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message si aucun avis */}
              {(!productState?.ratings || productState.ratings.length === 0) && (
                <div className="no-reviews-section">
                  <div className="no-reviews-icon">📝</div>
                  <h4>Aucun avis pour le moment</h4>
                  <p>Soyez le premier à partager votre expérience avec ce produit !</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Popular Products */}
      <Container class1="popular-products py-5 home-wrapper-2">
        <div className="row">
          <h3 className="popular-products-heading">Popular Products</h3>
          {popularProduct.map((prod, index) => (
            <ProductCard key={index} prod={prod} />
          ))}
        </div>
      </Container>
    </>
  );
};

export default SingleProduct;
