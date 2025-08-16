import React, { useEffect,useState } from 'react';
import Marquee from "react-fast-marquee";
import BlogCard from '../components/BlogCard';
import ProductCard from '../components/ProductCard';
import SpecialProduct from '../components/SpecialProduct';
import Container from '../components/Container';
import servicesData from '../utils/Data';
import servicesData1 from '../utils/Data1';
import ServiceItem from '../utils/ServiceItem';
import brand1 from '../images/brand-01.png';
import brand2 from '../images/brand-02.png';
import brand3 from '../images/brand-03.png';
import brand4 from '../images/brand-04.png';
import brand5 from '../images/brand-05.png';
import brand6 from '../images/brand-06.png';
import brand7 from '../images/brand-07.png';
import brand8 from '../images/brand-08.png';
import wish from "../images/wish.svg"
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

const Home = (props) => {

  const navigate=useNavigate();
  const dispatch = useDispatch();
  const handleAddToCart = (id) => {
    // Dispatch addProdToCart action with product id
    dispatch(addProdToCart(id));
    // Show toast message
    toast.success('Product added to cart!');
  };
  const productState = useSelector((state) => state.product.product);
  const authState = useSelector(state => state?.auth?.auth); // Get authentication state

  
  const [index, setIndex] = useState(0);

useEffect(() => {
  dispatch(getAllBlogs());
  dispatch(getAllProducts());
  
  // Only fetch cart if user is authenticated
  if (authState) {
    dispatch(getUserCart());
  }
}, [dispatch, authState]);

const addToWish = (id) => {
  dispatch(addToWishlist(id));
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

const infoProducts = Array.isArray(productState) ? productState.filter(item => item.tags && item.tags.includes && item.tags.includes("supermarcher")) : [];

const infoProducts1 = Array.isArray(productState) ? productState.filter(item => item.tags && item.tags.includes && item.tags.includes("featured")) : [];

const infoProducts3 = Array.isArray(productState) ? productState.filter(item => item.tags && item.tags.includes && item.tags.includes("special")) : [];

const infoProducts4 = Array.isArray(productState) ? productState.filter(item => item.tags && item.tags.includes && item.tags.includes("popular")) : [];


  // Tableau des URL des images
  const images = [
    "https://img.freepik.com/photos-gratuite/vue-face-du-panier-achat-cyber-lundi-sacs-espace-copie_23-2148657638.jpg?t=st=1708866541~exp=1708870141~hmac=438a8f7d6d5a63b420b6b75f2aa41ce4a02660d4b69606a9b0b464eb3fe",
    "https://img.freepik.com/photos-gratuite/montrant-panier-chariot-shopping-ligne-signe-graphique_53876-133967.jpg?w=996&t=st=1709174608~exp=1709175208~hmac=abbdec379ff698261f69e28faced7393fe84ec5c8c5f84608b1f2ec06a78a243",
    "https://img.freepik.com/photos-gratuite/vue-face-du-concept-magasinage-ligne_23-2148625664.jpg?w=996&t=st=1709174684~exp=1709175284~hmac=145c7d9e32d85f61a2a801bb59d8417a9198e57fbd365c465f3c0c7e5d3a408e",
    // Ajoutez plus d'URL d'images au besoin
  ];

  // Fonction pour afficher l'image suivante dans le carrousel
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    // Ajoutez un délai en millisecondes pour ajuster la vitesse de l'animation
    setTimeout(() => {
      // Votre code ici, par exemple : setCurrentSlide(selectedIndex);
    }, 1000); // 1000ms équivaut à 1 seconde, ajustez selon vos besoins
  };
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? servicesData1.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === servicesData1.length - 1 ? 0 : prevIndex + 1));
  };

  const { grid, data } = props;
  const blogState = useSelector((state) => state.blog.blog);
  const [supermarketProducts, setSupermarketProducts] = useState([]);

  useEffect(() => {
    if (Array.isArray(productState)) {
      const filteredProducts = productState.filter((product) => product.tags === "supermarcher");
      setSupermarketProducts(filteredProducts);
    }
  }, [productState]);



  const navigateToProduct = (productId) => {
    navigate.push("/product/" + productId);
  };


  useEffect(() => {
    getBlogs();
    getallProducts();
  }, []);

  
  const getBlogs = () => {
    dispatch(getAllBlogs());
  };
  const getallProducts = () =>{
    dispatch(getAllProducts());
  }


  const [scrollPosition, setScrollPosition] = useState(0);

  const sliderLeft = () => {
    const slider = document.getElementById('slider');
    if (slider) {
      slider.scrollLeft -= 200;
      setScrollPosition(slider.scrollLeft);
    }
  };

  const sliderRight = () => {
    const slider = document.getElementById('slider');
    if (slider) {
      slider.scrollLeft += 200;
      setScrollPosition(slider.scrollLeft);
    }
  };
  return (
    <>
      <Meta title={"Accuiel"}/>
      <BrandCrumb title="Accuiel"/>


<Container className='home-carousel-container py-5'>
  <Carousel activeIndex={index} onSelect={handleSelect} interval={5000} pause={false}>
    {images.map((imageUrl, idx) => (
      <Carousel.Item key={idx}>
        <img
          className="home-carousel-image"
          src={imageUrl}
          alt={`Slide ${idx}`}
        />
      </Carousel.Item>
    ))}
  </Carousel>
</Container>

   





<Container class1='featured-wrapper py-5 home-wrapper-2'>
      <h2 className='page-title'>Supermarché</h2>
      <div className='slider-container'>
        <FaArrowLeft className='slider-arrow left-arrow' size={40} onClick={sliderLeft} />
        <div id='slider' className='new-informatique-grid'>
          {infoProducts.map((item, index) => (
            <div key={index} className='new-informatique-card'>
              <div className='new-informatique-card-inner'>
                <div className='new-informatique-image' onClick={() => navigate("/product/" + (item?.slug || item?._id))} style={{ cursor: 'pointer' }}>
                  <img 
                    src={item?.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=Product'} 
                    alt={item?.title || "product"}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                    }}
                  />
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
        <FaArrowRight className='slider-arrow right-arrow' size={40} onClick={sliderRight} />
      </div>
    </Container>

<Container class1='featured-wrapper py-5 home-wrapper-2'>
            <h2 className='page-title'>Featured Product</h2>
            <div className='new-informatique-grid'>
                {infoProducts1.map((item, index) => (
                    <div key={index} className={"new-informatique-card"}>
                        <div className='new-informatique-card-inner'>
                            <div className='new-informatique-image' onClick={() => navigate("/product/" + (item?.slug || item?._id))} style={{ cursor: 'pointer' }}>
                                <img 
                                  src={item?.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=Product'} 
                                  alt={item?.title || "product"}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                                  }}
                                />
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

  


        

<Container class1='special-wrapper py-5 home-wrapper-2'>
<h2 className='page-title'>SpecialProduct</h2>
            <div className='new-informatique-grid'>
                {infoProducts3.map((item, index) => (
                    <div key={index} className={"new-informatique-card"}>
                        <div className='new-informatique-card-inner'>
                            <div className='new-informatique-image' onClick={() => navigate("/product/" + (item?.slug || item?._id))} style={{ cursor: 'pointer' }}>
                                <img 
                                  src={item?.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=Product'} 
                                  alt={item?.title || "product"}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                                  }}
                                />
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

<Container class1='popular-wrapper py-5 home-wrapper-2'>
<h2 className='page-title'>Popular Product</h2>
            <div className='new-informatique-grid'>
                {infoProducts4.map((item, index) => (
                    <div key={index} className={"new-informatique-card"}>
                        <div className='new-informatique-card-inner'>
                            <div className='new-informatique-image' onClick={() => navigate("/product/" + (item?.slug || item?._id))} style={{ cursor: 'pointer' }}>
                                <img 
                                  src={item?.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=Product'} 
                                  alt={item?.title || "product"}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                                  }}
                                />
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
      <Container class1="featured-wrapper py-5 home-wrapper-2'">
      <div className="row">
        {servicesData.map((service, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div className="service-item">
              <div className="service-icon">{service.icon}</div>
              <div className="service-content">
                <h6 className="service-title">{service.title}</h6>
                <p className="service-tagline">{service.tagline}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>

    <Container className="marque-wrapper home-wrapper-2 py-5">
  <div className="row">
    <div className="col-12">
      <div className="marquee-wrapper">
        <Marquee gradient={false} speed={80} direction="left" className="marquee-container">
          <div className="marquee-item">
            <img src={brand1} alt="brand" className="brand-image" />
          </div>
          <div className="marquee-item">
            <img src={brand2} alt="brand" className="brand-image" />
          </div>
          <div className="marquee-item">
            <img src={brand3} alt="brand" className="brand-image" />
          </div>
          <div className="marquee-item">
            <img src={brand4} alt="brand" className="brand-image" />
          </div>
          <div className="marquee-item">
            <img src={brand5} alt="brand" className="brand-image" />
          </div>
          <div className="marquee-item">
            <img src={brand6} alt="brand" className="brand-image" />
          </div>
          <div className="marquee-item">
            <img src={brand7} alt="brand" className="brand-image" />
          </div>
          <div className="marquee-item">
            <img src={brand8} alt="brand" className="brand-image" />
          </div>
        </Marquee>
      </div>
    </div>
  </div>
</Container>



    

      <Container class1='blog-wrapper py-5 home-wrapper-2'>
<div className='row'>
  <div className='col-12'>
    <h3 className="section-heading">nos derniers blogs</h3>
  </div >
  <div className='row'>
  {blogState &&
               blogState?.map((item, index) => {
                if (index <3){
                  return(
                <div className='col-3' key={index}>
                  <BlogCard
                    id={item?._id}
                    title={item?.title}
                    description={item?.description}
                    image={item?.images?.[0]?.url}
                    date={moment(item?.createdAt).format('MMMM DO YYYY, h:mm a')}
                  />
                </div>
               ) }})}
                
                

  </div>

</div>



      </Container>

    </>
  )
}

export default Home
