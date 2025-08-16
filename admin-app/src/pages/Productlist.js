import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct, resetState } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModel";

const columns = [
  {
    title: "Numéro",
    dataIndex: "key",
  },
  {
    title: "Titre",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Marque",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Catégorie",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Couleur",
    dataIndex: "color",
  },
  {
    title: "Prix",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const [open, setOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");
  
  const showModal = (productId) => {
    setOpen(true);
    setProductIdToDelete(productId);
  };
  
  const hideModal = () => {
    setOpen(false);
    setProductIdToDelete("");
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getProducts());
  }, [dispatch]);
  
  const productState = useSelector((state) => state.product.products);
  
  const data = productState.map((product, index) => ({
    key: index + 1,
    title: product.title,
    brand: product.brand,
    category: product.category,
    color: product.color,
    price: product.price,
    action: (
      <>
        <Link to={`/admin/product/${product._id}`} className="fs-3 text-black">
          <BiEdit />
        </Link>
        <button 
          className="ms-3 fs-3 text-black bg-transparent border-0" 
          onClick={() => showModal(product._id)}
          style={{ cursor: 'pointer' }}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId));
    setOpen(false);
    setTimeout(() => {
      dispatch(getProducts());
    }, 100);
  };

  return (
    <div>
      <h3 className="mb-4 title">Des produits</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          handleDelete(productIdToDelete);
        }}
        title="Êtes-vous sûr de vouloir supprimer ce produit?"
      />
    </div>
  );
};

export default Productlist;
