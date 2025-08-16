import React from 'react'
import "./App.css";
import {BrowserRouter,Routes, Route} from "react-router-dom";
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import OurStore from './pages/OurStore';
import Blogs from './pages/Blogs';
import CompareProduct from './pages/compareProduct';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import RestPassword from './pages/RestPassword';
import SingleBlog from './pages/SingleBlog';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermAndContions from './pages/TermAndContions';
import SingleProduct from './pages/SingleProduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Electro from './pages/Electro';
import Informatique from './pages/Informatique';
import Bebe from './pages/Bebe';
import Animaux from './pages/Animaux';
import Jadin from './pages/Jardin';
import Homme from './pages/Homme';
import Telephone from './pages/Telephone';
import Femme from './pages/Femme';
import Sport from './pages/Sport';
import Other from './pages/Other';
import Auto from './pages/Auto';
import Sante from './pages/Sante';
import Maison from './pages/Maison';
import Jeux from './pages/Jeux';
import Imageia from './pages/Imageia';
import { PrivateRoutes } from './routing/PrivateRoutes';
import { OpenRoutes } from './routing/OpenRoutes';
import Propros from './pages/Propros';
import FAQPage from './pages/FAQPage';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Livraison from './pages/livraison';
import Payment from './pages/payment';

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
<Route path="/" element={<Layout />}>
<Route index element={<Home />}/>
<Route path="about" element={<About />}/>
<Route path="contact" element={<Contact />}/>
<Route path="product" element={<OurStore />}/>
<Route path="product/:id" element={<SingleProduct />}/>

<Route path="blogs" element={<Blogs />}/>
<Route path="blog/:id" element={<SingleBlog />}/>
<Route path="compare" element={<CompareProduct />}/>
<Route path="wishlist" element={<PrivateRoutes><Wishlist /></PrivateRoutes>}/>
<Route path="/login" element={<OpenRoutes><Login /></OpenRoutes>} />
<Route path="forgot-password" element={<ForgotPassword />}/>
<Route path="sign-up" element={<OpenRoutes><Signup /></OpenRoutes>}/>
<Route path="reset-password/:token" element={<RestPassword />} />
<Route path="privacy-policy" element={<PrivacyPolicy />}/>
<Route path="refund-policy" element={<RefundPolicy />}/>
<Route path="shipping-policy" element={<ShippingPolicy />}/>
<Route path="term-conditions" element={<TermAndContions />}/>
<Route path="cart" element={<Cart />}/>
<Route path="checkout" element={<PrivateRoutes><Checkout /></PrivateRoutes>}/>
<Route path="electro" element={<Electro />}/>
<Route path="info" element={<Informatique />}/>
<Route path="baby" element={<Bebe />}/>

<Route path="Animaux" element={<Animaux />}/>
<Route path="jardin" element={<Jadin />}/>
<Route path="homme" element={<Homme />}/>
<Route path="femme" element={<Femme />}/>
<Route path="sport" element={<Sport />}/>
<Route path="auto" element={<Auto />}/>
<Route path="sante" element={<Sante />}/>
<Route path="maison" element={<Maison />}/>
<Route path="jeux" element={<Jeux />}/>

<Route path="telephone" element={<Telephone />}/>
<Route path="other" element={<Other />}/>
<Route path="proprs" element={<Propros />}/>
<Route path="FAQ" element={<FAQPage
 />}/>
<Route path="my-orders" element={<PrivateRoutes><Orders /></PrivateRoutes>}/>
<Route path="livraison" element={<PrivateRoutes><Livraison /></PrivateRoutes>}/>
<Route path="payment" element={<PrivateRoutes><Payment /></PrivateRoutes>}/>

<Route path="my-Profile" element={<PrivateRoutes><Profile /></PrivateRoutes>}/>

</Route>
      </Routes>     
      </BrowserRouter>    </>
  )
}

export default App
