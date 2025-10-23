import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteABlog, getBlogs, resetState } from "../features/blogs/blogSlice";
import CustomModal from "../components/CustomModel";

const columns = [
  {
    title: "N°",
    dataIndex: "key",
    width: 70,
    align: "center",
  },
  {
    title: "📝 Titre",
    dataIndex: "name",
    width: "40%",
    ellipsis: true,
  },
  {
    title: "🏷️ Catégorie",
    dataIndex: "category",
    width: "30%",
    render: (category) => (
      <Tag color="blue" style={{ fontSize: "13px", padding: "4px 12px", borderRadius: "6px" }}>
        {category}
      </Tag>
    ),
  },
  {
    title: "⚙️ Actions",
    dataIndex: "action",
    width: "20%",
    align: "center",
  },
];

const Bloglist = () => {
  const [open, setOpen] = useState(false);
  const [blogId, setblogId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setblogId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getBlogs());
  }, [dispatch]);
  const getBlogState = useSelector((state) => state.blogs.blogs);
  const data1 = [];
  for (let i = 0; i < getBlogState.length; i++) {
    data1.push({
      key: i + 1,
      name: getBlogState[i].title,
      category: typeof getBlogState[i].category === 'object' 
        ? getBlogState[i].category?.title || getBlogState[i].category?.name || 'N/A' 
        : getBlogState[i].category || 'N/A',

      action: (
        <div className="d-flex gap-2 justify-content-center">
          <Link
            to={`/admin/blog/${getBlogState[i].id}`}
            className="btn btn-sm btn-primary d-inline-flex align-items-center"
            style={{
              borderRadius: "6px",
              padding: "6px 12px",
            }}
          >
            <BiEdit className="me-1" /> Modifier
          </Link>
          <button
            className="btn btn-sm btn-danger d-inline-flex align-items-center"
            onClick={() => showModal(getBlogState[i].id)}
            style={{
              borderRadius: "6px",
              padding: "6px 12px",
            }}
          >
            <AiFillDelete className="me-1" /> Supprimer
          </button>
        </div>
      ),
    });
  }
  const deleteBlog = (e) => {
    console.log('🗑️ Suppression du blog ID:', e);
    dispatch(deleteABlog(e))
      .unwrap()
      .then(() => {
        console.log('✅ Blog supprimé avec succès');
        setOpen(false);
        dispatch(resetState());
        dispatch(getBlogs());
      })
      .catch((error) => {
        console.error('❌ Erreur lors de la suppression:', error);
        setOpen(false);
        alert('Erreur lors de la suppression du blog. Veuillez réessayer.');
      });
  };
  return (
    <div className="admin-page-container">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1" style={{ color: "white", fontWeight: "700" }}>
            📚 Liste des Blogs
          </h3>
          <p className="mb-0" style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
            Gérez tous vos articles de blog
          </p>
        </div>
        <Link to="/admin/blog">
          <Button 
            type="primary" 
            icon={<AiOutlinePlus />} 
            size="large"
            style={{
              borderRadius: "8px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Ajouter un blog
          </Button>
        </Link>
      </div>

      <div className="table-container">
        <Table 
          columns={columns} 
          dataSource={data1}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} blogs`,
          }}
          scroll={{ x: 800 }}
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
          deleteBlog(blogId);
        }}
        title="Êtes-vous sûr de vouloir supprimer ce blog ?"
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
        }
        
        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 20px;
        }
        
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          
          .page-header > div {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Bloglist;