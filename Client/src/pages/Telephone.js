import './ProductCategory.css';
import { getProductImageUrl } from '../utils/imageHelper';
import React, { useEffect } from 'react';
import ReactStars from "react-rating-stars-component";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import { getAllProducts } from '../features/products/productSlice';
import Container from '../components/Container';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { RiEyeLine } from 'react-icons/ri';
import { addProdToCart, getUserCart, toggleProductWishlist } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import { useTranslation } from '../contexts/TranslationContext';

const Telephone = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const productState = useSelector((state) => state.product.product);
    const authState = useSelector(state => state?.auth?.auth); // Get authentication state

    useEffect(() => {
        dispatch(getAllBlogs());
        dispatch(getAllProducts());
        
        // Only fetch cart if user is authenticated
        if (authState) {
            dispatch(getUserCart());
        }
    }, [dispatch, authState]);

    const addToWish = async (id) => {
        // Vérifier l'authentification
        if (!authState) {
            toast.error(t('pleaseLoginForWishlist'));
            navigate('/login');
            return;
        }

        try {
            await dispatch(toggleProductWishlist(id)).unwrap();
            toast.success(t('wishlistUpdateSuccess'));
        } catch (error) {
            console.error("Erreur wishlist:", error);
            toast.error(error.message || "Erreur lors de la modification de la wishlist");
        }
    };

    const addToShoppingCart = (productId, color, price) => {
        // Vérifier les données d'entrée
        if (!productId || isNaN(parseFloat(price)) || !isFinite(price)) {
            return;
        }

        // Fixer la quantité à 1 pour chaque ajout au panier
        const quantity = 1;

        // Dispatch de l'action addProdToCart avec les données requises
        dispatch(addProdToCart({
            productId: productId,
            color: color || null, // Send null if no color provided
            quantity: quantity,
            price: price
        }));
    };

    const infoProducts = Array.isArray(productState) ? productState.filter(item => {
        const productCategory = item.category ? item.category.toString() : '';
        const productSubcategory = item.subcategory ? item.subcategory.toString() : '';
        return productCategory === '379' || productSubcategory === '379';
    }) : [];
    
    console.log('🔍 [Telephone] Filtrage:', {
        totalProducts: productState?.length || 0,
        filteredCount: infoProducts.length,
        categoryFilter: '379'
    });

    return (
        <Container class1='new-informatique-container py-5'>
            <h2 className='page-title'>Informatique et Tablettes</h2>
            <p className="product-count">{infoProducts.length} produits disponibles</p>
            <div className='new-informatique-grid'>
                {infoProducts.map((item, index) => (
                    <div key={index} className={"new-informatique-card"}>
                        <div className='new-informatique-card-inner'>
                            <div className='new-informatique-image' onClick={() => navigate("/product/" + (item?.slug || item?.id))} style={{ cursor: 'pointer' }}>
                                <img src={getProductImageUrl(item?.images)} alt="product" />
                            </div>
                            <div className='new-informatique-details'>
                                <h6 className='new-informatique-brand'>{item?.brand}</h6>
                                <h5 className='new-informatique-title'>{item?.title}</h5>
                                <ReactStars
                                    count={5}
                                    size={24}
                                    value={parseFloat(item?.totalrating)}
                                    edit={false}
                                    activeColor="#ffd700"
                                />
                                <p className='new-informatique-price'>{item?.price}</p>
                            </div>
                            <div className='new-informatique-actions'>
                                <button className='new-informatique-wishlist-button' onClick={() => addToWish(item?.id)}>
                                    <AiOutlineHeart size={24} />
                                </button>
                                <button className='new-informatique-cart-button' onClick={() => addToShoppingCart(item?.id, item?.color, item?.price)}>
                                    <AiOutlineShoppingCart size={24} />
                                </button>
                                <button className='new-informatique-view-button' onClick={() => navigate("/product/" + (item?.slug || item?.id))}>
                                    <RiEyeLine size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default Telephone;
