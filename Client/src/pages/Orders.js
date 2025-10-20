import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../features/user/ordersSlice';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const PageMesCommandes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const ordersState = useSelector((state) => state.orders);
  
  const orders = ordersState?.orders || [];
  const isLoading = ordersState?.loading || false;
  const isError = ordersState?.error ? true : false;
  const message = ordersState?.error || '';

  useEffect(() => {
    if (!user || !user.token) {
      console.log('❌ Utilisateur non connecté, redirection vers login');
      navigate('/login');
      return;
    }

    console.log('✅ Récupération des commandes pour l\'utilisateur:', user.id);
    dispatch(fetchOrders());
  }, [dispatch, user, navigate]);

  if (!user || !user.token) {
    return (
      <div className="orders-container">
        <div className="orders-card">
          <div className="alert alert-warning">
            <h4>🔒 Authentification requise</h4>
            <p>Vous devez être connecté pour voir vos commandes.</p>
            <button onClick={() => navigate('/login')} className="btn-primary">
              Se connecter
            </button>
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
            orders.map((commande) => (
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
                  </div>
                </div>
              </div>
            ))
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
