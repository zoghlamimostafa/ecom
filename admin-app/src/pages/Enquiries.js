import React, { useEffect, useState } from "react";

import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAEnquiry,
  getEnquiries,
  resetState,
  updateAEnquiry,
} from "../features/enquiry/enquirySlice";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModel";

const columns = [
  {
    title: "Numéro",
    dataIndex: "key",
    width: 80,
    align: "center",
    responsive: ["md"],
  },
  {
    title: "Nom",
    dataIndex: "name",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 200,
    ellipsis: true,
    responsive: ["lg"],
  },
  {
    title: "Mobile",
    dataIndex: "mobile",
    width: 120,
    responsive: ["md"],
  },
  {
    title: "Statut",
    dataIndex: "status",
    width: 150,
  },
  {
    title: "Action",
    dataIndex: "action",
    width: 120,
    align: "center",
    fixed: "right",
  },
];

const Enquiries = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [enqId, setenqId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setenqId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(resetState());
    dispatch(getEnquiries());
  }, [dispatch]);
  const enqState = useSelector((state) => state.enquiry.enquiries);
  const data1 = [];
  for (let i = 0; i < enqState.length; i++) {
    data1.push({
      key: i + 1,
      name: enqState[i].name,
      email: enqState[i].email,
      mobile: enqState[i].mobile,
      status: (
        <>
          <select
            name=""
            defaultValue={enqState[i].status ? enqState[i].status : "Submitted"}
            className="form-control form-select"
            id=""
            onChange={(e) => setEnquiryStatus(e.target.value, enqState[i].id)}
          >
            <option value="Submitted">Soumise</option>
            <option value="Contacted">Contacté</option>
            <option value="In Progress">En cours</option>
            <option value="Resolved">Résolue</option>
          </select>
        </>
      ),

      action: (
        <>
          <Link
            className="ms-3 fs-3 text-danger"
            to={`/admin/enquiries/${enqState[i].id}`}
          >
            <AiOutlineEye />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(enqState[i].id)}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }
  const setEnquiryStatus = (e, i) => {
    console.log(e, i);
    const data = { id: i, enqData: e };
    dispatch(updateAEnquiry(data));
  };
  const deleteEnq = (e) => {
    console.log('🗑️ Suppression de l\'enquête ID:', e);
    dispatch(deleteAEnquiry(e))
      .unwrap()
      .then(() => {
        console.log('✅ Enquête supprimée avec succès');
        setOpen(false);
        dispatch(resetState());
        dispatch(getEnquiries());
      })
      .catch((error) => {
        console.error('❌ Erreur lors de la suppression:', error);
        setOpen(false);
        alert('Erreur lors de la suppression de l\'enquête. Veuillez réessayer.');
      });
  };
  return (
    <div className="admin-page-container">
      <div className="page-header">
        <h3 style={{ color: "white", fontWeight: "700" }}>
          📨 Demandes de Renseignements
        </h3>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", marginBottom: 0 }}>
          Gérez toutes les demandes de contact
        </p>
      </div>
      <div className="table-container">
        <Table 
          columns={columns} 
          dataSource={data1}
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} demandes`,
          }}
          bordered
          responsive
          style={{
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteEnq(enqId);
        }}
        title="Êtes-vous sûr de vouloir supprimer cette demande ?"
      />
      
      <style jsx>{`
        .admin-page-container {
          padding: 20px;
        }
        
        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 25px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        
        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 20px;
        }
        
        @media (max-width: 768px) {
          .admin-page-container {
            padding: 10px;
          }
          
          .page-header {
            padding: 20px;
          }
          
          .table-container {
            padding: 10px;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Enquiries;