import React, { useState, useEffect } from "react";
import { Table } from "antd";
import axios from "axios";
import { config } from "../utils/axiosconfig";
import { base_url } from "../utils/baseUrl";

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const productResponse = await axios.get(`${base_url}product/`);
      const productData = productResponse.data;
      setProducts(productData);
      setTotalProducts(productData.length);

      const orderResponse = await axios.get(`${base_url}user/getallorders`, config);
      let orderData = [];
      
      // Ensure we always work with an array
      if (orderResponse.data && Array.isArray(orderResponse.data.data)) {
        orderData = orderResponse.data.data;
      } else if (Array.isArray(orderResponse.data)) {
        orderData = orderResponse.data;
      } else {
        console.warn('Orders API returned unexpected data structure:', orderResponse.data);
        orderData = [];
      }
      
      setOrders(orderData);
      setTotalOrders(orderData.length);

      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Une erreur s'est produite lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

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
  const formattedOrders = orders.map((order, index) => ({
    key: order._id || `order-${index}`, // Use order ID as key or fallback
    orderId: order._id || `#${index + 1}`,
    customer: (order.user?.firstname || order.orderby?.firstname) || "Client inconnu",
    totalProducts: order.orderItems ? order.orderItems.length : (order.products ? order.products.length : 0),
    status: order.orderStatus || order.paymentIntent?.status || "En traitement",
  }));

  return (
    <div>
      <h3 className="mb-4 title">Tableau de bord</h3>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="desc">Produits totaux</p>
            <h4 className="mb-0 sub-title">{totalProducts}</h4>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="desc">Total des commandes</p>
            <h4 className="mb-0 sub-title">{totalOrders}</h4>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="mb-5 title">Tous les ordres</h3>
        {loading && <p>Chargement en cours...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <div>
            <Table 
              columns={orderColumns} 
              dataSource={formattedOrders} 
              rowKey="key"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
