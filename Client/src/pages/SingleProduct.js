import React, { useEffect, useState } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import ProductCard from '../components/ProductCard';
import ReactStars from "react-rating-stars-component";
import ReactImageZoom from 'react-image-zoom';
import Color from '../components/Color';
import { TbGitCompare } from "react-icons/tb";
import { AiOutlineHeart } from "react-icons/ai";
import Container from '../components/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addRating, getAProduct, getAllProducts } from '../features/products/productSlice';
import { toast } from 'react-toastify';
import { addProdToCart, getUserCart, setBuyNowItem } from '../features/user/userSlice';

const SingleProduct = () => {
  const [color, setColor] = useState(null);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [star, setStar] = useState(null);
  const [comment, setComment] = useState(null);
  const [popularProduct, setPopularProduct] = useState([]);
  const [orderProduct, setOrderProduct] = useState(true); // Etat pour contrôler l'affichage du formulaire de commentaire

  const location = useLocation();
  const navigate = useNavigate();
  const getProductSlug = location.pathname.split("/")[2]; // This now gets the slug instead of ID
  const dispatch = useDispatch();

  const productState = useSelector(state => state?.product?.singleproduct);
  const cartState = useSelector(state => state?.auth?.cartProducts);
  const productState1 = useSelector(state => state?.product?.product);
  const authState = useSelector(state => state?.auth?.auth); // Get authentication state

  // Etat pour éviter les appels multiples
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (loading) {
      dispatch(getAProduct(getProductSlug)); // Charger le produit spécifique
      dispatch(getAllProducts()); // Charger tous les produits
      
      // Only fetch cart if user is authenticated
      if (authState) {
        dispatch(getUserCart()); // Charger le panier de l'utilisateur
      }
      
      setLoading(false); // Mettre à jour l'état pour indiquer que le chargement est terminé
    }
  }, [dispatch, getProductSlug, loading, authState]);

  useEffect(() => {
    // Extraire les produits populaires - s'assurer que productState1 est un tableau
    if (Array.isArray(productState1)) {
      const popularProducts = productState1.filter(product => product.tags === 'popular');
      setPopularProduct(popularProducts);
    }
  }, [productState1]);

  useEffect(() => {
    // Vérifier si le produit est déjà dans le panier
    if (cartState && cartState.length > 0 && productState) {
      const isAlreadyAdded = cartState.some(item => item?.productId?._id === productState._id);
      setAlreadyAdded(isAlreadyAdded);
    }
  }, [cartState, productState]);

  const addRatingToProduct = () => {
    if (star === null) {
      toast.error("Please add star rating ");
      return false;
    } else if (comment === null) {
      toast.error("Please Write Review About the Product");
      return false;
    } else {
      dispatch(addRating({ star, comment, prodId: productState?._id }));
      setTimeout(() => {
        dispatch(getAProduct(getProductSlug)); // Récupérer à nouveau le produit après avoir ajouté un avis
      }, 100);
    }
    return false;
  };

  const uploadCart = () => {
    dispatch(addProdToCart({
      productId: productState?._id,
      quantity,
      color: color || null, // Send null if no color is selected
      price: productState?.price
    }));
  };

  const buyNow = () => {
    // Check if user is authenticated
    if (!authState) {
      toast.error("Veuillez vous connecter pour continuer");
      navigate('/login');
      return;
    }

    // Create the item data for immediate checkout
    const buyNowItemData = {
      _id: Date.now(), // Temporary ID for buy now item
      productId: {
        _id: productState?._id,
        title: productState?.title,
        images: productState?.images
      },
      quantity: parseInt(quantity),
      color: color || null,
      price: productState?.price
    };

    // Set the item in Redux state
    dispatch(setBuyNowItem(buyNowItemData));
    
    // Navigate to checkout
    navigate('/checkout');
    toast.success("Redirection vers la commande");
  };

  const props = {
    width: 304,
    height: 300,
    zoomWidth: 300,
    img: productState?.images[0]?.url || "images/watch.jpg"
  };

  const copyToClipboard = (text) => {
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  return (
    <>
      <Meta title={productState?.title || "Product"} />
      <BrandCrumb title={productState?.title || "Product"} />
      <Container class1="main-product-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-6">
            <div className="main-product-image">
              <ReactImageZoom
                {...props}
                zoomScale={2}
                shouldReplaceImage={true}
                width={500}
                height={500}
                zoomLensStyle={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
              />
            </div>

            <div className="other-product-images d-flex flex-wrap gap-15">
              {productState?.images.map((item, index) => (
                <div key={index}>
                  <img
                    src={item?.url}
                    className="img-fluid"
                    alt={`product ${index}`}
                    style={{ maxWidth: '50%', height: '100px' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="col-6">
            <div className="main-product-details">
              <div className="border-bottom">
                <h3 className="title">{productState?.title}</h3>
              </div>
              <div className="border-bottom py-3">
                <p className="price">{productState?.price} TND</p>
                <div className="d-flex align-items-center gap-10">
                  <div className="stars-container">
                    <ReactStars
                      count={5}
                      size={24}
                      value={productState?.totalratings}
                      edit={false}
                      activeColor="#ffd700"
                    />
                    <p className="mb-0 t-review">({productState?.totalratings} avis)</p>
                  </div>
                </div>
                <a href="#review" className="review-btn">Write a Review</a>
              </div>

              <div className="py-3">
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Type :</h3>
                  <p className="product-data">GFD</p>
                </div>
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Marque :</h3>
                  <p className="product-data">{productState?.brand}</p>
                </div>
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Catégorie :</h3>
                  <p className="product-data">{productState?.Category}</p>
                </div>

                {/* Ajout de la gestion de couleur */}
                {!alreadyAdded && (
                  <div className="d-flex gap-10 flex-column mt-2 mb-3">
                    <h3 className="product-heading">Couleur :</h3>
                    <Color setColor={setColor} colorData={productState?.color} />
                  </div>
                )}

                {/* Quantité et boutons */}
                <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                  {!alreadyAdded && (
                    <>
                      <h3 className="product-heading">Quantité :</h3>
                      <input
                        onChange={(e) => setQuantity(e.target.value)}
                        value={quantity}
                        type="number"
                        className="form-control"
                        min={1}
                        max={10}
                      />
                    </>
                  )}
                  <div className={`ms-${alreadyAdded ? '0' : '5'} d-flex align-items-center gap-30`}>
                    <button className="button border-0" onClick={() => { alreadyAdded ? navigate('/cart') : uploadCart() }}>
                      {alreadyAdded ? "Go to Cart" : "Add to Cart"}
                    </button>
                    <button className="button signup" onClick={buyNow}>Buy Now</button>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-15">
                  <TbGitCompare className="fs-5" /> Add to compare
                  <AiOutlineHeart className="fs-5" /> Add to wishlist
                </div>
                <div className="d-flex gap-10 flrx-column my-3">
                  <h3 className="product-heading">Shipping & Returns :</h3>
                  <p className="product-data">Shipping available across Tunisia</p>
                </div>
                <div className="d-flex gap-10 align-items-center my-3">
                  <h3 className="product-heading">Product Link :</h3>
                  <a href="javascript:void(0);" onClick={() => { copyToClipboard(window.location.href) }}>Copy product link</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Product Description */}
      <Container class1="description-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="description-heading">Description</h3>
            {productState?.description}
          </div>
        </div>
      </Container>

      {/* Write Review Section */}
      {orderProduct && (
        <Container class1="reviews py-5 home-wrapper-2" id="review">
          <div className="row">
            <div className="col-12">
              <h3 className="review-heading">Write a Review</h3>
              <div className="d-flex align-items-center gap-10 mb-4">
                <ReactStars
                  count={5}
                  size={24}
                  value={star}
                  onChange={(newRating) => setStar(newRating)}
                  activeColor="#ffd700"
                />
              </div>
              <textarea
                className="form-control"
                name="comment"
                placeholder="Write Your Review"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                rows="4"
              />
              <div className="d-flex justify-content-end mt-3">
                <button className="button review-btn" onClick={addRatingToProduct}>
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </Container>
      )}

      {/* Popular Products */}
      <Container class1="popular-products py-5 home-wrapper-2">
        <div className="row">
          <h3 className="popular-products-heading">Popular Products</h3>
          {popularProduct.map((prod, index) => (
            <ProductCard key={index} prod={prod} />
          ))}
        </div>
      </Container>
    </>
  );
};

export default SingleProduct;
