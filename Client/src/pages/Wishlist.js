import React, { useEffect, useState } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../contexts/TranslationContext';
import { getUserProductWishlist, toggleProductWishlist, addProdToCart } from '../features/user/userSlice';
import { AiFillHeart, AiOutlineShoppingCart, AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductImageUrl } from '../utils/imageHelper';
import './Wishlist.css';

const Wishlist = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [removing, setRemoving] = useState({});
    const [adding, setAdding] = useState({});
    
    const authState = useSelector(state => state?.auth?.auth);

    useEffect(() => {
        if (authState) {
            dispatch(getUserProductWishlist());
        }
    }, [dispatch, authState]);

    const wishlistState = useSelector((state) => state.auth.wishlist);

    const removeFromWishlist = async (id) => {
        setRemoving(prev => ({ ...prev, [id]: true }));
        try {
            await dispatch(toggleProductWishlist(id)).unwrap();
            toast.success('Produit retiré de la wishlist');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        } finally {
            setRemoving(prev => ({ ...prev, [id]: false }));
        }
    };

    const addToCartFromWishlist = async (item) => {
        const itemId = item._id || item.id;
        setAdding(prev => ({ ...prev, [itemId]: true }));
        try {
            const cartData = {
                productId: itemId,
                quantity: 1,
                color: item.color || null,
                price: item.price
            };
            await dispatch(addProdToCart(cartData)).unwrap();
            toast.success('Produit ajouté au panier');
        } catch (error) {
            toast.error('Erreur lors de l\'ajout au panier');
        } finally {
            setAdding(prev => ({ ...prev, [itemId]: false }));
        }
    };

    return (
        <>
            <Meta title="Ma Wishlist - Mes Produits Favoris" />
            <BrandCrumb title="Ma Wishlist" />
            <Container class1="wishlist-wrapper home-wrapper-2 py-5">
                {!authState ? (
                    <div className="wishlist-empty-state">
                        <div className="empty-state-content">
                            <div className="empty-state-icon">
                                <AiFillHeart />
                            </div>
                            <h2 className="empty-state-title">Connectez-vous pour voir votre wishlist</h2>
                            <p className="empty-state-text">
                                Sauvegardez vos produits préférés et retrouvez-les à tout moment
                            </p>
                            <Link to="/login" className="btn-wishlist-primary">
                                <span>Se connecter</span>
                            </Link>
                        </div>
                    </div>
                ) : wishlistState && wishlistState.length === 0 ? (
                    <div className="wishlist-empty-state">
                        <div className="empty-state-content">
                            <div className="empty-state-icon empty">
                                <AiFillHeart />
                            </div>
                            <h2 className="empty-state-title">Votre wishlist est vide</h2>
                            <p className="empty-state-text">
                                Découvrez nos produits et ajoutez vos favoris en cliquant sur ❤️
                            </p>
                            <Link to="/product" className="btn-wishlist-primary">
                                <AiOutlineShoppingCart style={{ marginRight: '8px' }} />
                                <span>Découvrir nos produits</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="wishlist-header">
                            <h1 className="wishlist-title">
                                <AiFillHeart className="wishlist-title-icon" />
                                Ma Wishlist
                            </h1>
                            <p className="wishlist-count">
                                {wishlistState?.length || 0} {wishlistState?.length > 1 ? 'produits' : 'produit'}
                            </p>
                        </div>
                        <div className="row">
                        {wishlistState && wishlistState.map((item, index) => {
                            const itemId = item._id || item.id;
                            const imageUrl = getProductImageUrl(item?.images);
                            
                            // Debug log
                            if (index === 0) {
                                console.log('🖼️ Wishlist item images:', item?.images);
                                console.log('🖼️ Resolved imageUrl:', imageUrl);
                            }
                            
                            return (
                                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                                    <div className="wishlist-card-modern">
                                        <button
                                            onClick={() => removeFromWishlist(itemId)}
                                            className="wishlist-remove-btn"
                                            disabled={removing[itemId]}
                                            title="Retirer de la wishlist"
                                        >
                                            {removing[itemId] ? (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            ) : (
                                                <AiFillHeart />
                                            )}
                                        </button>

                                        <Link to={`/product/${item?.slug || itemId}`} className="wishlist-image-link">
                                            <div className="wishlist-image-container">
                                                <img
                                                    src={imageUrl}
                                                    alt={item?.title}
                                                    className="wishlist-product-image"
                                                    onError={(e) => {
                                                        e.target.src = '/images/default-product.jpg';
                                                    }}
                                                />
                                                <div className="wishlist-image-overlay">
                                                    <span>Voir le produit</span>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="wishlist-card-body">
                                            <Link to={`/product/${item?.slug || itemId}`} className="wishlist-product-link">
                                                <h3 className="wishlist-product-title" title={item?.title}>
                                                    {item?.title}
                                                </h3>
                                            </Link>
                                            
                                            {item?.brand && (
                                                <p className="wishlist-product-brand">{item.brand}</p>
                                            )}
                                            
                                            <div className="wishlist-price-section">
                                                <span className="wishlist-price">
                                                    {item?.price?.toFixed(2)} TND
                                                </span>
                                                {item?.oldPrice && (
                                                    <span className="wishlist-old-price">
                                                        {item.oldPrice.toFixed(2)} TND
                                                    </span>
                                                )}
                                            </div>

                                            <button 
                                                className="btn-add-to-cart-wishlist"
                                                onClick={() => addToCartFromWishlist(item)}
                                                disabled={adding[itemId]}
                                            >
                                                {adding[itemId] ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Ajout...
                                                    </>
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
                        })}
                        </div>
                    </>
                )}
            </Container>
        </>
    );
};

export default Wishlist;
