
import React, { useEffect,useState } from 'react';
import Marquee from "react-fast-marquee";
import BlogCard from '../components/BlogCard';
import ProductCard from '../components/ProductCard';
import Container from '../components/Container';
import { addProdToCart } from '../features/user/userSlice';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import des icônes de flèche
import ReactStars from "react-rating-stars-component";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import moment from "moment";
import { getAllProducts } from '../features/products/productSlice';
import { addToWishlist } from '../features/products/productSlice';
import { Carousel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { RiEyeLine } from 'react-icons/ri';
import {  getUserCart } from '../features/user/userSlice';
const ProductCard1 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product.product);
  useEffect(() => {
      dispatch(getAllBlogs());
      dispatch(getAllProducts());
      dispatch(getUserCart());
  }, [dispatch]);
  const addToWish = (id) => {
      dispatch(addToWishlist(id));
  };
  
  const addToShoppingCart = (productId, color=null, price) => {
      // Vérifier les données d'entrée
      if (!productId || !color || isNaN(parseFloat(price)) || !isFinite(price)) {
          return;
      }
      // Fixer la quantité à 1 pour chaque ajout au panier
      const quantity = 1;
      // Dispatch de l'action addProdToCart avec les données requises
      dispatch(addProdToCart({
          productId: productId,
          color: color,
          quantity: quantity,
          price: price
      }));
  };
  const infoProducts = Array.isArray(productState) ? productState : [];
  return (
    <Container className='popular-wrapper py-5 home-wrapper-2'>
                <div className='new-informatique-grid'>
                    {infoProducts.map((item, index) => (
                        <div key={index} className={"new-informatique-card"}>
                            <div className='new-informatique-card-inner'>
                                <div className='new-informatique-image' onClick={() => navigate("/product/" + (item?.slug || item?._id))} style={{ cursor: 'pointer' }}>
                                    <img src={item?.images[0]?.url} alt="product" />
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
                                    <button className='new-informatique-wishlist-button' onClick={() => addToWish(item?._id)}>
                                        <AiOutlineHeart size={24} />
                                    </button>
                                    <button className='new-informatique-cart-button' onClick={() => addToShoppingCart(item?._id, item?.color, item?.price)}>
                                        <AiOutlineShoppingCart size={24} />
                                    </button>
                                    <button className='new-informatique-view-button' onClick={() => navigate("/product/" + (item?.slug || item?._id))}>
                                        <RiEyeLine size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
    
    
          </Container>
  );
};
export default ProductCard1;