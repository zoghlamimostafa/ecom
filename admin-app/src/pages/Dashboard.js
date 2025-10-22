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
    try {
      const productResponse = await axios.get(`${base_url}product/`);
      const productData = productResponse.data;
      
      // Le backend retourne { success: true, products: [...] }
      let productCount = 0;
      if (productData && Array.isArray(productData.products)) {
        productCount = productData.products.length;
      } else if (Array.isArray(productData)) {
        productCount = productData.length;
      }
      
      setTotalProducts(productCount);

      const orderResponse = await axios.get(`${base_url}user/getallorders`, getConfig());
      let orderData = [];
      
      // Le backend retourne { success: true, count: X, orders: [...] }
      if (orderResponse.data && Array.isArray(orderResponse.data.orders)) {
        orderData = orderResponse.data.orders;
      } else if (orderResponse.data && Array.isArray(orderResponse.data.data)) {
        // Fallback pour ancien format
        orderData = orderResponse.data.data;
      } else if (Array.isArray(orderResponse.data)) {
        orderData = orderResponse.data;
      } else {
        orderData = [];
      }
      
      setOrders(orderData);
      setTotalOrders(orderData.length);
      
      // Calculer le revenu total
      const revenue = orderData.reduce((sum, order) => {
        return sum + (parseFloat(order.totalPrice) || 0);
      }, 0);
      setTotalRevenue(revenue);

      setError(null);
    } catch (error) {
      // Provide more specific error messages
      if (error.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.response?.status === 404) {
        setError("Service non disponible. Vérifiez que le backend fonctionne.");
      } else if (error.code === 'ECONNREFUSED') {
        setError("Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 4000.");
      } else {
        setError(`Erreur de chargement: ${error.message || 'Erreur inconnue'}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
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

  return (
    <div className="dashboard-container">
      <h3 className="mb-4 title">Tableau de bord</h3>
      
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
            <h2 className="stat-value-modern">{totalProducts}</h2>
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
            <h2 className="stat-value-modern">{totalOrders}</h2>
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
            <h2 className="stat-value-modern">{totalRevenue.toFixed(2)} TND</h2>
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
            <h2 className="stat-value-modern">
              {orders.filter(o => o.orderStatus === 'En attente' || o.orderStatus === 'Processing').length}
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
