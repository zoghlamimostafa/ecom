import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import Container from '../components/Container';
import { useDispatch, useSelector } from 'react-redux';
import { processPayment } from '../features/payment/paymentSlice';
import { clearBuyNowItem } from '../features/user/userSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const cartState = useSelector(state => state.auth.cartProducts);
  const buyNowItem = useSelector(state => state.auth.buyNowItem);
  
  // Determine which items to display - cart items or buy now item
  const itemsToDisplay = buyNowItem ? [buyNowItem] : cartState;
  
  // Calcul du total des prix
  let totalPrice = 0;
  if (Array.isArray(itemsToDisplay) && itemsToDisplay.length > 0) {
    totalPrice = itemsToDisplay.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  const handlePayment = () => {
    // Proceed to payment action or handle payment processing
    dispatch(processPayment());
  };

  return (
    <>
      <Container class1='checkout-wrapper py-5 home-wrapper-2'>
        <div className='row'>
          <div className='col-7'>
            <div className='checkout-left-data'>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link className='text-dark total-price' to={buyNowItem ? "/" : "/cart"}>
                      {buyNowItem ? "Accueil" : "Panier"}
                    </Link>
                  </li> &nbsp;/
                  <li className="breadcrumb-item total-price active" aria-current="page">Information</li>
                  <li className="breadcrumb-item active">Livraison</li>  &nbsp;/
                  <li className="breadcrumb-item active" aria-current="page">Paiement</li>
                </ol>
              </nav>
              <h4 className='title total'>Résumé de votre commande</h4>
              <div className='checkout-items'>
                {
                  itemsToDisplay && itemsToDisplay?.map((item, index) => {
                    return (
                      <div key={index} className='d-flex gap-10 mb-2 align-items-center'>
                        <div className="w-75 d-flex gap-10">
                          <div className='w-25 position-relative'>
                            <span style={{ 'top': '-10px', 'right': '2px' }}
                              className='badge bg-secondary text-white rounded-circle p-2 position-absolute'>
                              {item?.quantity}
                            </span>
                            <img height={100} width={100} src={item?.productId?.images && item.productId.images.length > 0 ? item.productId.images[0]?.url : "images/watch.jpg"} alt="product" />
                          </div>
                          <div>
                            <h5 className='title-price'>{item?.productId?.title}</h5>
                            <p className='total-price'>{item?.color?.title}</p>
                          </div>
                        </div>
                        <div className='flex-grow-1'>
                          <h5 className='total'>{item?.price * item?.quantity} TND</h5>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
          <div className='col-5'>
            <div className='border-bottom py-4'>
              <div className='d-flex justify-content-between align-items-center'>
                <p className='total'>Total</p>
                <p className='total-price'>{totalPrice ? totalPrice : "0"} TND</p>
              </div>
              
            </div>
            
            <div className='d-flex justify-content-between align-items-center py-4'>
              <Link to="/livraison" className='button'>
                Livraison à Domicile
              </Link>
              <Link to="/payment" className='button' onClick={handlePayment}>
                Paiement en Ligne
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Checkout;
