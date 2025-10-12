// Composant ProductCard Moderne et Optimisé
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";
import { addProdToCart, toggleProductWishlist } from '../features/user/userSlice';
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useTranslation } from '../contexts/TranslationContext';

const ProductCard = ({ data, gridView = true }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // États optimisés
    const [isLoading, setIsLoading] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    // Sélecteurs Redux optimisés
    const authState = useSelector(state => state.auth);
    const isAuthenticated = useMemo(() => !!authState?.auth?.token, [authState?.auth?.token]);
    const wishlistState = useSelector(state => state.auth?.wishlist);
    
    // Normalisation des données avec useMemo pour éviter recalculs
    const productData = useMemo(() => {
        if (!data) return null;
        
        const productId = data._id || data.id;
        let { title, brand, totalrating, price, images, slug, description, tags, color, category } = data;
        
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
            title: title || 'Produit sans nom',
            brand: brand || 'Marque inconnue',
            totalrating: totalrating || 0,
            price: parseFloat(price || 0),
            images,
            slug,
            description: description || '',
            tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
            color,
            category: category || ''
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
            toast.error(t('loginRequired') || 'Veuillez vous connecter');
            navigate('/login');
            return;
        }
        
        if (!productData?.productId || !productData?.price) {
            toast.error(t('error') || 'Erreur');
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
            toast.success(t('productAddedToCart') || 'Produit ajouté au panier');
        } catch (error) {
            console.error("❌ Error adding to cart:", error);
            toast.error(error.message || t('error') || 'Erreur');
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, productData, dispatch, navigate, t]);
    
    const handleAddToWishlist = useCallback(async (e) => {
        e?.stopPropagation();
        
        if (!isAuthenticated) {
            toast.error(t('loginRequired') || 'Veuillez vous connecter');
            navigate('/login');
            return;
        }
        
        if (!productData?.productId) {
            toast.error(t('error') || 'Erreur');
            return;
        }
        
        setIsWishlistLoading(true);
        try {
            await dispatch(toggleProductWishlist(productData.productId)).unwrap();
            
            if (isInWishlist) {
                toast.success(t('productRemovedFromWishlist') || 'Produit retiré des favoris');
            } else {
                toast.success(t('productAddedToWishlist') || 'Produit ajouté aux favoris');
            }
        } catch (error) {
            console.error("❌ Error with wishlist:", error);
            toast.error(error.message || t('error') || 'Erreur');
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

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);
    
    // Early return si pas de données (après les hooks)
    if (!productData) return null;

    // Image par défaut si erreur ou pas d'image
    const getImageUrl = () => {
        if (imageError || !productData.images?.[0]?.url) {
            return 'https://via.placeholder.com/300x300/f8f9fa/6c757d?text=Image+non+disponible';
        }
        return productData.images[0].url;
    };

    // Format des badges
    const renderBadges = () => {
        const badges = [];
        if (productData.tags?.includes('special')) {
            badges.push(<span key="special" className="product-badge badge-special">🔥 Spécial</span>);
        }
        if (productData.tags?.includes('featured')) {
            badges.push(<span key="featured" className="product-badge badge-featured">⭐ Vedette</span>);
        }
        if (productData.tags?.includes('new')) {
            badges.push(<span key="new" className="product-badge badge-new">🆕 Nouveau</span>);
        }
        if (productData.tags?.includes('sale')) {
            badges.push(<span key="sale" className="product-badge badge-sale">💰 Promo</span>);
        }
        return badges;
    };
    
    if (!gridView) {
        // Vue liste moderne et responsive
        return (
            <div className="modern-product-card-list">
                <div className="product-list-container">
                    <div className="product-image-section">
                        <div className="product-image-wrapper">
                            <img 
                                src={getImageUrl()}
                                alt={productData.title} 
                                onClick={handleViewProduct}
                                onError={handleImageError}
                                className="product-image"
                                loading="lazy"
                            />
                            <div className="product-badges">
                                {renderBadges()}
                            </div>
                            <div className="product-quick-actions">
                                <button 
                                    className={`quick-action-btn wishlist ${isInWishlist ? 'active' : ''}`}
                                    onClick={handleAddToWishlist}
                                    disabled={isWishlistLoading}
                                    title={isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                >
                                    {isWishlistLoading ? '⏳' : isInWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
                                </button>
                                <button 
                                    className="quick-action-btn view" 
                                    onClick={handleViewProduct}
                                    title="Voir les détails"
                                >
                                    <AiOutlineEye />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="product-content-section">
                        <div className="product-meta">
                            <span className="product-brand">{productData.brand}</span>
                            {productData.category && <span className="product-category">{productData.category}</span>}
                        </div>
                        
                        <h3 className="product-title" onClick={handleViewProduct}>
                            {productData.title}
                        </h3>

                        <div className="product-rating-section">
                            <ReactStars
                                count={5}
                                value={Number(productData.totalrating) || 0}
                                edit={false}
                                size={18}
                                activeColor="#FF6F00"
                            />
                            <span className="rating-text">({productData.totalrating || 0})</span>
                        </div>

                        <p className="product-description">
                            {productData.description?.substring(0, 120)}{productData.description?.length > 120 ? '...' : ''}
                        </p>

                        <div className="product-price-section">
                            <span className="product-price">{productData.price.toFixed(2)} TND</span>
                        </div>

                        <button 
                            className="add-to-cart-btn modern"
                            onClick={handleAddToCart}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>⏳ Ajout...</>
                            ) : (
                                <>
                                    <AiOutlineShoppingCart />
                                    <span>Ajouter au panier</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Vue grille moderne et responsive
    return (
        <div className="modern-product-card-grid">
            <div className="product-card-container">
                <div className="product-image-section">
                    <div className="product-image-wrapper">
                        <img 
                            src={getImageUrl()}
                            alt={productData.title} 
                            onClick={handleViewProduct}
                            onError={handleImageError}
                            className="product-image"
                            loading="lazy"
                        />
                        <div className="product-badges">
                            {renderBadges()}
                        </div>
                        <div className="product-overlay">
                            <div className="overlay-actions">
                                <button 
                                    className={`overlay-btn wishlist ${isInWishlist ? 'active' : ''}`}
                                    onClick={handleAddToWishlist}
                                    disabled={isWishlistLoading}
                                    title={isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                >
                                    {isWishlistLoading ? '⏳' : isInWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
                                </button>
                                <button 
                                    className="overlay-btn view" 
                                    onClick={handleViewProduct}
                                    title="Voir les détails"
                                >
                                    <AiOutlineEye />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="product-content-section">
                    <div className="product-meta">
                        <span className="product-brand">{productData.brand}</span>
                        {productData.category && <span className="product-category">{productData.category}</span>}
                    </div>
                    
                    <h3 className="product-title" onClick={handleViewProduct}>
                        {productData.title}
                    </h3>

                    <div className="product-rating-section">
                        <ReactStars
                            count={5}
                            value={Number(productData.totalrating) || 0}
                            edit={false}
                            size={16}
                            activeColor="#FF6F00"
                        />
                        <span className="rating-text">({productData.totalrating || 0})</span>
                    </div>

                    <div className="product-price-section">
                        <span className="product-price">{productData.price.toFixed(2)} TND</span>
                    </div>

                    <button 
                        className="add-to-cart-btn modern"
                        onClick={handleAddToCart}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>⏳ Ajout...</>
                        ) : (
                            <>
                                <AiOutlineShoppingCart />
                                <span>Ajouter</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductCard);