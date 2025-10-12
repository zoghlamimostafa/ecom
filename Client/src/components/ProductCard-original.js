import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";
import { addProdToCart, toggleProductWishlist } from '../features/user/userSlice';
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart, AiOutlineEye } from 'react-icons/ai';

const ProductCard = ({ data, gridView = true }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Vérifier si l'utilisateur est connecté
    const authState = useSelector(state => state.auth);
    const isAuthenticated = authState?.user;
    const wishlistState = useSelector(state => state.auth?.wishlist);
    
    // Vérifier si le produit est dans la wishlist
    const isInWishlist = wishlistState?.find(item => item._id === data?._id);
    
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        if (data?._id) {
            dispatch(addProdToCart({
                productId: data._id,
                quantity: 1,
                color: null,
                price: data.price
            }));
        }
    };

    const handleAddToWishlist = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        if (data?._id) {
            dispatch(toggleProductWishlist(data._id));
        }
    };

    const handleViewProduct = () => {
        if (data?._id) {
            navigate(`/product/${data._id}`);
        }
    };

    if (!data) return null;

    return (
        <div className={`product-card ${gridView ? 'grid-view' : 'list-view'}`}>
            <div className="product-card-inner">
                {/* Image du produit */}
                <div className="product-image-wrapper">
                    <img 
                        src={data.images && data.images[0] ? data.images[0].url : '/images/default-product.jpg'} 
                        alt={data.title || 'Produit'}
                        className="product-image"
                        onClick={handleViewProduct}
                    />
                    
                    {/* Overlay avec boutons d'action */}
                    <div className="product-overlay">
                        <div className="product-actions">
                            <button 
                                className={`action-btn wishlist ${isInWishlist ? 'active' : ''}`}
                                onClick={handleAddToWishlist}
                                title={isInWishlist ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
                            >
                                {isInWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
                            </button>
                            
                            <button 
                                className="action-btn cart"
                                onClick={handleAddToCart}
                                title="Ajouter au panier"
                            >
                                <AiOutlineShoppingCart />
                            </button>
                            
                            <button 
                                className="action-btn view"
                                onClick={handleViewProduct}
                                title="Voir le produit"
                            >
                                <AiOutlineEye />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Informations du produit */}
                <div className="product-info">
                    <div className="product-brand">
                        {data.brand || 'Marque'}
                    </div>
                    
                    <h3 className="product-title" onClick={handleViewProduct}>
                        {data.title || 'Titre du produit'}
                    </h3>
                    
                    <div className="product-rating">
                        <ReactStars
                            count={5}
                            size={16}
                            value={data.totalRating || 0}
                            edit={false}
                            activeColor="#ffd700"
                        />
                    </div>
                    
                    <div className="product-price">
                        {data.price ? `${data.price} DH` : 'Prix non disponible'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;