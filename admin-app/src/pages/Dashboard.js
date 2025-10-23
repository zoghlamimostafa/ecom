import React, { useState, useEffect, useCallback } from "react";
import { Table } from "antd";
import { BsBoxSeam, BsCart3, BsCurrencyDollar } from "react-icons/bs";
import { AiOutlineShoppingCart, AiOutlineReload } from "react-icons/ai";
import { FiTrendingUp, FiTrendingDown, FiShoppingBag } from "react-icons/fi";
import axios from "axios";
import { getConfig } from "../utils/axiosConfig";
import { base_url } from "../utils/baseUrl";
import "./Dashboard.css";

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔄 Dashboard: Chargement des données...');
    console.log('📍 Base URL:', base_url);
    console.log('📍 Full Product URL:', `${base_url}product/`);
    
    try {
      // Récupérer les produits
      console.log('📦 Récupération des produits...');
      const productResponse = await axios.get(`${base_url}product/`);
      const productData = productResponse.data;
      console.log('📦 Réponse produits:', productData);
      
      // Le backend retourne { success: true, products: [...] }
      let productCount = 0;
      if (productData && Array.isArray(productData.products)) {
        productCount = productData.products.length;
        console.log('✅ Produits trouvés:', productCount);
      } else if (Array.isArray(productData)) {
        productCount = productData.length;
        console.log('✅ Produits trouvés (array direct):', productCount);
      } else {
        console.warn('⚠️ Format produits inattendu:', typeof productData);
      }
      
      setTotalProducts(productCount);
      console.log('✅ setTotalProducts appelé avec:', productCount);

      // Récupérer les commandes
      console.log('🛒 Récupération des commandes...');
      console.log('🔑 Token disponible:', !!getConfig().headers.Authorization);
      
      // Force un petit délai pour s'assurer que le state est mis à jour
      await new Promise(resolve => setTimeout(resolve, 50));
      
      let orderData = [];
      
      try {
        const orderResponse = await axios.get(`${base_url}user/getallorders`, getConfig());
        console.log('🛒 Réponse commandes:', orderResponse.data);
        
        // Le backend retourne { success: true, count: X, orders: [...] }
        if (orderResponse.data && Array.isArray(orderResponse.data.orders)) {
          orderData = orderResponse.data.orders;
          console.log('✅ Commandes trouvées (format orders):', orderData.length);
        } else if (orderResponse.data && Array.isArray(orderResponse.data.data)) {
          // Fallback pour ancien format
          orderData = orderResponse.data.data;
          console.log('✅ Commandes trouvées (format data):', orderData.length);
        } else if (Array.isArray(orderResponse.data)) {
          orderData = orderResponse.data;
          console.log('✅ Commandes trouvées (array direct):', orderData.length);
        } else {
          console.warn('⚠️ Format commandes inattendu:', orderResponse.data);
          orderData = [];
        }
      } catch (orderError) {
        console.error('❌ Erreur récupération commandes:', orderError);
        console.error('❌ Status:', orderError.response?.status);
        console.error('❌ Message:', orderError.response?.data?.message);
        console.error('❌ Response data:', orderError.response?.data);
        
        // Si erreur 401, c'est un problème d'authentification
        if (orderError.response?.status === 401) {
          console.error('🔴 ERREUR 401: TOKEN EXPIRÉ OU INVALIDE');
          console.error('🔴 Vous devez vous DÉCONNECTER et RECONNECTER');
          console.error('🔴 localStorage.user:', localStorage.getItem('user'));
          
          // Afficher un message d'erreur visible
          setError('SESSION_EXPIRED');
        }
        
        // On ne lance pas d'erreur, on continue avec orderData = []
        orderData = [];
      }
      
      setOrders(orderData);
      setTotalOrders(orderData.length);
      console.log('✅ setTotalOrders appelé avec:', orderData.length);
      
      // Calculer le revenu total
      const revenue = orderData.reduce((sum, order) => {
        const price = parseFloat(order.totalPrice) || parseFloat(order.totalPriceAfterDiscount) || 0;
        console.log(`💰 Commande ${order._id || order.id}: ${price} TND`);
        return sum + price;
      }, 0);
      
      console.log('💰 Revenu total calculé:', revenue, 'TND');
      setTotalRevenue(revenue);
      console.log('✅ setTotalRevenue appelé avec:', revenue);
      
      // Force le re-render
      console.log('🔄 Forcer le re-render...');

      console.log('✅ Dashboard: Données chargées avec succès');
      console.log(`📊 Résumé: ${productCount} produits, ${orderData.length} commandes, ${revenue} TND`);
      setError(null);
    } catch (error) {
      // Provide more specific error messages
      console.error('❌ Erreur Dashboard:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        console.error('🔒 Erreur 401: Authentification requise');
      } else if (error.response?.status === 404) {
        setError("Service non disponible. Vérifiez que le backend fonctionne.");
        console.error('🔍 Erreur 404: Endpoint non trouvé');
      } else if (error.code === 'ECONNREFUSED') {
        setError("Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 4000.");
        console.error('🚫 Erreur ECONNREFUSED: Backend non accessible');
      } else {
        setError(`Erreur de chargement: ${error.message || 'Erreur inconnue'}`);
        console.error('⚠️ Erreur générique:', error.message);
      }
    } finally {
      setLoading(false);
      console.log('✅ Dashboard: Chargement terminé');
    }
  }, []);

  useEffect(() => {
    console.log('🎯 useEffect Dashboard: DÉMARRAGE');
    console.log('🎯 base_url:', base_url);
    console.log('🎯 window.location.hostname:', window.location.hostname);
    
    // Force initial load
    const timer = setTimeout(() => {
      console.log('⏰ Force fetch après 100ms');
      fetchAllData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fetchAllData]);

  const orderColumns = [
    {
      title: "Numéro de commande",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Client",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Produits totaux",
      dataIndex: "totalProducts",
      key: "totalProducts",
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
    },
  ];

  // Formater les données des commandes pour l'affichage
  const data1 = orders.map((order, index) => {
    return {
      key: order.id || `order-${index}`,
      orderId: order.id || `#${index + 1}`,
      customer: order.shippingInfo?.name || 
                order.user?.firstname || 
                order.orderby?.firstname || 
                "Client inconnu",
      totalProducts: order.orderItems ? order.orderItems.length : 
                     (order.products ? order.products.length : 0),
      status: order.orderStatus || 
              order.paymentIntent?.status || 
              "En traitement",
    };
  });

  // État de chargement
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Chargement du tableau de bord...</p>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="dashboard-container">
        <h3 className="mb-4 title">Tableau de bord</h3>
        <div className="dashboard-error">
          <span className="error-icon">⚠️</span>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={fetchAllData}>
            <AiOutlineReload /> Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Log final avant le render
  console.log('🎨 RENDER Dashboard:');
  console.log('  - totalProducts:', totalProducts);
  console.log('  - totalOrders:', totalOrders);
  console.log('  - totalRevenue:', totalRevenue);
  console.log('  - orders.length:', orders.length);
  
  // Vérifier si les commandes n'ont pas pu être chargées
  const hasCommands = totalOrders > 0 || orders.length > 0;
  const hasProducts = totalProducts > 0;

  return (
    <div className="dashboard-container">
      <h3 className="mb-4 title">Tableau de bord</h3>
      
      {/* ALERTE ROUGE: Token expiré - SESSION_EXPIRED */}
      {error === 'SESSION_EXPIRED' && (
        <div style={{
          padding: '16px',
          background: '#f8d7da',
          border: '2px solid #dc3545',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '32px', marginBottom: '8px'}}>🔴</div>
          <strong style={{fontSize: '16px', color: '#721c24'}}>SESSION EXPIRÉE</strong>
          <p style={{margin: '8px 0', color: '#721c24'}}>
            Votre token d'authentification a expiré.
          </p>
          <p style={{margin: '0', fontSize: '13px', color: '#721c24'}}>
            <strong>Action requise:</strong> Déconnectez-vous et reconnectez-vous pour voir les commandes.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{
              marginTop: '12px',
              padding: '8px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Se reconnecter
          </button>
        </div>
      )}
      
      {/* Message si produits OK mais commandes = 0 */}
      {hasProducts && !hasCommands && error !== 'SESSION_EXPIRED' && (
        <div style={{
          padding: '12px',
          background: '#d1ecf1',
          border: '1px solid #17a2b8',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '13px'
        }}>
          ℹ️ <strong>Produits chargés ({totalProducts})</strong> mais commandes non disponibles.
          <br/>
          <small>Vérifiez F12 Console pour voir si erreur 401 (session expirée). Reconnectez-vous si nécessaire.</small>
        </div>
      )}
      
      {/* Debug info - visible seulement si tout est à 0 */}
      {totalProducts === 0 && totalOrders === 0 && error !== 'SESSION_EXPIRED' && (
        <div style={{
          padding: '12px',
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '13px'
        }}>
          ⚠️ <strong>Aucune donnée chargée.</strong> Ouvrez F12 Console pour voir les logs de debug.
          {error && <div style={{marginTop: '8px', color: 'red'}}>Erreur: {error}</div>}
        </div>
      )}
      
      {/* Cartes statistiques modernes */}
      <div className="dashboard-stats">
        <div className="stat-card-modern stat-card-blue">
          <div className="stat-card-header">
            <div className="stat-icon-container stat-icon-blue">
              <BsBoxSeam className="stat-icon" />
            </div>
            <span className="stat-trend trend-up">
              <FiTrendingUp /> +12%
            </span>
          </div>
          <div className="stat-card-body">
            <p className="stat-label-modern">Produits totaux</p>
            <h2 className="stat-value-modern" style={{display: 'block', fontSize: '24px', fontWeight: '700', color: '#2d3748'}}>
              {totalProducts || 0}
            </h2>
            <p className="stat-subtitle">
              <FiShoppingBag /> En stock
            </p>
          </div>
        </div>
        
        <div className="stat-card-modern stat-card-green">
          <div className="stat-card-header">
            <div className="stat-icon-container stat-icon-green">
              <BsCart3 className="stat-icon" />
            </div>
            <span className="stat-trend trend-up">
              <FiTrendingUp /> +8%
            </span>
          </div>
          <div className="stat-card-body">
            <p className="stat-label-modern">Total commandes</p>
            <h2 className="stat-value-modern" style={{display: 'block', fontSize: '24px', fontWeight: '700', color: '#2d3748'}}>
              {totalOrders || 0}
            </h2>
            <p className="stat-subtitle">
              🎯 Ce mois
            </p>
          </div>
        </div>
        
        <div className="stat-card-modern stat-card-purple">
          <div className="stat-card-header">
            <div className="stat-icon-container stat-icon-purple">
              <BsCurrencyDollar className="stat-icon" />
            </div>
            <span className="stat-trend trend-up">
              <FiTrendingUp /> +24%
            </span>
          </div>
          <div className="stat-card-body">
            <p className="stat-label-modern">Revenus</p>
            <h2 className="stat-value-modern" style={{display: 'block', fontSize: '24px', fontWeight: '700', color: '#2d3748'}}>
              {totalRevenue ? totalRevenue.toFixed(2) : '0.00'} TND
            </h2>
            <p className="stat-subtitle">
              💰 Total des ventes
            </p>
          </div>
        </div>
        
        <div className="stat-card-modern stat-card-orange">
          <div className="stat-card-header">
            <div className="stat-icon-container stat-icon-orange">
              <AiOutlineShoppingCart className="stat-icon" />
            </div>
            <span className="stat-trend trend-down">
              <FiTrendingDown /> -3%
            </span>
          </div>
          <div className="stat-card-body">
            <p className="stat-label-modern">En attente</p>
            <h2 className="stat-value-modern" style={{display: 'block', fontSize: '24px', fontWeight: '700', color: '#2d3748'}}>
              {orders.filter(o => o.orderStatus === 'En attente' || o.orderStatus === 'Processing').length || 0}
            </h2>
            <p className="stat-subtitle">
              ⏳ À traiter
            </p>
          </div>
        </div>
      </div>

      {/* Section des dernières commandes */}
      <div className="recent-orders-section">
        <div className="section-header">
          <h3 className="section-title">
            <div className="section-icon">
              <AiOutlineShoppingCart />
            </div>
            Dernières commandes
          </h3>
          <button className="view-all-btn" onClick={() => window.location.href = '/admin/orders'}>
            Voir tout →
          </button>
        </div>
        
        {data1.length === 0 ? (
          <div className="text-center p-5">
            <div className="fs-1 text-muted mb-3">
              <BsCart3 />
            </div>
            <h5 className="text-muted">Aucune commande pour le moment</h5>
            <p className="text-muted small">
              Les commandes apparaîtront ici lorsque les clients effectueront des achats.
            </p>
          </div>
        ) : (
          <div className="dashboard-table">
            <Table 
              columns={orderColumns} 
              dataSource={data1} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
