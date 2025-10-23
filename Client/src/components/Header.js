import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaHeart, FaBars, FaCaretDown, FaSignOutAlt, FaThLarge, FaPhone, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { logoutUser } from '../features/user/userSlice';
import { getAllProducts } from '../features/products/productSlice';
import { useTranslation } from '../contexts/TranslationContext';
import LanguageSelector from './LanguageSelector';
import UserAvatar from './UserAvatar';
import SearchBar from './SearchBar';
import categoryService from '../services/categoryService';
import logo from '../images/logosanny.png';

const Header = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector(state => state?.auth);
    const cartState = useSelector(state => state?.auth?.cartProducts);
    const wishlistState = useSelector(state => state?.auth?.wishlist);
    const productState = useSelector(state => state?.product?.product);
    
    const [cartItemCount, setCartItemCount] = useState(0);
    const [wishlistItemCount, setWishlistItemCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const userMenuRef = useRef(null);
    const categoriesMenuRef = useRef(null);

    useEffect(() => {
        setCartItemCount(cartState?.length || 0);
    }, [cartState]);

    useEffect(() => {
        setWishlistItemCount(wishlistState?.length || 0);
    }, [wishlistState]);

    // Charger les produits si pas déjà chargés
    useEffect(() => {
        // Vérifier si les produits ne sont pas déjà chargés ou en cours de chargement
        if (!productState || !Array.isArray(productState) || productState.length === 0) {
            console.log('📦 Header: Chargement des produits...');
            dispatch(getAllProducts());
        } else {
            console.log('✅ Header: Produits déjà chargés:', productState.length);
        }
    }, [dispatch]);

    // Charger les catégories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoryService.getCategoriesWithSubcategories();
                setCategories(data);
            } catch (error) {
                console.error('❌ Erreur chargement catégories:', error);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(event.target)) {
                setShowCategories(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            // Dispatch logout action
            await dispatch(logoutUser()).unwrap();
        } catch (error) {
            console.log('Logout error handled:', error);
        } finally {
            // Force complete cleanup
            localStorage.clear(); // Clear ALL localStorage data
            sessionStorage.clear(); // Also clear sessionStorage
            setIsUserMenuOpen(false);
            // Force page reload to completely reset React state
            window.location.href = '/login';
        }
    };

    return (
        <>
            {/* Barre supérieure */}
            <div className="header-top-bar">
                <div className="container-xxl">
                    <div className="top-bar-content">
                        <div className="top-bar-left">
                            <a href="tel:+21695403883" className="top-bar-phone">
                                <FaPhone />
                                <span>+216 95 403 883</span>
                            </a>
                            <div className="top-bar-social">
                                <a href="https://facebook.com/sannystore" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
                                    <FaFacebookF />
                                </a>
                                <a href="https://instagram.com/sannystore" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                                    <FaInstagram />
                                </a>
                            </div>
                        </div>
                        <div className="top-bar-right">
                            <LanguageSelector />
                        </div>
                    </div>
                </div>
            </div>

            <header className='header'>
                <div className='container-xxl'>
                    <div className='header-inner'>
                        <div className="header-logo">
                            <Link to="/">
                                <img src={logo} alt={t('siteLogo')} />
                            </Link>
                        </div>
                        
                        <button 
                            className="mobile-menu-toggle show-mobile"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <FaBars />
                        </button>
                        
                        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
                            <NavLink to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('home')}</NavLink>
                            <NavLink to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('about')}</NavLink>
                            <NavLink to="/product" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('products')}</NavLink>
                            <NavLink to="/avis-clients" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('customerReviews')}</NavLink>
                            <NavLink to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('contact')}</NavLink>
                            <NavLink to="/blogs" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('blog')}</NavLink>
                        </nav>

                        <div className='header-actions'>
                            <Link to='/wishlist' className='header-action' title={t('wishlist')}>
                                <FaHeart />
                                {wishlistItemCount > 0 && <span className='badge'>{wishlistItemCount}</span>}
                            </Link>
                            <Link to='/cart' className='header-action' title={t('cart')}>
                                <FaShoppingCart />
                                {cartItemCount > 0 && <span className='badge'>{cartItemCount}</span>}
                            </Link>
                            
                            {authState?.user !== null ? (
                                <div className='user-menu' ref={userMenuRef}>
                                    <button 
                                        className='user-menu-trigger header-action'
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        title={t('account')}
                                    >
                                        <UserAvatar user={authState.user} size="medium" />
                                        <FaCaretDown className={`caret ${isUserMenuOpen ? 'open' : ''}`} />
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className='user-dropdown'>
                                            <div className='user-info'>
                                                <div className='user-avatar-section'>
                                                    <UserAvatar user={authState.user} size="large" />
                                                    <div className='user-details'>
                                                        <span className='user-name'>{t('welcome')}, {authState?.user?.firstname || authState?.user?.name}</span>
                                                        <span className='user-email'>{authState?.user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                            <Link to='/my-Profile' className='dropdown-link' onClick={() => setIsUserMenuOpen(false)}>
                                                <FaUser /> {t('profile')}
                                            </Link>
                                            <Link to='/my-orders' className='dropdown-link' onClick={() => setIsUserMenuOpen(false)}>
                                                <FaShoppingCart /> {t('orders')}
                                            </Link>
                                            <Link to='/wishlist' className='dropdown-link' onClick={() => setIsUserMenuOpen(false)}>
                                                <FaHeart /> {t('wishlist')}
                                            </Link>
                                            <hr />
                                            <button className='dropdown-link logout-btn' onClick={handleLogout}>
                                                <FaSignOutAlt /> {t('logout')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to='/login' className='header-action' title={t('login')}>
                                    <FaUser />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <div className="header-bottom">
                <div className="container-xxl">
                    <div className="header-bottom-inner">
                        {/* Bouton Catégories - Mega Menu */}
                        <div className="categories-menu" ref={categoriesMenuRef}>
                            <button 
                                className="categories-btn"
                                onClick={() => setShowCategories(!showCategories)}
                            >
                                <FaThLarge />
                                <span>{t('categories')}</span>
                                <i className={`fas fa-chevron-down ${showCategories ? 'rotated' : ''}`}></i>
                            </button>
                            
                            {showCategories && categories.length > 0 && (
                                <div className="mega-menu-dropdown">
                                    <div className="mega-menu-header">
                                        <h3>
                                            <i className="fas fa-th-large"></i>
                                            Toutes les catégories
                                        </h3>
                                        <button 
                                            className="close-mega-menu"
                                            onClick={() => setShowCategories(false)}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                    
                                    <div className="mega-menu-content">
                                        {categories.map((category) => (
                                            <div key={category.id} className="mega-menu-column">
                                                <Link
                                                    to={`/category/${category.id}`}
                                                    className="mega-menu-category-title"
                                                    onClick={() => setShowCategories(false)}
                                                >
                                                    <i className={categoryService.getCategoryIcon(category.title)}></i>
                                                    <span>{category.title}</span>
                                                    {category.subcategories && category.subcategories.length > 0 && (
                                                        <span className="subcategory-count">
                                                            {category.subcategories.length}
                                                        </span>
                                                    )}
                                                </Link>
                                                
                                                {category.subcategories && category.subcategories.length > 0 && (
                                                    <ul className="mega-menu-subcategories">
                                                        {category.subcategories.slice(0, 6).map((subcat) => (
                                                            <li key={subcat.id}>
                                                                <Link
                                                                    to={`/product?category=${subcat.id}`}
                                                                    onClick={() => setShowCategories(false)}
                                                                >
                                                                    <i className="fas fa-angle-right"></i>
                                                                    {subcat.title}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                        {category.subcategories.length > 6 && (
                                                            <li className="view-more">
                                                                <Link
                                                                    to={`/category/${category.id}`}
                                                                    onClick={() => setShowCategories(false)}
                                                                >
                                                                    <i className="fas fa-plus-circle"></i>
                                                                    Voir tout ({category.subcategories.length})
                                                                </Link>
                                                            </li>
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mega-menu-footer">
                                        <Link 
                                            to="/categories" 
                                            className="view-all-categories"
                                            onClick={() => setShowCategories(false)}
                                        >
                                            <i className="fas fa-grid"></i>
                                            Parcourir toutes les catégories
                                            <i className="fas fa-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="search-bar">
                            <SearchBar 
                                products={productState} 
                                placeholder={t('searchProducts')} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;