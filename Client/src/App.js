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
import Jardin from './pages/Jardin';
import Homme from './pages/Homme';
import Telephone from './pages/Telephone';
import Femme from './pages/Femme';
import Sport from './pages/Sport';
import Other from './pages/Other';
import Auto from './pages/Auto';
import Sante from './pages/Sante';
import Maison from './pages/Maison';
import Jeux from './pages/Jeux';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import CategoryProducts from './pages/CategoryProducts';
import { PrivateRoutes } from './routing/PrivateRoutes';
import { OpenRoutes } from './routing/OpenRoutes';
import Propros from './pages/Propros';
import FAQPage from './pages/FAQPage';
import FAQ from './pages/FAQ';
import LegalNotice from './pages/LegalNotice';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Livraison from './pages/livraison';
import Payment from './pages/payment';
import AvisClients from './pages/AvisClients';
import WhatsAppButton from './components/WhatsAppButton';
import { Navigate } from 'react-router-dom';
import { TranslationProvider } from './contexts/TranslationContext';
import TranslationTest from './pages/TranslationTest';
import WishlistTestComponent from './components/WishlistTestComponent';

function App() {
  return (
    <>
      <TranslationProvider>
        <BrowserRouter>
        <Routes>
<Route path="/" element={<Layout />}>
<Route index element={<Home />}/>
<Route path="about" element={<About />}/>
<Route path="contact" element={<Contact />}/>
<Route path="test-translations" element={<TranslationTest />}/>
<Route path="wishlist-test" element={<WishlistTestComponent />}/>
<Route path="product" element={<OurStore />}/>
<Route path="product/:id" element={<SingleProduct />}/>

{/* Routes pour les catégories */}
<Route path="categories" element={<CategoriesPage />}/>
<Route path="category/:categoryId" element={<CategoryDetailPage />}/>
<Route path="categorie/:categorySlug" element={<CategoryProducts />}/>

<Route path="blogs" element={<Blogs />}/>
<Route path="blog/:id" element={<SingleBlog />}/>
<Route path="compare" element={<CompareProduct />}/>
<Route path="wishlist" element={<PrivateRoutes><Wishlist /></PrivateRoutes>}/>
<Route path="login" element={<OpenRoutes><Login /></OpenRoutes>} />
<Route path="forgot-password" element={<ForgotPassword />}/>
<Route path="sign-up" element={<OpenRoutes><Signup /></OpenRoutes>}/>
<Route path="reset-password/:token" element={<RestPassword />} />
<Route path="privacy-policy" element={<PrivacyPolicy />}/>
<Route path="refund-policy" element={<RefundPolicy />}/>
<Route path="shipping-policy" element={<ShippingPolicy />}/>
<Route path="term-conditions" element={<TermAndContions />}/>
<Route path="cart" element={<Cart />}/>
<Route path="checkout" element={<PrivateRoutes><Checkout /></PrivateRoutes>}/>

{/* Routes des catégories principales - redirection vers le système dynamique */}
<Route path="electronique" element={<CategoryProducts />}/>
<Route path="informatique" element={<CategoryProducts />}/>
<Route path="telephones-tablettes" element={<CategoryProducts />}/>
<Route path="mode-homme" element={<CategoryProducts />}/>
<Route path="mode-femme" element={<CategoryProducts />}/>
<Route path="bebe-puericulture" element={<CategoryProducts />}/>
<Route path="maison-bureau" element={<CategoryProducts />}/>
<Route path="jardin-bricolage" element={<CategoryProducts />}/>
<Route path="sport-fitness" element={<CategoryProducts />}/>
<Route path="automobile" element={<CategoryProducts />}/>
<Route path="sante-beaute" element={<CategoryProducts />}/>
<Route path="animaux" element={<CategoryProducts />}/>
<Route path="jeux-jouets" element={<CategoryProducts />}/>
<Route path="autres" element={<CategoryProducts />}/>

{/* Anciennes routes redirigées vers les nouvelles */}
<Route path="electro" element={<Navigate to="/categorie/electronique" replace />}/>
<Route path="info" element={<Navigate to="/categorie/informatique" replace />}/>
<Route path="baby" element={<Navigate to="/categorie/bebe-puericulture" replace />}/>
<Route path="jardin" element={<Navigate to="/categorie/jardin-bricolage" replace />}/>
<Route path="homme" element={<Navigate to="/categorie/mode-homme" replace />}/>
<Route path="femme" element={<Navigate to="/categorie/mode-femme" replace />}/>
<Route path="sport" element={<Navigate to="/categorie/sport-fitness" replace />}/>
<Route path="auto" element={<Navigate to="/categorie/automobile" replace />}/>
<Route path="sante" element={<Navigate to="/categorie/sante-beaute" replace />}/>
<Route path="maison" element={<Navigate to="/categorie/maison-bureau" replace />}/>
<Route path="jeux" element={<Navigate to="/categorie/jeux-jouets" replace />}/>
<Route path="telephone" element={<Navigate to="/categorie/telephones-tablettes" replace />}/>
<Route path="other" element={<Navigate to="/categorie/autres" replace />}/>

<Route path="proprs" element={<Propros />}/>
<Route path="FAQ" element={<FAQPage />}/>
<Route path="faq" element={<FAQ />}/>
<Route path="mentions-legales" element={<LegalNotice />}/>
<Route path="avis-clients" element={<AvisClients />}/>
<Route path="my-orders" element={<PrivateRoutes><Orders /></PrivateRoutes>}/>
<Route path="livraison" element={<PrivateRoutes><Livraison /></PrivateRoutes>}/>
<Route path="payment" element={<PrivateRoutes><Payment /></PrivateRoutes>}/>

<Route path="my-Profile" element={<PrivateRoutes><Profile /></PrivateRoutes>}/>

</Route>
        </Routes>     
        </BrowserRouter>
        <WhatsAppButton />
      </TranslationProvider>
    </>
  )
}

export default App
