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
        const itemId = item.id || item.id;
        setAdding(prev => ({ ...prev, [itemId]: true }));
        try {
            // Normaliser les images pour garantir la cohérence dans le panier
            let images = item.images;
            if (!images && item.product) images = item.product.images;
            if (!images && item.image) images = item.image;
            const { getAllProductImageUrls } = require('../utils/imageHelper');
            const normalizedImages = getAllProductImageUrls(images);
            const cartData = {
                productId: itemId,
                quantity: 1,
                color: item.color || null,
                price: item.price,
                images: normalizedImages,
                imageUrl: normalizedImages[0]
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
                                        {safeWishlistState.map((item, index) => {
                  // Vérifications de sécurité
                  if (!item) return null;
                  const product = item.product || item;
                  if (!product) return null;

                  // Récupérer les images normalisées du backend
                  const images = product.images;
                  let imageUrl = null;

                  // Extraire la première image valide
                  if (Array.isArray(images) && images.length > 0) {
                    const firstImage = images[0];
                    if (typeof firstImage === 'string') {
                      imageUrl = firstImage;
                    } else if (firstImage && typeof firstImage === 'object') {
                      // Priorité: url > path > public_id
                      imageUrl = firstImage.url || firstImage.path || firstImage.public_id;
                    }
                  }
                  
                  // Vérifier que l'URL est valide
                  const showImage = !!imageUrl && 
                                   typeof imageUrl === 'string' && 
                                   imageUrl.trim() !== '' && 
                                   !imageUrl.includes('default-product') &&
                                   imageUrl !== 'null' &&
                                   imageUrl !== 'undefined';

                  const productTitle = product.title || 'Produit sans nom';
                  const productPrice = product.price || 0;
                  const productId = product.id || product.id;
                        </div>
                    </>
                )}
            </Container>
        </>
    );
};

export default Wishlist;
