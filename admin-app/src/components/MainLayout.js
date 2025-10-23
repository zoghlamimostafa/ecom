import React, { useState, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  AiOutlineShoppingCart,
  AiOutlineBgColors,
} from "react-icons/ai";

import { MdDashboard } from "react-icons/md";
import { FaUsers, FaUserPlus } from "react-icons/fa";

import { RiCouponLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "../styles/header-modern.css";
import "../styles/mobile-responsive-fix.css";
import logoSanny from "../images/logosanny.png";
import { ImBlog } from "react-icons/im";
import { FaClipboardList, FaBloggerB } from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { BiCategoryAlt } from "react-icons/bi";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear()
    window.location.reload()
    navigate("/")
 }

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Constante pour le breakpoint mobile
  const MOBILE_BREAKPOINT = 768;

  // Détection de la taille d'écran et gestion du collapse automatique
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      
      // Auto-collapse sur mobile
      if (mobile) {
        setCollapsed(true);
      }
    };

    // Appel initial
    handleResize();

    // Écouter les changements de taille
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar avec gestion mobile
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout /* onContextMenu={(e) => e.preventDefault()} */>
      {/* Overlay pour fermer le menu sur mobile */}
      {isMobile && !collapsed && (
        <div 
          className="sidebar-overlay active" 
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}
      
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        width={isMobile ? 250 : 200}
        style={isMobile ? {
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          transform: collapsed ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease'
        } : {}}
      >
          <div className="logo">
            {!collapsed ? (
              <>
                <img src={logoSanny} alt="Sanny Store" />
                <span>Admin Panel</span>
              </>
            ) : (
              <img src={logoSanny} alt="Sanny Store" style={{ maxHeight: '40px', maxWidth: '40px' }} />
            )}
          </div>
        <Menu
          theme="dark"
          mode="vertical"
          inlineIndent={16}
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
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
                  key: "customers",
                  icon: <FaUsers className="fs-4" />,
                  label: "Liste des utilisateurs",
                },
                {
                  key: "add-user",
                  icon: <FaUserPlus className="fs-4" />,
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
      <Layout className="site-layout" style={isMobile ? { marginLeft: 0 } : {}}>
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: isMobile ? '0 16px' : 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggleSidebar,
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            {/* Badge Admin */}
            {!isMobile && (
              <div className="admin-badge">
                <i className="fas fa-user-shield"></i>
                <span>Administrateur</span>
              </div>
            )}

            {/* Menu Dropdown */}
            <div className="d-flex gap-3 align-items-center dropdown">
              <div className="dropdown">
                <div className="dropdown-toggle" id="dropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fas fa-sign-out-alt"></i>
                </div>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <Link to="/" className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i> Déconnexion
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: isMobile ? "16px 8px" : "24px 16px",
            padding: isMobile ? 16 : 24,
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