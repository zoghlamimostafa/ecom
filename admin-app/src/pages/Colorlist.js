import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteAColor, getColors } from "../features/color/colorSlice";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModel";

const columns = [
  {
    title: "Numéro",
    dataIndex: "key",
  },
  {
    title: "Nom",
    dataIndex: "name",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Colorlist = () => {
  const [open, setOpen] = useState(false);
  const [colorId, setColorId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setColorId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  const colorState = useSelector((state) => state.color.colors);

  const data1 = colorState.map((color, index) => ({
    key: index + 1,
    name: color?.title, // Utilisez l'opérateur de nullish pour vérifier si color est null ou undefined
    action: (
      <>
        <Link to={`/admin/color/${color?._id}`} className=" fs-3 text-danger">
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(color?._id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));
  

  const deleteColor = (e) => {
    dispatch(deleteAColor(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getColors());
    }, 100);
  };

  return (
    <div>
      <h3 className="mb-4 title">Couleurs</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteColor(colorId);
        }}
        title="Êtes-vous sûr de vouloir supprimer cette couleur ?"
      />
    </div>
  );
};

export default Colorlist;
