import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../features/user/ordersSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProductImageUrl } from '../utils/imageHelper';
import { toast } from 'react-toastify';
import './Orders.css';

const PageMesCommandes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedOrders, setExpandedOrders] = useState({});

  const { user } = useSelector((state) => state.auth);
  const ordersState = useSelector((state) => state.orders);
  
  const orders = ordersState?.orders || [];
  const isLoading = ordersState?.loading || false;
  const isError = ordersState?.error ? true : false;
  const message = ordersState?.error || '';

  // Vérifier l'authentification au montage et à chaque changement
  useEffect(() => {
    console.log('🔍 Orders - Vérification auth:', { 
      hasUser: !!user, 
      hasToken: !!user?.token,
      ordersCount: orders.length 
    });
    
    // Vérifier le token de différentes sources
    let validToken = null;
    
    // 1. Vérifier dans l'état Redux
    if (user?.token && user.token.length > 10) {
      validToken = user.token;
      console.log('✅ Token trouvé dans Redux');
    }
    
    // 2. Vérifier dans sessionStorage
    if (!validToken) {
      try {
        const customerData = sessionStorage.getItem("customer");
        if (customerData) {
          const parsedData = JSON.parse(customerData);
          if (parsedData?.token && parsedData.token.length > 10) {
            validToken = parsedData.token;
            console.log('✅ Token trouvé dans sessionStorage');
          }
        }
      } catch (e) {
        console.log('⚠️ Erreur parsing sessionStorage:', e);
      }
    }
    
    // 3. Vérifier dans localStorage
    if (!validToken) {
      try {
        const customerData = localStorage.getItem("customer");
        if (customerData) {
          const parsedData = JSON.parse(customerData);
          if (parsedData?.token && parsedData.token.length > 10) {
            validToken = parsedData.token;
            console.log('✅ Token trouvé dans localStorage');
          }
        }
      } catch (e) {
        console.log('⚠️ Erreur parsing localStorage:', e);
      }
    }
    
    // Si aucun token valide trouvé, rediriger vers login
    if (!validToken) {
      console.log('❌ Aucun token valide trouvé, redirection vers login');
      toast.error('⚠️ Veuillez vous reconnecter pour voir vos commandes', {
        position: 'top-center'
      });
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname }
      });
      return;
    }

    console.log('✅ Utilisateur authentifié, récupération des commandes');
    dispatch(fetchOrders());
    
    // Afficher un message de bienvenue si on vient de créer une commande
    if (location.state?.orderCreated) {
      toast.success('✅ Votre commande a été enregistrée avec succès !', {
        position: 'top-center',
        autoClose: 4000
      });
      
      // Nettoyer le state pour éviter de réafficher le message
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user, navigate, location.state]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Vérification simplifiée - Le useEffect gère déjà la redirection
  // Cette vérification est juste pour éviter les erreurs de rendu
  const hasValidAuth = () => {
    if (user?.token) return true;
    
    try {
      const sessionData = sessionStorage.getItem("customer");
      const localData = localStorage.getItem("customer");
      
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed?.token) return true;
      }
      
      if (localData) {
        const parsed = JSON.parse(localData);
        if (parsed?.token) return true;
      }
    } catch (e) {
      console.log('Erreur vérification auth:', e);
    }
    
    return false;
  };

  if (!hasValidAuth()) {
    return (
      <div className="orders-container">
        <div className="orders-card">
          <div className="alert alert-warning">
            <h4>🔒 Authentification requise</h4>
            <p>Redirection vers la page de connexion...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">📦 Mes Commandes</h1>
        <p className="orders-subtitle">Suivez l'état de vos commandes</p>
      </div>

      {isLoading ? (
        <div className="orders-loading">
          <div className="spinner"></div>
          <span>Chargement de vos commandes...</span>
        </div>
      ) : isError ? (
        <div className="orders-card">
          <div className="alert alert-danger">
            <h4>❌ Erreur</h4>
            <p>{message || 'Une erreur est survenue lors du chargement des commandes'}</p>
            <small>
              {message && message.includes('401') ? 
                'Problème d\'authentification. Veuillez vous reconnecter.' : 
                'Erreur de communication avec le serveur.'}
            </small>
            <div className="alert-actions">
              <button onClick={() => dispatch(fetchOrders())} className="btn-outline">
                🔄 Réessayer
              </button>
              <button onClick={() => navigate('/login')} className="btn-primary">
                Se reconnecter
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="orders-list">
          {Array.isArray(orders) && orders.length === 0 ? (
            <div className="orders-empty">
              <div className="empty-icon">📭</div>
              <h3>Aucune commande</h3>
              <p>Vous n'avez pas encore passé de commande.</p>
              <button onClick={() => navigate('/product')} className="btn-primary">
                Découvrir nos produits
              </button>
            </div>
          ) : Array.isArray(orders) ? (
            orders.map((commande) => {
              const isExpanded = expandedOrders[commande.id];
              const itemsCount = commande.orderItems?.length || 0;
              
              return (
                <div key={commande.id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">
                      <span className="order-label">Commande</span>
                      <span className="order-number">#{commande.id}</span>
                    </div>
                    <div className="order-date">
                      <span className="date-icon">📅</span>
                      <span>{new Date(commande.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                  
                  <div className="order-body">
                    <div className="order-info">
                      <div className="info-item">
                        <span className="info-label">Montant total</span>
                        <span className="info-value price">{commande.totalPrice} TND</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Statut</span>
                        <span className={`order-status status-${commande.orderStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                          {commande.orderStatus === 'Cash on Delivery' && '💵 '}
                          {commande.orderStatus === 'Processing' && '⏳ '}
                          {commande.orderStatus === 'Dispatched' && '🚚 '}
                          {commande.orderStatus === 'Delivered' && '✅ '}
                          {commande.orderStatus === 'Cancelled' && '❌ '}
                          {commande.orderStatus}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Articles</span>
                        <span className="info-value">{itemsCount} {itemsCount > 1 ? 'produits' : 'produit'}</span>
                      </div>
                    </div>

                    {/* Bouton pour afficher/masquer les détails */}
                    <button 
                      className="toggle-details-btn"
                      onClick={() => toggleOrderDetails(commande.id)}
                    >
                      {isExpanded ? '▲ Masquer les détails' : '▼ Voir les détails'}
                    </button>

                    {/* Détails de la commande */}
                    {isExpanded && (
                      <div className="order-details">
                        <h4 className="details-title">📦 Produits commandés</h4>
                        
                        <div className="order-items">
                          {commande.orderItems && commande.orderItems.length > 0 ? (
                            commande.orderItems.map((item, index) => (
                              <div key={index} className="order-item">
                                <div className="item-image">
                                  {item.product?.images && item.product.images.length > 0 ? (
                                    <img 
                                      src={getProductImageUrl(item.product.images[0])} 
                                      alt={item.product.title}
                                      onError={(e) => {
                                        e.target.src = '/images/placeholder.png';
                                      }}
                                    />
                                  ) : (
                                    <div className="no-image">📦</div>
                                  )}
                                </div>
                                
                                <div className="item-details">
                                  <h5 className="item-title">{item.product?.title || 'Produit indisponible'}</h5>
                                  
                                  <div className="item-info-grid">
                                    <div className="item-info-row">
                                      <span className="item-label">Prix unitaire:</span>
                                      <span className="item-value">{item.price} TND</span>
                                    </div>
                                    
                                    <div className="item-info-row">
                                      <span className="item-label">Quantité:</span>
                                      <span className="item-value">×{item.quantity}</span>
                                    </div>
                                    
                                    {item.color && (
                                      <div className="item-info-row">
                                        <span className="item-label">Couleur:</span>
                                        <span className="item-value color-badge">{item.color}</span>
                                      </div>
                                    )}
                                    
                                    <div className="item-info-row">
                                      <span className="item-label">Sous-total:</span>
                                      <span className="item-value total">{(item.price * item.quantity).toFixed(2)} TND</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="no-items">Aucun produit dans cette commande</p>
                          )}
                        </div>

                        {/* Informations de livraison */}
                        {commande.shippingInfo && (
                          <div className="shipping-info">
                            <h4 className="details-title">🚚 Informations de livraison</h4>
                            <div className="shipping-details">
                              <p><strong>Nom:</strong> {commande.shippingInfo.firstName} {commande.shippingInfo.lastName}</p>
                              {commande.shippingInfo.phone && <p><strong>Téléphone:</strong> {commande.shippingInfo.phone}</p>}
                              <p><strong>Adresse:</strong> {commande.shippingInfo.address}</p>
                              <p><strong>Ville:</strong> {commande.shippingInfo.city}</p>
                              {commande.shippingInfo.state && <p><strong>Région:</strong> {commande.shippingInfo.state}</p>}
                              {commande.shippingInfo.pincode && <p><strong>Code postal:</strong> {commande.shippingInfo.pincode}</p>}
                              {commande.shippingInfo.country && <p><strong>Pays:</strong> {commande.shippingInfo.country}</p>}
                            </div>
                          </div>
                        )}

                        {/* Résumé de la commande */}
                        <div className="order-summary">
                          <h4 className="details-title">💰 Récapitulatif</h4>
                          <div className="summary-row">
                            <span>Sous-total:</span>
                            <span>{commande.totalPrice} TND</span>
                          </div>
                          {commande.couponApplied && (
                            <div className="summary-row coupon-applied-row">
                              <span>🎫 Code promo ({commande.couponApplied}):</span>
                              <span className="coupon-discount-text">-{commande.couponDiscount}%</span>
                            </div>
                          )}
                          {commande.totalPriceAfterDiscount && commande.totalPriceAfterDiscount < commande.totalPrice && (
                            <>
                              <div className="summary-row discount">
                                <span>Réduction totale:</span>
                                <span>-{(commande.totalPrice - commande.totalPriceAfterDiscount).toFixed(2)} TND</span>
                              </div>
                              <div className="summary-row total">
                                <span>Total après réduction:</span>
                                <span>{commande.totalPriceAfterDiscount} TND</span>
                              </div>
                            </>
                          )}
                          <div className="summary-row total">
                            <span><strong>Total payé:</strong></span>
                            <span><strong>{commande.totalPriceAfterDiscount || commande.totalPrice} TND</strong></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="orders-card">
              <p className="text-center">Format de données inattendu. Veuillez rafraîchir la page.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageMesCommandes;
