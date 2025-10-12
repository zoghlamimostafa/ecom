// Optimisation Performance - ProductCard Ultra Rapide
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";
import { addProdToCart, toggleProductWishlist } from '../features/user/userSlice';
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useTranslation } from '../contexts/TranslationContext';

const ProductCardFast = ({ data, gridView = true }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // États optimisés
    const [isLoading, setIsLoading] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    
    // Sélecteurs Redux optimisés
    const authState = useSelector(state => state.auth);
    const isAuthenticated = useMemo(() => !!authState?.auth?.token, [authState?.auth?.token]);
    const wishlistState = useSelector(state => state.auth?.wishlist);
    
    // Normalisation des données avec useMemo pour éviter recalculs
    const productData = useMemo(() => {
        if (!data) return null;
        
        const productId = data._id || data.id;
        let { title, brand, totalrating, price, images, slug, description, tags, color } = data;
        
        // Normaliser images
        if (typeof images === 'string' && images !== 'null' && images !== '') {
            try {
                images = JSON.parse(images);
            } catch (e) {
                images = [];
            }
        }
        if (!Array.isArray(images)) images = [];
        
        // Normaliser couleurs
        if (typeof color === 'string' && color !== 'null' && color !== '') {
            try {
                color = JSON.parse(color);
            } catch (e) {
                color = [];
            }
        }
        if (!Array.isArray(color)) color = [];
        
        return {
            productId,
            title,
            brand,
            totalrating,
            price: parseFloat(price || 0),
            images,
            slug,
            description,
            tags,
            color
        };
    }, [data]);
    
    // Vérifier wishlist optimisé
    const isInWishlist = useMemo(() => {
        if (!productData?.productId || !wishlistState) return false;
        return wishlistState.some(item => (item._id || item.id) === productData.productId);
    }, [productData?.productId, wishlistState]);
    
    // Handlers optimisés avec useCallback
    const handleAddToCart = useCallback(async (e) => {
        e?.stopPropagation();
        
        if (!isAuthenticated) {
            toast.error(t('loginRequired'));
            navigate('/login');
            return;
        }
        
        if (!productData?.productId || !productData?.price) {
            toast.error(t('error'));
            return;
        }
        
        setIsLoading(true);
        try {
            const cartData = {
                productId: productData.productId,
                quantity: 1,
                price: productData.price,
                title: productData.title,
                images: productData.images
            };
            
            await dispatch(addProdToCart(cartData)).unwrap();
            toast.success(t('productAddedToCart'));
        } catch (error) {
            console.error("❌ Error adding to cart:", error);
            toast.error(error.message || t('error'));
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, productData, dispatch, navigate, t]);
    
    const handleAddToWishlist = useCallback(async (e) => {
        e?.stopPropagation();
        
        if (!isAuthenticated) {
            toast.error(t('loginRequired'));
            navigate('/login');
            return;
        }
        
        if (!productData?.productId) {
            toast.error(t('error'));
            return;
        }
        
        setIsWishlistLoading(true);
        try {
            await dispatch(toggleProductWishlist(productData.productId)).unwrap();
            
            if (isInWishlist) {
                toast.success(t('productRemovedFromWishlist'));
            } else {
                toast.success(t('productAddedToWishlist'));
            }
        } catch (error) {
            console.error("❌ Error with wishlist:", error);
            toast.error(error.message || t('error'));
        } finally {
            setIsWishlistLoading(false);
        }
    }, [isAuthenticated, productData?.productId, isInWishlist, dispatch, navigate, t]);
    
    const handleViewProduct = useCallback((e) => {
        e?.preventDefault();
        e?.stopPropagation();
        
        const productIdentifier = productData?.slug || productData?.productId;
        if (productIdentifier) {
            navigate(`/product/${productIdentifier}`);
        } else {
            toast.error("Impossible d'afficher ce produit");
        }
    }, [productData?.slug, productData?.productId, navigate]);
    
    // Early return si pas de données
    if (!productData) return null;
    
    // Composant bouton optimisé
    const WishlistButton = useCallback(() => (
        <button 
            className={`modern-overlay-btn wishlist ${isInWishlist ? 'active' : ''}`}
            onClick={handleAddToWishlist}
            disabled={isWishlistLoading}
            title={isInWishlist ? t('removeFromWishlistTitle') : t('addToWishlistTitle')}
            style={{ transition: 'all 0.1s ease' }}
        >
            {isWishlistLoading ? '⏳' : isInWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>
    ), [isInWishlist, isWishlistLoading, handleAddToWishlist, t]);
    
    const CartButton = useCallback(() => (
        <button 
            className="modern-btn-add-cart" 
            onClick={handleAddToCart}
            disabled={isLoading}
            style={{ transition: 'all 0.1s ease' }}
        >
            {isLoading ? '⏳' : (
                <>
                    <AiOutlineShoppingCart className="me-2" />
                    {t('addToCart')}
                </>
            )}
        </button>
    ), [isLoading, handleAddToCart, t]);
    
    if (!gridView) {
        // Vue liste optimisée
        return (
            <div className="modern-product-card-list">
                <div className="row align-items-center g-3">
                    <div className="col-md-3 col-sm-4">
                        <div className="modern-product-image-list">
                            <img 
                                src={productData.images?.[0]?.url || 'https://via.placeholder.com/300'} 
                                alt={productData.title} 
                                onClick={handleViewProduct}
                                style={{ cursor: 'pointer' }}
                                loading="lazy"
                            />
                            {productData.tags?.includes('special') && <span className="special-badge">Spécial</span>}
                            {productData.tags?.includes('featured') && <span className="featured-badge">Vedette</span>}
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-8">
                        <div className="modern-product-details-list">
                            <div className="product-brand">{productData.brand}</div>
                            <h5 className="modern-product-title" onClick={handleViewProduct} style={{ cursor: 'pointer' }}>
                                {productData.title}
                            </h5>
                            <div className="product-rating">
                                <ReactStars
                                    count={5}
                                    value={Number(productData.totalrating) || 0}
                                    edit={false}
                                    size={18}
                                    activeColor="#FF6F00"
                                />
                                <span className="rating-text">({productData.totalrating || 0})</span>
                            </div>
                            <p className="modern-product-description">
                                {productData.description?.substring(0, 120)}...
                            </p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="modern-product-actions-list">
                            <div className="modern-price-section">
                                <span className="modern-price">{productData.price.toFixed(2)} TND</span>
                            </div>
                            <div className="modern-action-buttons">
                                <WishlistButton />
                                <button 
                                    className="modern-action-btn view" 
                                    onClick={handleViewProduct}
                                    title={t('viewProduct')}
                                >
                                    <AiOutlineEye />
                                </button>
                            </div>
                            <CartButton />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Vue grille optimisée
    return (
        <div className="modern-product-card">
            <div className="modern-product-image">
                <img 
                    src={productData.images?.[0]?.url || 'https://via.placeholder.com/300'} 
                    alt={productData.title} 
                    onClick={handleViewProduct}
                    style={{ cursor: 'pointer' }}
                    loading="lazy"
                />
                {productData.tags?.includes('special') && <span className="special-badge">Spécial</span>}
                {productData.tags?.includes('featured') && <span className="featured-badge">Vedette</span>}
                <div className="modern-product-overlay">
                    <WishlistButton />
                    <button 
                        className="modern-overlay-btn view" 
                        onClick={handleViewProduct}
                        title={t('viewProduct')}
                    >
                        <AiOutlineEye />
                    </button>
                </div>
            </div>
            <div className="modern-product-details">
                <div className="product-brand">{productData.brand}</div>
                <h5 className="modern-product-title" onClick={handleViewProduct} style={{ cursor: 'pointer' }}>
                    {productData.title}
                </h5>
                <div className="product-rating">
                    <ReactStars
                        count={5}
                        value={Number(productData.totalrating) || 0}
                        edit={false}
                        size={20}
                        activeColor="#FF6F00"
                    />
                    <span className="rating-text">({productData.totalrating || 0})</span>
                </div>
                <div className="modern-price-section">
                    <span className="modern-price">{productData.price.toFixed(2)} TND</span>
                </div>
                <CartButton />
            </div>
        </div>
    );
};

export default React.memo(ProductCardFast);