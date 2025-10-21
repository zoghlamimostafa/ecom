import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdShoppingCart } from "react-icons/md";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useTranslation } from '../contexts/TranslationContext';
import { getUserCart, deleteCartProduct, updateCartProduct, toggleProductWishlist } from "../features/user/userSlice";
import { getWishlist } from "../features/products/productSlice";
import Container from '../components/Container';
import Meta from '../components/Meta';
import SEOEnhancer from '../components/SEOEnhancer';

import { getProductImageUrl } from '../utils/imageHelper';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userCartState = useSelector(state => state.auth.cartProducts);
  const wishlistState = useSelector(state => state.product.wishlist);
  const authState = useSelector(state => state?.auth?.auth);
  const [quantity, setQuantity] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});
  const hasFetchedCart = useRef(false);

  useEffect(() => {
    if (!hasFetchedCart.current && authState) {
      dispatch(getUserCart());
      dispatch(getWishlist());
      hasFetchedCart.current = true;
    }
  }, [dispatch, authState]);

  useEffect(() => {
    if (userCartState && userCartState.length > 0) {
      const updatedQuantity = {};
      userCartState.forEach(item => {
        const itemId = item.id || item.id; // Support SQLite et MongoDB
        updatedQuantity[itemId] = item.quantity;
      });
      setQuantity(updatedQuantity);
    }
  }, [userCartState]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;

    setQuantity(prevState => ({
      ...prevState,
      [itemId]: newQuantity,
    }));

    dispatch(updateCartProduct({ cartItemId: itemId, quantity: newQuantity }));
  };

  const handleDeleteCartItem = (itemId) => {
    console.log("🗑️ Suppression item du cart:", itemId);
    
    dispatch(deleteCartProduct(itemId))
      .unwrap()
      .then(() => {
        toast.success(t('productRemovedFromCart') || 'Produit supprimé du panier');
        // Rafraîchir le panier après suppression
        setTimeout(() => {
          dispatch(getUserCart());
        }, 300);
      })
      .catch((error) => {
        console.error("❌ Erreur suppression cart:", error);
        toast.error("Erreur lors de la suppression du produit");
      });
  };

  const handleToggleWishlist = async (productId) => {
    if (!authState) {
      toast.error(t('pleaseLoginForWishlistManage'));
      return;
    }

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      await dispatch(toggleProductWishlist(productId)).unwrap();
      const isInWishlist = wishlistState?.some(item => item.id === productId);
      
      if (isInWishlist) {
        toast.success(t('productRemovedFromWishlist'));
      } else {
        toast.success(t('productAddedToWishlist'));
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Erreur lors de la modification de la wishlist");
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistState?.some(item => (item.id || item.id) === productId);
  };

  // Frais de livraison
  const SHIPPING_COST = 7.00; // 7 TND frais de livraison standard
  const FREE_SHIPPING_THRESHOLD = 100.00; // Livraison gratuite à partir de 100 TND

  const subtotalPrice = (userCartState && Array.isArray(userCartState)) 
    ? userCartState.reduce((acc, item) => {
        if (!item) return acc;
        const product = item.product || item.productId;
        const itemPrice = item.price || product?.price || 0;
        if (!itemPrice) return acc;
        const itemId = item.id || item.id;
        return acc + (itemPrice * (quantity[itemId] || item.quantity || 1));
      }, 0) 
    : 0;

  // Calcul des frais de livraison (gratuit si > 100 TND)
  const shippingCost = subtotalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  
  // Calcul du total avec livraison
  const totalPrice = subtotalPrice > 0 ? subtotalPrice + shippingCost : 0;

  // Vérification de sécurité pour userCartState
  const safeUserCartState = Array.isArray(userCartState) ? userCartState : [];

  return (
    <>
      <SEOEnhancer 
        title={t('cartPageTitle')}
        description={t('cartPageDescription')}
        keywords={t('cartPageKeywords')}
        pageType="cart"
      />
      <Meta title={"Panier"} />
      <div className="page-wrapper cart-page-wrapper">
        <Container class1='cart-wrapper home-wrapper-2 py-5'>
          <div className='row'>
            <div className='col-12'>
              {safeUserCartState && safeUserCartState.length > 0 ? (
                <>
                  <div className="cart-header-section">
                    <MdShoppingCart className="cart-header-icon" />
                    <h2 className="cart-main-title">Votre Panier</h2>
                    <p className="cart-subtitle">{safeUserCartState.length} {safeUserCartState.length > 1 ? 'articles' : 'article'} dans votre panier</p>
                  </div>
                  <div className="row">
                  <div className="col-lg-8">
                    <div className="cart-items-container">
                    {safeUserCartState.map((item) => {
                      // Vérifications de sécurité pour éviter les erreurs
                      if (!item) return null;
                      const product = item.product || item.productId;
                      if (!product) return null;
                      
                      // Utiliser le helper d'images pour obtenir l'URL correcte
                      const images = item.images || product.images;
                      const imageUrl = getProductImageUrl(images);
                      
                      // Vérifier si c'est l'image par défaut
                      const showImage = imageUrl && !imageUrl.includes('default-product');
                      
                      const productTitle = product.title || 'Produit sans nom';
                      const productPrice = item.price || product.price || 0;
                      const itemId = item.id || item.id;
                      const productId = product.id || product.id || item.productId;
                      return (
                        <div key={itemId} className='cart-item-modern mb-4'>
                          <div className='cart-item-content'>
                            <div className='cart-item-image-section'>
                              <div className='cart-item-image-wrapper'>
                                {showImage && (
                                  <img
                                    src={imageUrl}
                                    alt={productTitle}
                                    className="cart-item-image"
                                    onError={e => { e.target.style.display = 'none'; }}
                                  />
                                )}
                              </div>
                            </div>
                            <div className='cart-item-details'>
                              <h5 className="cart-item-title">{productTitle}</h5>
                              {item.color && (
                                <div className="cart-item-color-info">
                                  <span className="color-label">Couleur:</span>
                                  <span className="color-value">{item.color.title}</span>
                                </div>
                              )}
                              <div className="cart-item-price-mobile">
                                <span className="price-label">Prix unitaire:</span>
                                <span className="price-value">{productPrice} TND</span>
                              </div>
                            </div>
                            <div className='cart-item-price-section'>
                              <p className="cart-item-unit-price">{productPrice} TND</p>
                              <span className="price-unit-label">prix unitaire</span>
                            </div>
                            <div className='cart-item-quantity-section'>
                              <label className="quantity-label">Quantité</label>
                              <div className='cart-quantity-controls'>
                                <button className="cart-quantity-btn-modern" onClick={() => handleQuantityChange(itemId, (quantity[itemId] || item.quantity) - 1)}>-</button>
                                <input type="number" value={quantity[itemId] || item.quantity} readOnly className="cart-quantity-display" />
                                <button className="cart-quantity-btn-modern" onClick={() => handleQuantityChange(itemId, (quantity[itemId] || item.quantity) + 1)}>+</button>
                              </div>
                            </div>
                            <div className='cart-item-total-section'>
                              <p className="cart-item-total-price">{(productPrice * (quantity[itemId] || item.quantity)).toFixed(2)} TND</p>
                              <span className="total-label">total</span>
                            </div>
                            <div className='cart-item-actions'>
                              <button
                                className={`cart-action-btn cart-wishlist-btn-modern ${isInWishlist(productId) ? 'active' : ''}`}
                                onClick={() => handleToggleWishlist(productId)}
                                disabled={wishlistLoading[productId]}
                                title={isInWishlist(productId) ? t('removeFromWishlistTitle') : t('addToWishlistTitle')}
                              >
                                {wishlistLoading[productId] ? (
                                  <div className="spinner-border cart-spinner" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                ) : isInWishlist(productId) ? (
                                  <AiFillHeart />
                                ) : (
                                  <AiOutlineHeart />
                                )}
                              </button>
                              <button className="cart-action-btn cart-delete-btn-modern" onClick={() => handleDeleteCartItem(itemId)}>
                                <MdDelete />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }).filter(Boolean)}
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="cart-summary-modern">
                      <div className="cart-summary-header">
                        <h4 className="cart-summary-title">Récapitulatif de la commande</h4>
                      </div>
                      
                      <div className="cart-summary-body">
                        <div className="summary-line">
                          <span className="summary-label">Sous-total ({safeUserCartState.length} articles)</span>
                          <span className="summary-value">{subtotalPrice.toFixed(2)} TND</span>
                        </div>
                        
                        <div className="summary-line">
                          <span className="summary-label">Livraison standard</span>
                          {shippingCost === 0 ? (
                            <span className="summary-value shipping-free">
                              <span className="free-badge">GRATUIT</span>
                              <span className="original-price">{SHIPPING_COST.toFixed(2)} TND</span>
                            </span>
                          ) : (
                            <span className="summary-value shipping-value">{shippingCost.toFixed(2)} TND</span>
                          )}
                        </div>
                        
                        {shippingCost > 0 && (
                          <div className="summary-line summary-shipping-progress">
                            <div className="shipping-progress-info">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shipping-icon">
                                <rect x="1" y="3" width="15" height="13"></rect>
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                              </svg>
                              <span className="shipping-progress-text">
                                Plus que <strong>{(FREE_SHIPPING_THRESHOLD - subtotalPrice).toFixed(2)} TND</strong> pour la livraison gratuite
                              </span>
                            </div>
                            <div className="shipping-progress-bar">
                              <div 
                                className="shipping-progress-fill" 
                                style={{ width: `${Math.min((subtotalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {shippingCost === 0 && (
                          <div className="summary-line summary-free-shipping-info">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shipping-icon">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span className="free-shipping-text">Vous bénéficiez de la livraison gratuite !</span>
                          </div>
                        )}
                        
                        <div className="summary-divider"></div>
                        
                        <div className="summary-line summary-total">
                          <span className="summary-total-label">Total TTC</span>
                          <span className="summary-total-value">{totalPrice.toFixed(2)} TND</span>
                        </div>
                      </div>
                      
                      <div className="cart-summary-actions">
                        <Link to="/checkout" className='btn-checkout-modern'>
                          <span>Valider la commande</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </Link>
                        <Link to="/product" className="btn-continue-shopping">Continuer les achats</Link>
                      </div>
                      
                      <div className="cart-payment-badges">
                        <img src="/images/payment-secure.svg" alt="Paiement sécurisé" className="payment-badge" onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    </div>
                  </div>
                </div>
                </>
              ) : (
                <div className='empty-cart-section'>
                  <div className="empty-cart-content">
                    <div className="empty-cart-icon-wrapper">
                      <MdShoppingCart className='empty-cart-icon-modern' />
                      <div className="empty-cart-circle"></div>
                    </div>
                    <h3 className='empty-cart-title'>Votre panier est vide</h3>
                    <p className='empty-cart-message'>Découvrez nos produits et ajoutez vos articles préférés à votre panier pour commencer vos achats.</p>
                    <Link to="/product" className='btn-start-shopping'>
                      <span>Découvrir nos produits</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Cart;
