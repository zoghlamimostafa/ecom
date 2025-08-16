import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate  ,useLocation} from "react-router-dom";
import { BsSearch } from 'react-icons/bs';
import { TiThMenu } from "react-icons/ti";
import { GiShoppingCart } from "react-icons/gi";
import { MdOutlineFavorite, MdOutlineOtherHouses } from "react-icons/md";
import { CgGames } from "react-icons/cg";
import { SiMakerbot } from "react-icons/si";
import { FaCodeCompare } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/user/userSlice';
import { MdOutlineLogout } from "react-icons/md";
import { FaExchangeAlt, FaHeart } from 'react-icons/fa';
import { FaMobileAlt, FaLaptop, FaBabyCarriage, FaCat, FaLeaf, FaMale, FaFemale, FaDumbbell, FaCar, FaHeartbeat, FaHome, FaGamepad, FaEllipsisH, FaBolt, FaTshirt, FaBook, FaGem, FaUtensils } from 'react-icons/fa';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import { FaRegUser } from "react-icons/fa";
import { getUserProductWishlist } from '../features/user/userSlice';
import { getAllCategories } from '../features/category/categorySlice';

import axios from 'axios';
import { getAProduct } from '../features/products/productSlice';

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();

      const authState = useSelector(state => state.auth); // Accès à l'état d'authentification global
      const categoryState = useSelector(state => state.category); // Get categories from Redux
      const [showDropdown, setShowDropdown] = useState(false);
      

      useEffect(() => {
        // Only fetch wishlist if user is authenticated
        if (authState?.auth) {
          dispatch(getUserProductWishlist());
        }
        // Fetch categories on component mount
        dispatch(getAllCategories());
      }, [dispatch, authState?.auth]);
    
    // Function to get appropriate icon for each category
    const getCategoryIcon = (categoryTitle) => {
      const title = categoryTitle.toLowerCase();
      
      if (title.includes('electronic') || title.includes('électronique')) return <FaBolt />;
      if (title.includes('clothing') || title.includes('vêtement') || title.includes('mode')) return <FaMale />;
      if (title.includes('home') || title.includes('garden') || title.includes('maison') || title.includes('jardin')) return <FaHome />;
      if (title.includes('sport') || title.includes('outdoor')) return <FaDumbbell />;
      if (title.includes('book') || title.includes('livre')) return <FaGamepad />;
      if (title.includes('toys') || title.includes('games') || title.includes('jeux')) return <FaGamepad />;
      if (title.includes('health') || title.includes('beauty') || title.includes('santé') || title.includes('beauté')) return <FaHeartbeat />;
      if (title.includes('automotive') || title.includes('auto')) return <FaCar />;
      if (title.includes('jewelry') || title.includes('bijou')) return <FaEllipsisH />;
      if (title.includes('food') || title.includes('beverage') || title.includes('alimentation')) return <FaLeaf />;
      
      // Default icon for unknown categories
      return <FaEllipsisH />;
    };

      const isDropdownShown = location.pathname === "/telephone" || location.pathname === "/info" || location.pathname === "/baby" || location.pathname === "/animaux" || location.pathname === "/jardin" || location.pathname === "/homme" || location.pathname === "/femme" || location.pathname === "/sport" || location.pathname === "/auto" || location.pathname === "/sante" || location.pathname === "/maison" || location.pathname === "/jeux" || location.pathname === "/other" || location.pathname === "/electro";
const productState=useSelector(state=>state?.product?.product)
const [productOpt, setProductOpt] = useState([]); // Utilisez productOpt pour stocker les options du produit
const [paginate,setPaginate] = useState(true)
      // Fonction pour basculer l'état d'affichage du menu
      const toggleDropdown = () => {
          setIsShown(!isShown);
      };
    const navigate = useNavigate();
    const cartState = useSelector(state => state?.auth?.cartProducts);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (cartState && Array.isArray(cartState) && cartState.length > 0) {
            const totalItemsCount = cartState.reduce((acc, item) => acc + item.quantity, 0);
            const totalPriceCount = cartState.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            setTotalItems(totalItemsCount);
            setTotalPrice(totalPriceCount);
        } else {
            // Réinitialiser le total si le panier est vide ou non défini
            setTotalItems(0);
            setTotalPrice(0);
        }
    }, [cartState]);

    const authstate = useSelector(state => state.auth);
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isShown, setIsShown] = useState(false);

    // Utilisation du useSelector pour accéder à la liste de souhaits
    const wishlistState = useSelector((state) => state?.auth?.wishlist || []);

 
    const handleLogout = () => {
       localStorage.clear()
       window.location.reload()
    }
    
    useEffect(() => {
      if (wishlistState && Array.isArray(wishlistState)) {
        // Calculer le nombre total d'éléments dans la liste de souhaits
        const totalItemsCount = wishlistState.length;
        setTotalItems(totalItemsCount);
      }
    }, [wishlistState]);
  
    
    useEffect(()=>{
        let data = []
        for (let index = 0; index <productState.length;index++){
            const element = productState[index];
            data.push({id:index,prod:element?._id,name:element?.title})
        }
        setProductOpt(data)
    }
,[productState])

    const handleMenuToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleMenuClose = () => {
        setIsOpen(false);
    };

    const handleClick = () => {
        setIsShown(!isShown);
    };

    return (
        <>
<header className='custom-header'>
  <div className='custom-container'>
    <div className='custom-logo1'>
      <h2>
        <Link to="/" className='custom-link'>Sanny_Shop</Link>
      </h2>
    </div>
    <div className='search-wrapper'>
      <Typeahead
        id="pagination-example"
        onChange={(selected) => {
          if (selected.length > 0) {
            navigate(`/product/${selected[0].prod}`);
            dispatch(getAProduct(selected[0].prod));
          }
        }}
        options={productOpt}
        onPaginate={() => console.log('Results paginated')}
        paginate={paginate}
        labelKey="name"
        placeholder="Search for products..."
      />
      <button className="search-button">
        <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>

    <nav className='custom-navbar'>
      <ul className='custom-navbar-list'>
        <li className='custom-navbar-item'>
          <Link to='/wishlist' className='custom-navbar-link'>
            <FaHeart className='custom-navbar-icon' />
            Liste de souhaits ({wishlistState.length})
          </Link>
        </li>
        <li className='custom-navbar-item'>
          <Link to={authState?.auth === null ? "/login" : "/my-Profile"} className='custom-navbar-link'>
            <FaRegUser className='custom-navbar-icon' />
            {authState?.auth === null ? (
              "Se connecter / Mon Compte"
            ) : (
              <>{'Bienvenue ' + authState?.auth?.firstname}</>
            )}
          </Link>
        </li>
        <li className='custom-navbar-item'>
          <Link to='/cart' className='custom-navbar-link'>
            <GiShoppingCart className='custom-navbar-icon' />
            <span className='custom-cart-badge'>{totalItems}</span> {totalPrice}TND
          </Link>
        </li>
      </ul>
    </nav>
  </div>
</header>















<header className='header-container'>
    <div class='header-wrapper'>
        <div class='header-row'>
            <div class='header-column'>
                <div class="category-dropdown">
                    <button class="dropdown-button"   onClick={toggleDropdown} type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" ref={dropdownRef}>
                        <span class='dropdown-text'>Parcourir par catégories
</span>
                        <TiThMenu class='dropdown-icon'  />
                    </button>
                  
                   
                   <ul className={`dropdown-menu ${isShown ? 'show' : ''}`}>
                
                    {/* Dynamic category menu items */}
                    {categoryState?.categories && categoryState.categories.map((category) => (
                        <Link 
                            key={category._id}
                            to={`/product?category=${encodeURIComponent(category.title)}`} 
                            className="dropdown-item"
                        >
                            {getCategoryIcon(category.title)}
                            {category.title}
                        </Link>
                    ))}
                    
                    {/* Fallback static menu items if no categories loaded */}
                    {(!categoryState?.categories || categoryState.categories.length === 0) && (
                        <>
                            <Link to="/product" className="dropdown-item">
                                <FaEllipsisH className="dropdown-icon" />
                                Tous les produits
                            </Link>
                        </>
                    )}
                </ul>
                </div>
            </div>
            <div class='menu-column'>
    <div class='menu-container'>
        <div class='menu-items'>
            <Link to="/" class="menu-item">Accueil</Link>
            <Link to="/product" class="menu-item">Notre magasin</Link>
            <Link to="/my-orders" class="menu-item">Mes commandes</Link>
            <Link to="/blogs" class="menu-item">Blogues</Link>
            <Link to="/contact" class="menu-item">Contact</Link>
        </div>
        <button className='logout-button' onClick={handleLogout} type="button">
  Déconnexion
  <i className="fas fa-sign-out-alt"></i>
</button>
    </div>
</div>

        </div>
    </div>
</header>

        </>
    );
}

export default Header;
