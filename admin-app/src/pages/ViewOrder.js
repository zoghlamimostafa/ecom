import React, { useEffect } from "react";
import { Table, Card, Descriptions, Tag, Button, Space, Popconfirm, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete, AiOutlineArrowLeft } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSingleOrder, deleteOrder } from "../features/auth/authSlice";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Product Name",
    dataIndex: "name",
  },
  {
    title: "Brand",
    dataIndex: "brand",
  },
  {
    title: "Count",
    dataIndex: "count",
  },
  {
    title: "Color",
    dataIndex: "color",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const ViewOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.pathname.split("/")[3];
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('📋 ViewOrder - Chargement commande ID:', orderId);
    dispatch(getSingleOrder(orderId));
  }, [dispatch, orderId]);

  const orderState = useSelector((state) => state.auth.singleOrder);
  const orderProducts = orderState && orderState.orderItems;

  const handleDeleteOrder = async () => {
    console.log('🗑️ ViewOrder - Suppression commande:', orderId);
    try {
      await dispatch(deleteOrder(orderId)).unwrap();
      message.success('Commande supprimée avec succès');
      navigate('/admin/orders');
    } catch (error) {
      console.error('❌ ViewOrder - Erreur suppression:', error);
      message.error('Échec de la suppression: ' + (error.message || 'Erreur inconnue'));
    }
  };

  console.log("Order state:", orderState);
  console.log("Order products:", orderProducts);

  const data1 = [];
  if (orderProducts) {
    for (let i = 0; i < orderProducts.length; i++) {
      data1.push({
        key: orderProducts[i].id || `item-${i}`,
        name: orderProducts[i].product?.title || "N/A",
        brand: orderProducts[i].product?.brand || "N/A", 
        count: orderProducts[i].quantity || 0,
        amount: orderProducts[i].price || 0,
        color: orderProducts[i].color || "N/A",  // color est une string simple
        date: orderProducts[i].product?.createdAt ? new Date(orderProducts[i].product.createdAt).toLocaleDateString() : "N/A",
        action: (
          <span style={{ color: '#999', fontSize: '14px' }}>Produit</span>
        ),
      });
    }
  }

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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Button 
            icon={<AiOutlineArrowLeft />} 
            onClick={() => navigate('/admin/orders')}
            style={{ marginBottom: '12px' }}
          >
            Retour aux commandes
          </Button>
          <h3 className="title" style={{ margin: 0 }}>Détails de la Commande #{orderId}</h3>
        </div>
        <Space>
          <Link to={`/admin/order/${orderId}/edit`}>
            <Button 
              type="primary" 
              icon={<BiEdit />}
              style={{
                background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
                border: 'none',
              }}
            >
              Modifier le statut
            </Button>
          </Link>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette commande?"
            description="Cette action est irréversible."
            onConfirm={handleDeleteOrder}
            okText="Oui, supprimer"
            cancelText="Annuler"
            okButtonProps={{ danger: true }}
          >
            <Button 
              danger 
              icon={<AiFillDelete />}
            >
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      </div>

      {orderState && (
        <>
          <Card style={{ marginBottom: '24px' }}>
            <Descriptions title="Informations de la commande" bordered column={2}>
              <Descriptions.Item label="Date">
                {orderState.createdAt ? new Date(orderState.createdAt).toLocaleString('fr-FR') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Statut">
                <Tag color={getStatusColor(orderState.orderStatus)}>
                  {orderState.orderStatus || 'Not Processed'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Client">
                {orderState.user?.firstname} {orderState.user?.lastname}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {orderState.user?.email || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Téléphone">
                {orderState.shippingInfo?.phone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Montant total">
                <strong style={{ fontSize: '18px', color: '#ff6b35' }}>
                  {orderState.paymentIntent?.amount || orderState.totalPrice || 0} TND
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Adresse de livraison" span={2}>
                {orderState.shippingInfo?.address}, {orderState.shippingInfo?.city},{' '}
                {orderState.shippingInfo?.state} - {orderState.shippingInfo?.pincode}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Produits commandés">
            <Table columns={columns} dataSource={data1} rowKey="key" pagination={false} />
          </Card>
        </>
      )}
    </div>
  );
};

export default ViewOrder;
