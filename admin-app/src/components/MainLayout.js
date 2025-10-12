import React, { useState } from "react";
import { BgColorsOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineBgColors,
} from "react-icons/ai";

import { MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

import { RiCouponLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import { IoIosNotifications } from "react-icons/io";
import { FaClipboardList, FaBloggerB } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt } from "react-icons/bi";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import axios from 'axios'; // Importez Axios

const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear()
    window.location.reload()
    navigate("/")
 }

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout /* onContextMenu={(e) => e.preventDefault()} */>
      <Sider  trigger={null} collapsible collapsed={collapsed}>
          <h2 className="text-white fs-5 text-center py-3 mb-0">
            <span className="lg-logo">Admin</span>
          </h2>
        <Menu
          theme="dark"
          mode="vertical"
          inlineIndent={16}
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key == "signout") {
            } else {
              navigate(key);
            }
          }}
          items={[  

            {
              key: "",
              icon: <MdDashboard className="fs-4" />,
              label: "Tableau de bord",
            },
            {
              key: "customers",
              icon: <FaUsers className="fs-4" />,
              label: "Customers",
            },
            {
              key: "user-management",
              icon: <FaUsers className="fs-4" />,
              label: "Gestion Utilisateurs",
              children: [
                {
                  key: "add-user",
                  icon: <FaUsers className="fs-4" />,
                  label: "Ajouter Utilisateur",
                },
              ],
            },
           
            {
              key: "Catalog",
              icon: <AiOutlineShoppingCart className="fs-4" />,
              label: "Catalogue",
              children: [
                {
                  key: "product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Ajouter un produit",
                },
                {
                  key: "list-product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Liste de produits",
                },
                {
                  key: "brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "marque",
                },
                {
                  key: "list-brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "liste des marques ",
                },
              
                {
                  key: "category",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Catégorie",
                },
                {
                  key: "list-category",
                  icon: <BiCategoryAlt className="fs-4" />,
                  label: "Liste des catégories",
                },
                {
                  key: "color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Couleur",
                },
                {
                  key: "list-color",
                  icon: <AiOutlineBgColors className="fs-4" />,
                  label: "Liste des Couleur",
                },
              ],
            },
            {
              key: "orders",
              icon: <FaClipboardList className="fs-4" />,
              label: "Ordres",
            },
            {
              key: "marketing",
              icon: <RiCouponLine className="fs-4" />,
              label: "Marketing",
              children: [
                {
                  key: "coupon",
                  icon: <ImBlog className="fs-4" />,
                  label: "Ajouter un coupon",
                },
                {
                  key: "coupon-list",
                  icon: <RiCouponLine className="fs-4" />,
                  label: "Liste des coupons",
                },
              ],
            },
            {
              key: "blogs",
              icon: <FaBloggerB className="fs-4" />,
              label: "Blogs",
              children: [
                {
                  key: "blog",
                  icon: <ImBlog className="fs-4" />,
                  label: "ajouter un blogs",
                },
                {
                  key: "blog-list",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Liste des Blogs",
                },
                {
                  key: "blog-category",
                  icon: <ImBlog className="fs-4" />,
                  label: "Ajouter une catégorie de blog",
                },
                {
                  key: "blog-category-list",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Liste des catégories de blog",
                },
              ],
            },
            {
              key: "enquiries",
              icon: <FaClipboardList className="fs-4" />,
              label: "Demandes de renseignements",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
           

          <div className="d-flex gap-3 align-items-center dropdown">
          <div className="dropdown">
  <div className="dropdown-toggle" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    <i className="fas fa-sign-out-alt"></i>
  </div>
  <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
    <li>
      <Link to="/" className="dropdown-item" onClick={handleLogout}>Déconnexion</Link>
    </li>
  </ul>
</div>

               
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;