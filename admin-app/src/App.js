import "./App.css";
import "./styles/admin-modern.css";
import "./styles/mobile-responsive-fix.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import MainLayout from "./components/MainLayout";
import AuthChecker from "./components/AuthChecker";
import Enquiries from "./pages/Enquiries";
import Bloglist from "./pages/Bloglist";
import Blogcatlist from "./pages/Blogcatlist";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import CustomersDebug from "./pages/CustomersDebug";
import Colorlist from "./pages/Colorlist";
import Categorylist from "./pages/Categorylist";
import Brandlist from "./pages/Brandlist";
import Productlist from "./pages/Productlist";
import Addblog from "./pages/Addblog";
import Addblogcat from "./pages/Addblogcat";
import Addcolor from "./pages/Addcolor";
import Addcat from "./pages/Addcat";
import Addbrand from "./pages/Addbrand";
import AddproductIntelligent from "./pages/AddproductIntelligent";
import Couponlist from "./pages/Couponlist";
import AddCoupon from "./pages/AddCoupon";
import ViewEnq from "./pages/ViewEnq";
import ViewOrder from "./pages/ViewOrder";
import EditOrder from "./pages/EditOrder";
import DashboardMinimalist from "./pages/DashboardMinimalist";
import CreateAdmin from "./pages/CreateAdmin";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import DiagnosticTest from "./components/DiagnosticTest";
import OpenRoutes from "./routing/OpenRoutes";
import PrivateRoutes from "./routing/PrivateRoutes";

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    // Déconnexion automatique lors de la fermeture/rafraîchissement de la fenêtre
    const handleBeforeUnload = (e) => {
      const userString = localStorage.getItem("user");
      if (userString) {
        // Déconnexion silencieuse
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.clear();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  return (
    <AuthChecker>
      <Routes>
        <Route path="/" element={<OpenRoutes><Login /></OpenRoutes>} />
        <Route path="/diagnostic" element={<DiagnosticTest />} />
        <Route path="/create-admin" element={<OpenRoutes><CreateAdmin /></OpenRoutes>} />
        <Route path="/reset-password" element={<OpenRoutes><Resetpassword /></OpenRoutes>} />
        <Route path="/forgot-password" element={<OpenRoutes><Forgotpassword /></OpenRoutes>} />
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<DashboardMinimalist />} />
          <Route path="diagnostic" element={<DiagnosticTest />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="enquiries/:id" element={<PrivateRoutes><ViewEnq /></PrivateRoutes>} />
          <Route path="blog-list" element={<PrivateRoutes><Bloglist /></PrivateRoutes>} />
          <Route path="blog" element={<PrivateRoutes><Addblog /></PrivateRoutes>} />
          <Route path="blog/:id" element={<PrivateRoutes><Addblog /></PrivateRoutes>} />
          <Route path="coupon-list" element={<Couponlist />} />
          <Route path="coupon" element={<AddCoupon />} />
          <Route path="coupon/:id" element={<AddCoupon />} />
          <Route path="blog-category-list" element={<Blogcatlist />} />
          <Route path="blog-category" element={<Addblogcat />} />
          <Route path="blog-category/:id" element={<Addblogcat />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order/:id" element={<ViewOrder />} />
          <Route path="order/:id/edit" element={<EditOrder />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers-debug" element={<CustomersDebug />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="edit-user/:id" element={<EditUser />} />
          <Route path="list-color" element={<Colorlist />} />
          <Route path="color" element={<Addcolor />} />
          <Route path="color/:id" element={<Addcolor />} />
          <Route path="list-category" element={<Categorylist />} />
          <Route path="category" element={<Addcat />} />
          <Route path="category/:id" element={<Addcat />} />
          <Route path="list-brand" element={<Brandlist />} />
          <Route path="brand" element={<Addbrand />} />
          <Route path="brand/:id" element={<Addbrand />} />
          <Route path="list-product" element={<Productlist />} />
          <Route path="product" element={<AddproductIntelligent />} />
          <Route path="product/:id" element={<AddproductIntelligent />} />
        </Route>
      </Routes>
    </AuthChecker>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;