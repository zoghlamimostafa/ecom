import React, { useEffect, useState } from "react";
import { Card, Form, Select, Button, message, Spin, Descriptions, Table, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleOrder, updateOrderStatus } from "../features/auth/authSlice";

const { Option } = Select;

const EditOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const orderState = useSelector((state) => state.auth.singleOrder);

  useEffect(() => {
    console.log('📋 EditOrder - Chargement commande ID:', id);
    dispatch(getSingleOrder(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (orderState) {
      form.setFieldsValue({
        status: orderState.orderStatus || 'Not Processed'
      });
    }
  }, [orderState, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    console.log('🔄 EditOrder - Mise à jour statut:', id, 'vers', values.status);
    try {
      await dispatch(updateOrderStatus({ orderId: id, status: values.status })).unwrap();
      message.success('Statut de la commande mis à jour avec succès');
      setTimeout(() => {
        navigate('/admin/orders');
      }, 1000);
    } catch (error) {
      console.error('❌ EditOrder - Erreur mise à jour:', error);
      message.error('Échec de la mise à jour: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  if (!orderState) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '20px' }}>Chargement de la commande...</p>
      </div>
    );
  }

  // Colonnes pour le tableau des produits
  const productColumns = [
    {
      title: "Produit",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Marque",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Quantité",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Prix unitaire",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} TND`,
    },
    {
      title: "Couleur",
      dataIndex: "color",
      key: "color",
      render: (color) => <Tag color="blue">{color}</Tag>,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, record) => `${(record.price * record.quantity).toFixed(2)} TND`,
    },
  ];

  // Préparer les données des produits
  const productData = orderState.orderItems?.map((item, index) => ({
    key: index,
    name: item.product?.title || "N/A",
    brand: item.product?.brand || "N/A",
    quantity: item.quantity,
    price: item.price,
    color: item.color || "N/A",
  })) || [];

  const getStatusColor = (status) => {
    const colors = {
      'Not Processed': 'default',
      'Processing': 'processing',
      'Dispatched': 'warning',
      'Delivered': 'success',
      'Cancelled': 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={<h3 style={{ margin: 0 }}>Modifier la Commande #{id}</h3>}
        style={{ marginBottom: '24px' }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Numéro de commande">{orderState.id}</Descriptions.Item>
          <Descriptions.Item label="Date">
            {orderState.createdAt ? new Date(orderState.createdAt).toLocaleString('fr-FR') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Client">
            {orderState.user?.firstname} {orderState.user?.lastname}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{orderState.user?.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Téléphone">
            {orderState.shippingInfo?.phone || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Statut actuel">
            <Tag color={getStatusColor(orderState.orderStatus)}>
              {orderState.orderStatus || 'Not Processed'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Adresse de livraison" span={2}>
            {orderState.shippingInfo?.address}, {orderState.shippingInfo?.city},{' '}
            {orderState.shippingInfo?.state} - {orderState.shippingInfo?.pincode}
          </Descriptions.Item>
          <Descriptions.Item label="Montant total" span={2}>
            <strong style={{ fontSize: '18px', color: '#ff6b35' }}>
              {orderState.paymentIntent?.amount || orderState.totalPrice || 0} TND
            </strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Produits commandés" style={{ marginBottom: '24px' }}>
        <Table
          columns={productColumns}
          dataSource={productData}
          pagination={false}
          rowKey="key"
        />
      </Card>

      <Card title="Modifier le statut de la commande">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: orderState.orderStatus || 'Not Processed'
          }}
        >
          <Form.Item
            label="Statut de la commande"
            name="status"
            rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
          >
            <Select size="large" style={{ width: '100%' }}>
              <Option value="Not Processed">Non traité</Option>
              <Option value="Processing">En traitement</Option>
              <Option value="Dispatched">Expédié</Option>
              <Option value="Delivered">Livré</Option>
              <Option value="Cancelled">Annulé</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
                border: 'none',
                marginRight: '12px',
              }}
            >
              Mettre à jour le statut
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/admin/orders')}
              style={{ marginRight: '12px' }}
            >
              Annuler
            </Button>
            <Button
              size="large"
              onClick={() => navigate(`/admin/order/${id}`)}
            >
              Voir les détails
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditOrder;
