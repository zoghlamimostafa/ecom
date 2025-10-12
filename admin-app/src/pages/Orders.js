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

  // Handler for deleting order
  const handleDeleteOrder = async (orderId) => {
    try {
      await dispatch(deleteOrder(orderId));
      message.success('Commande supprimée avec succès');
      // Refresh the orders list
      dispatch(getOrders());
    } catch (error) {
      message.error('Échec de la suppression de la commande');
    }
  };

  // Handler for updating order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus }));
      message.success('Statut de la commande mis à jour avec succès');
      // Refresh the orders list
      dispatch(getOrders());
    } catch (error) {
      message.error('Échec de la mise à jour du statut de la commande');
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
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(newStatus) => handleStatusChange(record.orderId, newStatus)}
        >
          <Option value="Processing">En traitement</Option>
          <Option value="Dispatched">Expédié</Option>
          <Option value="Cancelled">Annulé</Option>
          <Option value="Delivered">Livré</Option>
        </Select>
      ),
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

  const data1 = safeOrderState.map((order, index) => ({
    key: order._id || `order-${index}`, // Use order ID as key
    orderId: order._id,
    name: (order.user?.firstname || order.orderby?.firstname) || "Unknown",
    product: (
      <Link to={`/admin/order/${order._id}`}>
        Voir les commandes
      </Link>
    ),
    amount: order.paymentIntent?.amount || order.totalPrice || order.totalPriceAfterDiscount || "N/A",
    status: order.orderStatus || order.paymentIntent?.status || "Processing",
    date: order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A",
  }));

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
