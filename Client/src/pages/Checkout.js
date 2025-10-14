import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createOrder } from '../features/user/userSlice';
import Container from '../components/Container';
import Meta from '../components/Meta';
import './Checkout.css';

const shippingSchema = yup.object({
    firstName: yup.string().required("Le prénom est requis"),
    lastName: yup.string().required("Le nom de famille est requis"),
    address: yup.string().required("L'adresse est requise"),
    city: yup.string().required("La ville est requise"),
    zipcode: yup.string().required("Le code postal est requis"),
});

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    
    const cartState = useSelector(state => state.auth.cartProducts);
    const buyNowItem = useSelector(state => state.auth.buyNowItem);
    const itemsToDisplay = buyNowItem ? [buyNowItem] : cartState;
    
    // Frais de livraison standard
    const shippingCost = 8.00;
    
    // Calcul du sous-total (prix des produits uniquement)
    const subtotal = itemsToDisplay?.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
    }, 0) || 0;
    
    // Total avec livraison
    const totalPrice = subtotal + shippingCost;

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            zipcode: '',
        },
        validationSchema: shippingSchema,
        onSubmit: (values) => {
            const orderData = {
                shippingInfo: values,
                orderItems: itemsToDisplay,
                subtotal: subtotal,
                shippingCost: shippingCost,
                totalPrice: totalPrice,
                paymentInfo: {
                    method: selectedPaymentMethod,
                    status: "Payé",
                }
            };
            dispatch(createOrder(orderData));
            navigate('/my-orders');
        },
    });

    if (!itemsToDisplay || itemsToDisplay.length === 0) {
        return (
            <Container class1='py-5'>
                <div className="text-center">
                    <h3>Votre panier est vide</h3>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/product')}>
                        Continuer vos achats
                    </button>
                </div>
            </Container>
        );
    }

    return (
        <>
            <Meta title={"Paiement"} />
            <Container class1='checkout-wrapper py-5'>
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center mb-4">Finaliser votre commande</h2>
                    </div>
                </div>
                
                <div className="row">
                    {/* Formulaire de livraison - Gauche */}
                    <div className="col-lg-7">
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="mb-3">Informations de livraison</h5>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="firstName" className="form-label">Prénom *</label>
                                            <input 
                                                type="text" 
                                                id="firstName" 
                                                name="firstName" 
                                                className={`form-control $${formik.touched.firstName && formik.errors.firstName ? 'is-invalid' : ''}`}
                                                {...formik.getFieldProps('firstName')} 
                                            />
                                            {formik.touched.firstName && formik.errors.firstName && (
                                                <div className="invalid-feedback">{formik.errors.firstName}</div>
                                            )}
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label htmlFor="lastName" className="form-label">Nom *</label>
                                            <input 
                                                type="text" 
                                                id="lastName" 
                                                name="lastName" 
                                                className={`form-control ${formik.touched.lastName && formik.errors.lastName ? 'is-invalid' : ''}`}
                                                {...formik.getFieldProps('lastName')} 
                                            />
                                            {formik.touched.lastName && formik.errors.lastName && (
                                                <div className="invalid-feedback">{formik.errors.lastName}</div>
                                            )}
                                        </div>
                                        
                                        <div className="col-12">
                                            <label htmlFor="address" className="form-label">Adresse *</label>
                                            <input 
                                                type="text" 
                                                id="address" 
                                                name="address" 
                                                className={`form-control ${formik.touched.address && formik.errors.address ? 'is-invalid' : ''}`}
                                                {...formik.getFieldProps('address')} 
                                            />
                                            {formik.touched.address && formik.errors.address && (
                                                <div className="invalid-feedback">{formik.errors.address}</div>
                                            )}
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label htmlFor="city" className="form-label">Ville *</label>
                                            <input 
                                                type="text" 
                                                id="city" 
                                                name="city" 
                                                className={`form-control ${formik.touched.city && formik.errors.city ? 'is-invalid' : ''}`}
                                                {...formik.getFieldProps('city')} 
                                            />
                                            {formik.touched.city && formik.errors.city && (
                                                <div className="invalid-feedback">{formik.errors.city}</div>
                                            )}
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <label htmlFor="zipcode" className="form-label">Code Postal *</label>
                                            <input 
                                                type="text" 
                                                id="zipcode" 
                                                name="zipcode" 
                                                className={`form-control ${formik.touched.zipcode && formik.errors.zipcode ? 'is-invalid' : ''}`}
                                                {...formik.getFieldProps('zipcode')} 
                                            />
                                            {formik.touched.zipcode && formik.errors.zipcode && (
                                                <div className="invalid-feedback">{formik.errors.zipcode}</div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Méthode de paiement */}
                        <div className="card">
                            <div className="card-body">
                                <h5 className="mb-3">Méthode de paiement</h5>
                                <div className="payment-methods">
                                    <label className="payment-option d-flex align-items-center mb-2">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="card"
                                            checked={selectedPaymentMethod === 'card'}
                                            onChange={() => setSelectedPaymentMethod('card')}
                                        />
                                        <span className="ms-2">Carte bancaire</span>
                                    </label>
                                    <label className="payment-option d-flex align-items-center">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="cod"
                                            checked={selectedPaymentMethod === 'cod'}
                                            onChange={() => setSelectedPaymentMethod('cod')}
                                        />
                                        <span className="ms-2">Paiement à la livraison</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Résumé - Droite */}
                    <div className="col-lg-5">
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Récapitulatif de commande</h5>
                            </div>
                            <div className="card-body">
                                {/* Liste produits */}
                                <div className="order-items mb-3">
                                    {itemsToDisplay.map((item) => (
                                        <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                            <img 
                                                src={item.images?.[0]?.url || "https://via.placeholder.com/80"} 
                                                alt={item.title}
                                                style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                                className="rounded me-3"
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{item.title}</h6>
                                                <small className="text-muted">Qté: {item.quantity}</small>
                                            </div>
                                            <span className="fw-bold">{(item.price * item.quantity).toFixed(2)} TND</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Calculs */}
                                <div className="order-totals">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Sous-total</span>
                                        <span>{subtotal.toFixed(2)} TND</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Livraison</span>
                                        <span>{shippingCost.toFixed(2)} TND</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between mb-3">
                                        <h5 className="mb-0">Total</h5>
                                        <h5 className="mb-0 text-primary">{totalPrice.toFixed(2)} TND</h5>
                                    </div>
                                </div>

                                {/* Bouton de paiement */}
                                <button 
                                    type="submit" 
                                    className="btn btn-dark w-100 py-2"
                                    onClick={formik.handleSubmit}
                                >
                                    Finaliser le paiement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default Checkout;
