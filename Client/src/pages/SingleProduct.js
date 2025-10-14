import React, { useEffect, useState } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import ProductCard from '../components/ProductCard';
import ReactStars from "react-rating-stars-component";
import ReactImageZoom from 'react-image-zoom';
import Color from '../components/Color';
import { TbGitCompare } from "react-icons/tb";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import Container from '../components/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRating, getAProduct, getAllProducts } from '../features/products/productSlice';
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

  const location = useLocation();
  const navigate = useNavigate();
  const getProductSlug = location.pathname.split("/")[2]; // This now gets the slug instead of ID
  const dispatch = useDispatch();

  const productState = useSelector(state => state?.product?.singleproduct);
  const cartState = useSelector(state => state?.auth?.cartProducts);
  const productState1 = useSelector(state => state?.product?.product);
  const authState = useSelector(state => state?.auth?.user); // Corrected path

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
    if (productState?.images) {
      const imageUrl = getProductImageUrl(productState.images);
      setSelectedImage(imageUrl);
    }
  }, [productState]);

  const addRatingToProduct = () => {
    if (star === null) {
      toast.error("Please add star rating ");
      return false;
    } else if (comment === null) {
      toast.error("Please Write Review About the Product");
      return false;
    } else {
      dispatch(addRating({ star, comment, prodId: productState?.id }));
      setTimeout(() => {
        dispatch(getAProduct(getProductSlug)); // Récupérer à nouveau le produit après avoir ajouté un avis
      }, 100);
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
    width: undefined,
    height: undefined,
    zoomWidth: 300,
    img: selectedImage || productState?.images?.[0]?.url || "images/watch.jpg"
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
      <Meta title={productState?.title || "Product"} />
      <BrandCrumb title={productState?.title || "Product"} />
      <Container class1="product-main-wrapper home-wrapper-2">
        <div className="modern-single-product-layout">
          {/* Section Image - Responsive */}
          <div className="product-image-gallery">
            <div className="main-image-container">
              <ReactImageZoom
                {...props}
                zoomScale={2}
                shouldReplaceImage={true}
                width={undefined}
                height={undefined}
                zoomLensStyle={{ backgroundColor: 'rgba(255,111,0,0.6)' }}
                className="product-main-image"
              />
            </div>

            {/* Thumbnails responsive */}
            <div className="product-thumbnails">
              {productState?.images?.map((item, index) => (
                <img
                  key={index}
                  src={item?.url}
                  className={`thumbnail-image ${selectedImage === item?.url ? 'active' : ''}`}
                  alt={`${productState?.title} ${index + 1}`}
                  onClick={() => setSelectedImage(item?.url)}
                />
              ))}
            </div>
          </div>

          {/* Section Détails - Responsive */}
          <div className="product-details-panel">
            <div className="product-header-section">
              <div className="product-breadcrumb">
                <span className="product-brand-tag">{productState?.brand}</span>
                {productState?.Category && <span className="product-category-tag">{productState?.Category}</span>}
              </div>
              
              <h1 className="modern-product-title">{productState?.title}</h1>
              
              {/* Rating responsive */}
              <div className="product-rating-display">
                <div className="rating-stars-container">
                  <ReactStars
                    count={5}
                    size={window.innerWidth < 768 ? 20 : 24}
                    value={productState?.totalratings || 0}
                    edit={false}
                    activeColor="#FF6F00"
                  />
                  <span className="rating-count">({productState?.totalratings || 0} avis)</span>
                </div>
                <a href="#review" className="write-review-link">Écrire un avis</a>
              </div>

              <div className="price-display">
                <span className="current-price">{productState?.price} TND</span>
              </div>
            </div>

            {/* Description responsive */}
            <div className="product-description-section">
              <h3>Description</h3>
              <p className="product-description-text">{productState?.description}</p>
            </div>

            {/* Informations produit */}
            <div className="product-specifications">
              <div className="spec-item">
                <span className="spec-label">Marque :</span>
                <span className="spec-value">{productState?.brand}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Catégorie :</span>
                <span className="spec-value">{productState?.Category}</span>
              </div>
            </div>

            {/* Sélecteur de couleur responsive */}
            {!alreadyAdded && (
              <div className="color-selection-section">
                <h4>Couleur disponible :</h4>
                <div className="color-options-container">
                  <Color setColor={setColor} colorData={productState?.color} />
                </div>
              </div>
            )}

            {/* Actions produit responsives */}
            <div className="product-action-panel">
              {!alreadyAdded && (
                <div className="quantity-selection">
                  <label htmlFor="quantity" className="quantity-label">Quantité :</label>
                  <div className="quantity-input-wrapper">
                    <button 
                      type="button" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      value={quantity}
                      type="number"
                      className="quantity-input"
                      min={1}
                      max={10}
                    />
                    <button 
                      type="button" 
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="quantity-btn"
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
                >
                  <AiOutlineShoppingCart />
                  {alreadyAdded ? t('viewCart') : t('addToCart')}
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

      {/* Product Description */}
      <Container class1="description-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="description-heading">Description</h3>
            {productState?.description}
          </div>
        </div>
      </Container>

      {/* Write Review Section */}
      {orderProduct && (
        <Container class1="reviews py-5 home-wrapper-2" id="review">
          <div className="row">
            <div className="col-12">
              <h3 className="review-heading">Write a Review</h3>
              <div className="d-flex align-items-center gap-10 mb-4">
                <ReactStars
                  count={5}
                  size={24}
                  value={star}
                  onChange={(newRating) => setStar(newRating)}
                  activeColor="#ffd700"
                />
              </div>
              <textarea
                className="form-control"
                name="comment"
                placeholder="Write Your Review"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                rows="4"
              />
              <div className="d-flex justify-content-end mt-3">
                <button className="button review-btn" onClick={addRatingToProduct}>
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </Container>
      )}

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
