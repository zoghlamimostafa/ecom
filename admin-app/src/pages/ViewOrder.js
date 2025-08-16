import React, { useEffect } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { getOrderByUser, getOrders } from "../features/auth/authSlice";

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
  const userId = location.pathname.split("/")[3];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderByUser(userId));
  }, [dispatch, userId]);

  const orderState = useSelector((state) => state.auth.orderbyuser);
  // Fix: orderState is now a single order object, use orderItems field
  const orderProducts = orderState && orderState.orderItems;

  console.log("Order state:", orderState);
  console.log("Order products:", orderProducts);

  const data1 = [];
  if (orderProducts) {
    for (let i = 0; i < orderProducts.length; i++) {
      data1.push({
        key: orderProducts[i]._id || `item-${i}`, // Use item ID as key or fallback
        name: orderProducts[i].product?.title || "N/A",
        brand: orderProducts[i].product?.brand || "N/A", 
        count: orderProducts[i].quantity || 0, // Use quantity instead of count
        amount: orderProducts[i].price || 0, // Use the price from orderItem
        color: orderProducts[i].color?.title || "N/A", // Color is now an object reference
        date: orderProducts[i].product?.createdAt ? new Date(orderProducts[i].product.createdAt).toLocaleDateString() : "N/A",
        action: (
          <>
            <Link to="/" className=" fs-3 text-danger">
              <BiEdit />
            </Link>
            <Link className="ms-3 fs-3 text-danger" to="/">
              <AiFillDelete />
            </Link>
          </>
        ),
      });
    }
  }

  return (
    <div>
      <h3 className="mb-4 title">View Order</h3>
      <div>
        <Table columns={columns} dataSource={data1} rowKey="key" />
      </div>
    </div>
  );
};

export default ViewOrder;
