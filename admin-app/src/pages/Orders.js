import React, { useEffect } from "react";
import { Table, Button, Popconfirm, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getOrders, deleteOrder, updateOrderStatus } from "../features/auth/authSlice";

const { Option } = Select;

const Orders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const orderState = useSelector((state) => state.auth.orders);

  console.log('🔍 Orders.js - orderState:', orderState);
  console.log('🔍 Orders.js - Type:', typeof orderState, 'Is Array:', Array.isArray(orderState));
  console.log('🔍 Orders.js - Length:', orderState?.length);

  // Handler for deleting order
  const handleDeleteOrder = async (orderId) => {
    console.log('🗑️ Orders.js - Tentative suppression:', orderId);
    try {
      const result = await dispatch(deleteOrder(orderId)).unwrap();
      console.log('✅ Orders.js - Suppression réussie:', result);
      message.success('Commande supprimée avec succès');
      // Refresh the orders list
      dispatch(getOrders());
    } catch (error) {
      console.error('❌ Orders.js - Erreur suppression:', error);
      message.error('Échec de la suppression de la commande: ' + (error.message || 'Erreur inconnue'));
    }
  };

  // Handler for updating order status
  const handleStatusChange = async (orderId, newStatus) => {
    console.log('🔄 Orders.js - Tentative mise à jour:', orderId, 'vers', newStatus);
    try {
      const result = await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      console.log('✅ Orders.js - Mise à jour réussie:', result);
      message.success('Statut de la commande mis à jour avec succès');
      // Refresh the orders list
      dispatch(getOrders());
    } catch (error) {
      console.error('❌ Orders.js - Erreur mise à jour:', error);
      message.error('Échec de la mise à jour du statut: ' + (error.message || 'Erreur inconnue'));
    }
  };

  const columns = [
    {
      title: "Numéro de commande",
      dataIndex: "key",
    },
    {
      title: "Client",
      dataIndex: "name",
    },
    {
      title: "Produits totaux",
      dataIndex: "product",
    },
    {
      title: "Montant",
      dataIndex: "amount",
    },
    {
      title: "Statut",
      dataIndex: "status",
      render: (status, record) => {
        console.log('🎨 Rendering status for order:', record.orderId, 'Status:', status);
        return (
          <Select
            value={status}
            style={{ width: 150 }}
            onChange={(newStatus) => {
              console.log('📝 Status changed for order:', record.orderId, 'New status:', newStatus);
              handleStatusChange(record.orderId, newStatus);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Option value="Not Processed">Non traité</Option>
            <Option value="Processing">En traitement</Option>
            <Option value="Dispatched">Expédié</Option>
            <Option value="Cancelled">Annulé</Option>
            <Option value="Delivered">Livré</Option>
          </Select>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (_, record) => (
        <>
          <Link to={`/admin/order/${record.orderId}`} className="fs-3 text-primary">
            <BiEdit />
          </Link>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette commande?"
            onConfirm={() => handleDeleteOrder(record.orderId)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="link" className="ms-3 fs-3 text-danger">
              <AiFillDelete />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // Ensure orderState is always an array
  const safeOrderState = Array.isArray(orderState) ? orderState : [];

  console.log('🔍 Orders.js - safeOrderState:', safeOrderState);
  console.log('🔍 Orders.js - safeOrderState.length:', safeOrderState.length);

  const data1 = safeOrderState.map((order, index) => {
    console.log(`🔍 Orders.js - Mapping order ${index}:`, order);
    return {
      key: order.id || `order-${index}`, // Use order ID as key
      orderId: order.id,
      name: (order.user?.firstname || order.orderby?.firstname) || "Unknown",
      product: (
        <Link to={`/admin/order/${order.id}`}>
          Voir les commandes
        </Link>
      ),
      amount: order.paymentIntent?.amount || order.totalPrice || order.totalPriceAfterDiscount || "N/A",
      status: order.orderStatus || order.paymentIntent?.status || "Processing",
      date: order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A",
    };
  });

  console.log('🔍 Orders.js - data1 (mapped):', data1);
  console.log('🔍 Orders.js - data1.length:', data1.length);

  return (
    <div>
      <h3 className="mb-4 title">Tous les ordres</h3>
      <div>
        <Table columns={columns} dataSource={data1} rowKey="key" />
      </div>
    </div>
  );
};

export default Orders;
