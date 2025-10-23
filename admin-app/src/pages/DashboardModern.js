import React, { useState, useEffect, useCallback } from "react";
import { 
  Card, Row, Col, Statistic, Table, Tag, Progress, Space, Button, 
  Spin, Alert, Empty, Tooltip 
} from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  SyncOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import axios from "axios";
import { getConfig } from "../utils/axiosConfig";
import { base_url } from "../utils/baseUrl";
import "./DashboardModern.css";

const DashboardModern = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch products
      const productResponse = await axios.get(`${base_url}product/`);
      const productData = productResponse.data;
      
      let productCount = 0;
      if (productData && Array.isArray(productData.products)) {
        productCount = productData.products.length;
      } else if (Array.isArray(productData)) {
        productCount = productData.length;
      }

      // Fetch orders
      const orderResponse = await axios.get(`${base_url}user/getallorders`, getConfig());
      let orderData = [];
      
      if (orderResponse.data && Array.isArray(orderResponse.data.orders)) {
        orderData = orderResponse.data.orders;
      } else if (orderResponse.data && Array.isArray(orderResponse.data.data)) {
        orderData = orderResponse.data.data;
      } else if (Array.isArray(orderResponse.data)) {
        orderData = orderResponse.data;
      }

      // Fetch customers
      let customerCount = 0;
      try {
        const customerResponse = await axios.get(`${base_url}user/all-users`, getConfig());
        if (customerResponse.data && Array.isArray(customerResponse.data)) {
          customerCount = customerResponse.data.length;
        }
      } catch (err) {
        console.log("Could not fetch customers:", err.message);
      }

      // Calculate stats
      const revenue = orderData.reduce((sum, order) => {
        return sum + (parseFloat(order.totalPrice) || 0);
      }, 0);

      const pending = orderData.filter(o => 
        o.orderStatus === 'Pending' || o.orderStatus === 'Processing'
      ).length;
      
      const completed = orderData.filter(o => 
        o.orderStatus === 'Delivered' || o.orderStatus === 'Completed'
      ).length;

      setStats({
        totalProducts: productCount,
        totalOrders: orderData.length,
        totalRevenue: revenue,
        totalCustomers: customerCount,
        pendingOrders: pending,
        completedOrders: completed
      });

      setOrders(orderData);
      setRecentOrders(orderData.slice(0, 5));

      // Generate chart data (derniers 7 jours)
      const last7Days = generateLast7DaysData(orderData);
      setChartData(last7Days);

      // Generate category data for pie chart
      const categories = generateCategoryData(productData);
      setCategoryData(categories);

    } catch (error) {
      if (error.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.response?.status === 404) {
        setError("Service non disponible.");
      } else {
        setError(`Erreur: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Generate data for last 7 days
  const generateLast7DaysData = (orders) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });

      const revenue = dayOrders.reduce((sum, order) => 
        sum + (parseFloat(order.totalPrice) || 0), 0
      );

      data.push({
        name: dayName,
        commandes: dayOrders.length,
        revenus: revenue.toFixed(2)
      });
    }
    
    return data;
  };

  // Generate category data
  const generateCategoryData = (productData) => {
    const categories = {};
    const products = productData.products || productData || [];
    
    products.forEach(product => {
      const category = product.category || 'Autre';
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.keys(categories).map(key => ({
      name: key,
      value: categories[key]
    }));
  };

  const COLORS = ['#ff8800', '#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884d8'];

  const orderColumns = [
    {
      title: "N° Commande",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <strong>#{text}</strong>
    },
    {
      title: "Client",
      dataIndex: "customer",
      key: "customer",
      render: (text) => (
        <Space>
          <UserOutlined />
          {text || 'N/A'}
        </Space>
      )
    },
    {
      title: "Montant",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          {parseFloat(price || 0).toFixed(2)} TND
        </span>
      ),
      sorter: (a, b) => a.totalPrice - b.totalPrice
    },
    {
      title: "Statut",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const statusConfig = {
          'Pending': { color: 'orange', icon: <ClockCircleOutlined /> },
          'Processing': { color: 'blue', icon: <SyncOutlined spin /> },
          'Delivered': { color: 'green', icon: <CheckCircleOutlined /> },
          'Completed': { color: 'success', icon: <CheckCircleOutlined /> },
          'Cancelled': { color: 'red', icon: <ClockCircleOutlined /> }
        };
        
        const config = statusConfig[status] || { color: 'default', icon: null };
        
        return (
          <Tag color={config.color} icon={config.icon}>
            {status || 'N/A'}
          </Tag>
        );
      }
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString('fr-FR'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" tip="Chargement des données..." />
      </div>
    );
  }

  return (
    <div className="dashboard-modern">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <TrophyOutlined style={{ color: '#ff8800', marginRight: '10px' }} />
          Tableau de Bord
        </h1>
        <Button 
          type="primary" 
          icon={<SyncOutlined />} 
          onClick={fetchAllData}
          loading={loading}
          style={{
            background: 'linear-gradient(135deg, #ff8800 0%, #ff6600 100%)',
            border: 'none'
          }}
        >
          Actualiser
        </Button>
      </div>

      {error && (
        <Alert
          message="Erreur de chargement"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '20px' }}
        />
      )}

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-orange" bordered={false}>
            <Statistic
              title="Revenus Totaux"
              value={stats.totalRevenue.toFixed(2)}
              precision={2}
              valueStyle={{ color: '#ff8800', fontWeight: 'bold' }}
              prefix={<DollarOutlined />}
              suffix="TND"
            />
            <div className="stat-trend">
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span>+12.5% ce mois</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-blue" bordered={false}>
            <Statistic
              title="Commandes"
              value={stats.totalOrders}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
              prefix={<ShoppingCartOutlined />}
            />
            <div className="stat-progress">
              <span>Complétées: {stats.completedOrders}</span>
              <Progress 
                percent={(stats.completedOrders / stats.totalOrders * 100).toFixed(0)} 
                strokeColor="#52c41a"
                size="small"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-green" bordered={false}>
            <Statistic
              title="Produits"
              value={stats.totalProducts}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
              prefix={<ShoppingOutlined />}
            />
            <div className="stat-trend">
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span>Inventaire actif</span>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-purple" bordered={false}>
            <Statistic
              title="Clients"
              value={stats.totalCustomers}
              valueStyle={{ color: '#2196F3', fontWeight: 'bold' }}
              prefix={<UserOutlined />}
            />
            <div className="stat-trend">
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span>+8 cette semaine</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} lg={16}>
          <Card 
            title="Revenus des 7 derniers jours" 
            bordered={false}
            className="chart-card"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8800" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff8800" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenus" 
                  stroke="#ff8800" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  name="Revenus (TND)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title="Produits par Catégorie" 
            bordered={false}
            className="chart-card"
          >
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="Aucune donnée de catégorie" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card 
            title="Commandes Récentes" 
            bordered={false}
            className="table-card"
            extra={
              <Button type="link" href="/admin/orders">
                Voir toutes →
              </Button>
            }
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              rowKey={(record) => record.id || record._id}
              pagination={false}
              scroll={{ x: 768 }}
              locale={{ emptyText: 'Aucune commande récente' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardModern;
