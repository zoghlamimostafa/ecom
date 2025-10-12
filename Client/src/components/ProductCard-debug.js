// Debug ProductCard - Version améliorée avec logs détaillés
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from '../features/products/productSlice';
import { addProdToCart } from '../features/user/userSlice';
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useTranslation } from '../contexts/TranslationContext';

const ProductCard = ({ data, gridView = true }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    
    // DEBUG: Log des données reçues
    console.log('🔍 ProductCard DEBUG:', {
        data,
        gridView,
        dataKeys: data ? Object.keys(data) : 'no data'
    });
    
    // Obtenir l'état utilisateur pour vérifier l'authentification
    const authState = useSelector(state => state.auth);
    const isAuthenticated = authState?.auth?.token;
    const wishlistState = useSelector(state => state.product?.wishlist);
    
    // DEBUG: Log de l'authentification
    console.log('🔐 Auth DEBUG:', {
        authState,
        isAuthenticated: !!isAuthenticated,
        token: isAuthenticated ? 'Present' : 'Missing',
        wishlistCount: wishlistState?.length || 0
    });

    if (!data) {
        console.log('❌ ProductCard: No data provided');
        return null;
    }

    // Normaliser les données pour gérer à la fois 'id' et '_id'
    const productId = data._id || data.id;
    let { title, brand, totalrating, price, images, slug, description, tags, color } = data;

    // DEBUG: Log des données normalisées
    console.log('📦 Product Data DEBUG:', {
        productId,
        title,
        brand,
        price,
        slug,
        hasImages: !!images,
        imagesType: typeof images
    });

    // Normaliser les images si nécessaire (double protection)
    if (typeof images === 'string' && images !== 'null' && images !== '') {
        try {
            images = JSON.parse(images);
            console.log('🖼️ Images parsed from string:', images);
        } catch (e) {
            console.warn('❌ Erreur parsing images dans ProductCard:', title, e);
            images = [];
        }
    }
    
    if (!Array.isArray(images)) {
        console.log('⚠️ Images is not an array, converting:', images);
        images = [];
    }

    // Normaliser les couleurs si nécessaire
    if (typeof color === 'string' && color !== 'null' && color !== '') {
        try {
            color = JSON.parse(color);
        } catch (e) {
            console.warn('❌ Erreur parsing couleurs dans ProductCard:', title, e);
            color = [];
        }
    }
    
    if (!Array.isArray(color)) {
        color = [];
    }

    // Vérifier si le produit est dans la wishlist
    const isInWishlist = wishlistState?.some(item => (item._id || item.id) === productId);
    console.log('❤️ Wishlist status:', {
        productId,
        isInWishlist,
        wishlistItems: wishlistState?.map(item => item._id || item.id)
    });

    const handleAddToCart = async () => {
        console.log('🛒 ADD TO CART clicked for:', { productId, title, price });
        
        if (!isAuthenticated) {
            console.log('❌ Not authenticated, redirecting to login');
            toast.error("Veuillez vous connecter pour ajouter au panier");
            navigate('/login');
            return;
        }

        if (!productId || !price) {
            console.log('❌ Missing product data:', { productId, price });
            toast.error("Informations produit manquantes");
            return;
        }

        setIsLoading(true);
        try {
            const cartData = {
                productId: productId,
                quantity: 1,
                price: parseFloat(price),
                // Ajout des informations supplémentaires pour l'affichage
                title: title,
                images: images
            };

            console.log('📦 Dispatching addProdToCart with:', cartData);
            const result = await dispatch(addProdToCart(cartData)).unwrap();
            console.log('✅ Cart success result:', result);
            toast.success(t('productAddedToCart'));
        } catch (error) {
            console.error("❌ Error adding to cart:", error);
            console.error("❌ Error details:", {
                message: error.message,
                response: error.response,
                stack: error.stack
            });
            toast.error(error.message || "Erreur lors de l'ajout au panier");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToWishlist = async () => {
        console.log('❤️ ADD TO WISHLIST clicked for:', { productId, title });
        
        if (!isAuthenticated) {
            console.log('❌ Not authenticated, redirecting to login');
            toast.error(t('pleaseLoginForWishlist'));
            navigate('/login');
            return;
        }

        if (!productId) {
            console.log('❌ Missing productId:', productId);
            toast.error("ID produit manquant");
            return;
        }

        setIsWishlistLoading(true);
        try {
            console.log('📦 Dispatching addToWishlist with:', productId);
            const result = await dispatch(addToWishlist(productId)).unwrap();
            console.log('✅ Wishlist success result:', result);
            if (isInWishlist) {
                toast.success(t('productRemovedFromWishlist'));
            } else {
                toast.success(t('productAddedToWishlist'));
            }
        } catch (error) {
            console.error("❌ Error adding to wishlist:", error);
            console.error("❌ Wishlist error details:", {
                message: error.message,
                response: error.response,
                stack: error.stack
            });
            toast.error(error.message || t('wishlistError'));
        } finally {
            setIsWishlistLoading(false);
        }
    };

    const handleViewProduct = (e) => {
        console.log('👁️ VIEW PRODUCT clicked for:', { productId, title, slug });
        
        // Empêcher la propagation pour éviter les conflits d'événements
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Utiliser le slug en priorité, sinon l'ID
        const productIdentifier = slug || productId;
        console.log('🔗 Navigation data:', {
            title,
            slug,
            productId,
            productIdentifier,
            navigateTo: `/product/${productIdentifier}`
        });
        
        if (productIdentifier) {
            console.log('✅ Navigating to:', `/product/${productIdentifier}`);
            navigate(`/product/${productIdentifier}`);
        } else {
            console.error('❌ No product identifier found:', { title, slug, productId, data });
            toast.error(t('cannotDisplayProduct'));
        }
    };

    // DEBUG: Log final avant render
    console.log('🎨 ProductCard render data:', {
        productId,
        title,
        price,
        imageUrl: images?.[0]?.url,
        isInWishlist,
        isAuthenticated,
        isLoading,
        isWishlistLoading
    });

    if (!gridView) {
        // Vue liste améliorée avec debug
        return (
            <div className="modern-product-card-list" onClick={() => console.log('📋 List card clicked')}>
                <div className="row align-items-center g-3">
                    <div className="col-md-3 col-sm-4">
                        <div className="modern-product-image-list">
                            <img 
                                src={images?.[0]?.url || 'https://via.placeholder.com/300'} 
                                alt={title} 
                                onClick={(e) => {
                                    console.log('🖼️ List image clicked');
                                    handleViewProduct(e);
                                }}
                                style={{ cursor: 'pointer' }}
                                onError={(e) => console.log('❌ Image load error:', e.target.src)}
                            />
                            {tags?.includes('special') && <span className="special-badge">{t('specialBadge')}</span>}
                            {tags?.includes('featured') && <span className="featured-badge">{t('featuredBadge')}</span>}
                        </div>
                    </div>
                    <div className="col-md-6 col-sm-8">
                        <div className="modern-product-details-list">
                            <div className="product-brand">{brand}</div>
                            <h5 className="modern-product-title" 
                                onClick={(e) => {
                                    console.log('📝 List title clicked');
                                    handleViewProduct(e);
                                }} 
                                style={{ cursor: 'pointer' }}
                            >
                                {title}
                            </h5>
                            <div className="product-rating">
                                <ReactStars
                                    count={5}
                                    value={Number(totalrating) || 0}
                                    edit={false}
                                    size={18}
                                    activeColor="#FF6F00"
                                />
                                <span className="rating-text">({totalrating || 0})</span>
                            </div>
                            <p className="modern-product-description">
                                {description?.substring(0, 120)}...
                            </p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="modern-product-actions-list">
                            <div className="modern-price-section">
                                <span className="modern-price">{parseFloat(price || 0).toFixed(2)} TND</span>
                            </div>
                            <div className="modern-action-buttons">
                                <button 
                                    className={`modern-action-btn wishlist ${isInWishlist ? 'active' : ''}`}
                                    onClick={(e) => {
                                        console.log('❤️ List wishlist button clicked');
                                        e.stopPropagation();
                                        handleAddToWishlist();
                                    }}
                                    disabled={isWishlistLoading}
                                    title={isInWishlist ? t('removeFromWishlistTooltip') : t('addToWishlistTooltip')}
                                >
                                    {isWishlistLoading ? (
                                        <div className="spinner-mini">⏳</div>
                                    ) : isInWishlist ? (
                                        <AiFillHeart />
                                    ) : (
                                        <AiOutlineHeart />
                                    )}
                                </button>
                                <button 
                                    className="modern-action-btn view" 
                                    onClick={(e) => {
                                        console.log('👁️ List view button clicked');
                                        e.stopPropagation();
                                        handleViewProduct(e);
                                    }} 
                                    title={t('viewProduct')}
                                >
                                    <AiOutlineEye />
                                </button>
                            </div>
                            <button 
                                className="modern-btn-cart-list" 
                                onClick={(e) => {
                                    console.log('🛒 List cart button clicked');
                                    e.stopPropagation();
                                    handleAddToCart();
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="spinner-mini">⏳</div>
                                ) : (
                                    <>
                                        <AiOutlineShoppingCart />
                                        <span>{t('addButtonText')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Vue grille moderne avec debug
    return (
        <div className="modern-product-card" onClick={() => console.log('📄 Grid card clicked')}>
            <div className="modern-product-image">
                <img 
                    src={images?.[0]?.url || 'https://via.placeholder.com/300'} 
                    alt={title} 
                    onClick={(e) => {
                        console.log('🖼️ Grid image clicked');
                        handleViewProduct(e);
                    }}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => console.log('❌ Image load error:', e.target.src)}
                />
                {tags?.includes('special') && <span className="special-badge">{t('specialBadge')}</span>}
                {tags?.includes('featured') && <span className="featured-badge">{t('featuredBadge')}</span>}
                <div className="modern-product-overlay">
                    <button 
                        className={`modern-overlay-btn wishlist ${isInWishlist ? 'active' : ''}`}
                        onClick={(e) => {
                            console.log('❤️ Grid overlay wishlist clicked');
                            e.stopPropagation();
                            handleAddToWishlist();
                        }}
                        disabled={isWishlistLoading}
                        title={isInWishlist ? t('removeFromWishlistTooltip') : t('addToWishlistTooltip')}
                    >
                        {isWishlistLoading ? (
                            <div className="spinner-mini">⏳</div>
                        ) : isInWishlist ? (
                            <AiFillHeart />
                        ) : (
                            <AiOutlineHeart />
                        )}
                    </button>
                    <button 
                        className="modern-overlay-btn view" 
                        onClick={(e) => {
                            console.log('👁️ Grid overlay view clicked');
                            e.stopPropagation();
                            handleViewProduct(e);
                        }} 
                        title={t('viewProduct')}
                    >
                        <AiOutlineEye />
                    </button>
                </div>
            </div>
            <div className="modern-product-details">
                <div className="product-brand">{brand}</div>
                <h5 className="modern-product-title" 
                    onClick={(e) => {
                        console.log('📝 Grid title clicked');
                        handleViewProduct(e);
                    }} 
                    style={{ cursor: 'pointer' }}
                >
                    {title}
                </h5>
                <div className="product-rating">
                    <ReactStars
                        count={5}
                        value={Number(totalrating) || 0}
                        edit={false}
                        size={20}
                        activeColor="#FF6F00"
                    />
                    <span className="rating-text">({totalrating || 0})</span>
                </div>
                <div className="modern-price-section">
                    <span className="modern-price">{parseFloat(price || 0).toFixed(2)} TND</span>
                </div>
                <button 
                    className="modern-btn-add-cart" 
                    onClick={(e) => {
                        console.log('🛒 Grid main cart button clicked');
                        e.stopPropagation();
                        handleAddToCart();
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="spinner-mini">⏳</div>
                    ) : (
                        <>
                            <AiOutlineShoppingCart className="me-2" />
                            {t('addToCartText')}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;