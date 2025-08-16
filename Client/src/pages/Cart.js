import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdShoppingCart } from "react-icons/md";
import { getUserCart, deleteCartProduct, updateCartProduct } from "../features/user/userSlice";
import Container from '../components/Container';
import Meta from '../components/Meta';
import { Link } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const userCartState = useSelector(state => state.auth.cartProducts);
  const authState = useSelector(state => state?.auth?.auth); // Get authentication state
  const [quantity, setQuantity] = useState({});  // Pour gérer les quantités
  const hasFetchedCart = useRef(false); // Empêcher le rechargement multiple du panier

  // Récupérer le panier uniquement une fois lors du montage du composant
  useEffect(() => {
    if (!hasFetchedCart.current && authState) {
      dispatch(getUserCart());
      hasFetchedCart.current = true;
    }
  }, [dispatch, authState]);

  // Mettre à jour les quantités lorsque le panier change
  useEffect(() => {
    if (userCartState && userCartState.length > 0) {
      const updatedQuantity = {};
      userCartState.forEach(item => {
        updatedQuantity[item._id] = item.quantity; // Remplir l'état quantity avec les valeurs initiales
      });
      setQuantity(updatedQuantity);
    }
  }, [userCartState]);

  // Fonction pour gérer le changement de quantité
  const handleQuantityChange = (e, itemId) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity < 1 || newQuantity > 10) return; // Empêcher les valeurs invalides

    setQuantity(prevState => ({
      ...prevState,
      [itemId]: newQuantity,
    }));

    // Mise à jour du produit dans le panier via Redux
    dispatch(updateCartProduct({ cartItemId: itemId, quantity: newQuantity }));
  };

  // Fonction pour supprimer un produit du panier
  const handleDeleteCartItem = (itemId) => {
    dispatch(deleteCartProduct(itemId)); // Suppression immédiate via Redux
    
    // Récupérer de nouveau le panier après suppression si authentifié
    if (authState) {
      dispatch(getUserCart());
    }
  };

  // Calcul du prix total du panier
  let totalPrice = 0;
  if (userCartState && Array.isArray(userCartState) && userCartState.length > 0) {
    totalPrice = userCartState.reduce((acc, item) => acc + (item.price * (quantity[item._id] || item.quantity)), 0);
  }

  return (
    <>
      <Meta title={"Panier"} />
      <Container class1='cart-wrapper home-wrapper-2 py-5'>
        <div className='row'>
          <div className='col-12'>
            <div className='cart-header py-3'>
              <h4 className='text-center'>Votre Panier</h4>
            </div>
            {userCartState && Array.isArray(userCartState) && userCartState.length > 0 ? (
              <>
                {userCartState.map((item, index) => (
                  <div key={index} className='cart-item py-3 border-bottom'>
                    <div className='row align-items-center'>
                      <div className='col-md-2 col-6'>
                        {item.productId && item.productId.images && (
                          <img src={item.productId.images[0]?.url} alt="Produit" className="img-fluid" style={{maxHeight: '100px'}} />
                        )}
                      </div>
                      <div className='col-md-3 col-6'>
                        <h5>{item.productId?.title}</h5>
                        {item.color && <p>Couleur: <span style={{ backgroundColor: item.color.title }} className='color-badge'></span></p>}
                      </div>
                      <div className='col-md-3 col-6'>
                        <div className='d-flex flex-column align-items-center'>
                          <h5>Prix: {item.price} TND</h5>
                          <div className='quantity-container'>
                            <label htmlFor={`quantity-${index}`} className="form-label">Quantité:</label>
                            <div className="d-flex align-items-center">
                              <button 
                                type="button" 
                                className="btn btn-outline-secondary btn-sm me-2"
                                onClick={() => handleQuantityChange({target: {value: Math.max(1, (quantity[item._id] || item.quantity) - 1)}}, item._id)}
                                disabled={(quantity[item._id] || item.quantity) <= 1}
                              >
                                -
                              </button>
                              <input 
                                type="number" 
                                min={1} 
                                max={10} 
                                value={quantity[item._id] || item.quantity} 
                                onChange={(e) => handleQuantityChange(e, item._id)} 
                                id={`quantity-${index}`} 
                                className="form-control mx-1" 
                                style={{width: '70px'}}
                              />
                              <button 
                                type="button" 
                                className="btn btn-outline-secondary btn-sm ms-2"
                                onClick={() => handleQuantityChange({target: {value: Math.min(10, (quantity[item._id] || item.quantity) + 1)}}, item._id)}
                                disabled={(quantity[item._id] || item.quantity) >= 10}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-4 col-12'>
                        <div className='d-flex flex-column align-items-center'>
                          <h5>Total: {item.price * (quantity[item._id] || item.quantity)} TND</h5>
                          <button 
                            className="btn btn-danger btn-sm mt-2"
                            onClick={() => handleDeleteCartItem(item._id)}
                            title="Supprimer cet article"
                          >
                            <MdDelete size={16} /> Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className='cart-total py-3'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <Link to="/" className="btn btn-primary">Continuer vos achats</Link>
                    <div>
                      <h4>Total: {totalPrice} TND</h4>
                      <Link to="/checkout" className='btn btn-success checkout-btn'> Valider la commande</Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className='empty-cart'>
                <MdShoppingCart className='cart-icon' />
                <p className='text-center'>Votre panier est vide.</p>
                <Link to="/" className='btn btn-primary'>Commencez vos achats</Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;
