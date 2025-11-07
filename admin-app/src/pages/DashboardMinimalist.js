import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Tag, Button, Space, Typography } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  AppstoreOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Line, Area } from "recharts";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import "./DashboardMinimalist.css";

const { Title, Text } = Typography;

const DashboardMinimalist = () => {
  const [loading, setLoading] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  // Données pour mini graphiques
  const revenueData = [
    { value: 4200 },
    { value: 5100 },
    { value: 4800 },
    { value: 6200 },
    { value: 7100 },
    { value: 6800 },
    { value: 8500 },
  ];

  const ordersData = [
    { value: 23 },
    { value: 31 },
    { value: 28 },
    { value: 42 },
    { value: 38 },
    { value: 45 },
    { value: 52 },
  ];

  const customersData = [
    { value: 120 },
    { value: 135 },
    { value: 148 },
    { value: 162 },
    { value: 178 },
    { value: 195 },
    { value: 215 },
  ];

  const productsData = [
    { value: 145 },
    { value: 152 },
    { value: 158 },
    { value: 165 },
    { value: 172 },
    { value: 180 },
    { value: 189 },
  ];

  useEffect(() => {
    fetchDashboardData();
    
    // Recharger les données toutes les 30 secondes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Vérifier le token dans localStorage
      let token = localStorage.getItem("token");
      
      // Si pas de token direct, essayer de le récupérer depuis l'objet user
      if (!token) {
        const userString = localStorage.getItem("user");
        if (userString) {
          try {
            const user = JSON.parse(userString);
            token = user?.token;
          } catch (e) {
            console.error("❌ Erreur parsing user:", e);
          }
        }
      }
      
      if (!token) {
        console.error("❌ Pas de token trouvé - veuillez vous reconnecter");
        setTokenExpired(true);
        setLoading(false);
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log("🔄 Chargement des données du Dashboard...");
      console.log("📍 Base URL:", base_url);

      const [ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get(`${base_url}user/getallorders`, config),
        axios.get(`${base_url}product/`, config),
        axios.get(`${base_url}user/all-users`, config),
      ]);

      console.log("📦 Orders response:", ordersRes.data);
      console.log("📦 Products response:", productsRes.data);
      console.log("📦 Users response:", usersRes.data);

      // Gérer les différents formats de réponse
      const orders = Array.isArray(ordersRes.data) 
        ? ordersRes.data 
        : (ordersRes.data?.orders || []);
      
      const products = Array.isArray(productsRes.data)
        ? productsRes.data
        : (productsRes.data?.products || []);
      
      const users = Array.isArray(usersRes.data) 
        ? usersRes.data 
        : (usersRes.data?.users || []);

      console.log("✅ Données extraites:", {
        orders: orders.length,
        products: products.length,
        users: users.length
      });
      
      console.log("📋 Première commande pour debug:", orders[0]);

      // Calculer le revenu total - utiliser totalPriceAfterDiscount si disponible, sinon totalPrice
      const totalRevenue = orders.reduce((sum, order) => {
        const orderPrice = parseFloat(order.totalPriceAfterDiscount || order.totalPrice || 0);
        console.log(`💰 Commande ${order.id}: ${orderPrice} TND`);
        return sum + orderPrice;
      }, 0);

      console.log("💰 Revenu total calculé:", totalRevenue, "TND");

      setStats({
        totalRevenue: totalRevenue, // Ne pas diviser par 100, c'est déjà en TND
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: users.length,
      });

      const recent = orders.slice(0, 6).map((order, index) => ({
        key: index,
        id: order.id?.toString().slice(-8) || order._id?.slice(-8) || "N/A",
        customer: order.user?.firstname + " " + order.user?.lastname || "N/A",
        amount: parseFloat(order.totalPriceAfterDiscount || order.totalPrice || 0).toFixed(2),
        status: order.orderStatus || "Pending",
        date: new Date(order.createdAt).toLocaleDateString("fr-FR"),
      }));

      setRecentOrders(recent);
      console.log("✅ Dashboard mis à jour avec succès!");
    } catch (error) {
      console.error("❌ Erreur lors du chargement des données:", error);
      console.error("❌ Détails:", error.response?.data || error.message);
      
      // Si le token est expiré, on affiche quand même 0
      if (error.response?.status === 401) {
        console.error("⚠️ Token expiré - Veuillez vous reconnecter");
        setTokenExpired(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Client",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Montant",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <Text strong>{text} TND</Text>,
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Delivered") color = "success";
        else if (status === "Processing") color = "warning";
        else if (status === "Cancelled") color = "error";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  // Mini graphique personnalisé
  const MiniChart = ({ data, color, type = "area" }) => {
    const ChartComponent = type === "line" ? Line : Area;
    return (
      <div style={{ width: "100%", height: 40, marginTop: 8 }}>
        <ChartComponent
          data={data}
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.2}
          strokeWidth={2}
          dot={false}
        />
      </div>
    );
  };

  const StatCard = ({ title, value, icon, trend, trendValue, color, chartData, chartType }) => (
    <Card className="stat-card-minimal" bordered={false}>
      <div className="stat-card-header">
        <div className="stat-icon" style={{ backgroundColor: `${color}15` }}>
          {React.cloneElement(icon, { style: { color, fontSize: 24 } })}
        </div>
        <Space size={0} direction="vertical">
          <Text type="secondary" className="stat-title">
            {title}
          </Text>
          <Title level={3} className="stat-value" style={{ margin: 0 }}>
            {value}
          </Title>
        </Space>
      </div>
      
      <div className="stat-trend">
        {trend === "up" ? (
          <ArrowUpOutlined style={{ color: "#52c41a", fontSize: 14 }} />
        ) : (
          <ArrowDownOutlined style={{ color: "#ff4d4f", fontSize: 14 }} />
        )}
        <Text style={{ color: trend === "up" ? "#52c41a" : "#ff4d4f", marginLeft: 4 }}>
          {trendValue}%
        </Text>
        <Text type="secondary" style={{ marginLeft: 8 }}>
          vs mois dernier
        </Text>
      </div>

      {chartData && <MiniChart data={chartData} color={color} type={chartType} />}
    </Card>
  );

  return (
    <div className="dashboard-minimal">
      {tokenExpired && (
        <div style={{
          padding: '16px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
          color: 'white',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
        }}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          <div>
            <div style={{ fontWeight: '600', fontSize: '16px' }}>Session expirée</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Votre token JWT est expiré. Veuillez vous déconnecter et vous reconnecter pour voir les données à jour.
            </div>
          </div>
          <Button 
            type="primary" 
            style={{ marginLeft: 'auto', background: 'white', color: '#FF6B35', border: 'none' }}
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
          >
            Se reconnecter
          </Button>
        </div>
      )}
      
      <div className="dashboard-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Dashboard
          </Title>
          <Text type="secondary">Vue d'ensemble de votre boutique</Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchDashboardData}
          loading={loading}
          size="large"
        >
          Actualiser
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Revenus"
            value={`${stats.totalRevenue.toFixed(0)} TND`}
            icon={<DollarOutlined />}
            trend="up"
            trendValue={12.5}
            color="#ff6b35"
            chartData={revenueData}
            chartType="area"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Commandes"
            value={stats.totalOrders}
            icon={<ShoppingOutlined />}
            trend="up"
            trendValue={8.2}
            color="#ffa726"
            chartData={ordersData}
            chartType="line"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={<span style={{ color: 'white' }}>Produits</span>}
            value={stats.totalProducts}
            icon={<AppstoreOutlined />}
            trend="up"
            trendValue={5.1}
            color="#66bb6a"
            chartData={productsData}
            chartType="area"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Clients"
            value={stats.totalCustomers}
            icon={<UserOutlined />}
            trend="up"
            trendValue={15.8}
            color="#2196F3"
            chartData={customersData}
            chartType="line"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title={<Title level={4} style={{ margin: 0 }}>Commandes Récentes</Title>}
            bordered={false}
            className="recent-orders-card"
          >
            <Table
              columns={columns}
              dataSource={recentOrders}
              pagination={false}
              loading={loading}
              className="minimal-table"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardMinimalist;
