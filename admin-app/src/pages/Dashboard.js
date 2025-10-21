import React, { useState, useEffect, useCallback } from "react";
import { Table } from "antd";
import { BsBoxSeam, BsCart3, BsCurrencyDollar } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import axios from "axios";
import { getConfig } from "../utils/axiosConfig";
import { base_url } from "../utils/baseUrl";

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
      console.log('📊 Dashboard - Début chargement des données');
      
      const productResponse = await axios.get(`${base_url}product/`);
      const productData = productResponse.data;
      console.log('📦 Dashboard - Produits reçus:', productData);
      
      // Le backend retourne { success: true, products: [...] }
      let productCount = 0;
      if (productData && Array.isArray(productData.products)) {
        productCount = productData.products.length;
      } else if (Array.isArray(productData)) {
        productCount = productData.length;
      }
      
      setTotalProducts(productCount);
      console.log('✅ Dashboard - Produits chargés:', productCount);

      const orderResponse = await axios.get(`${base_url}user/getallorders`, getConfig());
      let orderData = [];
      
      console.log('📊 Dashboard - Réponse getAllOrders:', orderResponse.data);
      
      // Le backend retourne { success: true, count: X, orders: [...] }
      if (orderResponse.data && Array.isArray(orderResponse.data.orders)) {
        orderData = orderResponse.data.orders;
        console.log('✅ Dashboard - Commandes chargées:', orderData.length);
      } else if (orderResponse.data && Array.isArray(orderResponse.data.data)) {
        // Fallback pour ancien format
        orderData = orderResponse.data.data;
      } else if (Array.isArray(orderResponse.data)) {
        orderData = orderResponse.data;
      } else {
        console.warn('⚠️ Dashboard - Structure de données inattendue:', orderResponse.data);
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
      console.error("❌ Dashboard - Erreur de chargement:", error);
      console.error("❌ Dashboard - Détails erreur:", error.response?.data || error.message);
      
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

  // Format orders data with proper keys
  const formattedOrders = orders.map((order, index) => {
    console.log('📦 Dashboard - Formatage commande:', order);
    
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

  return (
    <div>
      <h3 className="mb-4 title">Tableau de bord</h3>
      
      {/* Cartes statistiques avec design moderne */}
      <style>{`
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.06);
          height: 100%;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        .stat-card-blue {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .stat-card-green {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }
        .stat-card-orange {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }
        .stat-card-red {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
        }
        .stat-label {
          font-size: 13px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          opacity: 0.9;
        }
        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }
      `}</style>
      
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="stat-card stat-card-blue">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <p className="stat-label">Produits totaux</p>
                <h2 className="stat-value">{loading ? '...' : totalProducts}</h2>
              </div>
              <div className="stat-icon">
                <BsBoxSeam />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-6 col-lg-3">
          <div className="stat-card stat-card-green">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <p className="stat-label">Total commandes</p>
                <h2 className="stat-value">{totalOrders}</h2>
              </div>
              <div className="stat-icon">
                <AiOutlineShoppingCart />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-6 col-lg-3">
          <div className="stat-card stat-card-orange">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <p className="stat-label">Revenu total</p>
                <h2 className="stat-value">{totalRevenue.toFixed(2)}</h2>
                <p className="mb-0" style={{ fontSize: '14px', opacity: 0.9 }}>TND</p>
              </div>
              <div className="stat-icon">
                <BsCurrencyDollar />
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-6 col-lg-3">
          <div className="stat-card stat-card-red">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <p className="stat-label">En attente</p>
                <h2 className="stat-value">
                  {orders.filter(o => o.orderStatus === 'Not Processed').length}
                </h2>
              </div>
              <div className="stat-icon">
                <BsCart3 />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-4 title">Dernières commandes</h3>
        {loading && (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement en cours...</span>
            </div>
            <p className="mt-3">Chargement des données...</p>
          </div>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Erreur :</strong> {error}
          </div>
        )}
        {!loading && !error && (
          <div className="bg-white p-3 rounded-3 shadow-sm">
            {formattedOrders.length === 0 ? (
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
              <Table 
                columns={orderColumns} 
                dataSource={formattedOrders} 
                rowKey="key"
                pagination={{ pageSize: 10 }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
