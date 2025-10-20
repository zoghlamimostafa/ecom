import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createOrder, getUserCart } from '../features/user/userSlice';
import { getProductImageUrl } from '../utils/imageHelper';
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
    const { user } = useSelector(state => state.auth);
    const itemsToDisplay = buyNowItem ? [buyNowItem] : cartState;
    
    // 🔄 Charger le panier au montage du composant (si pas de Buy Now)
    useEffect(() => {
        if (user && !buyNowItem) {
            dispatch(getUserCart());
        }
    }, [dispatch, user, buyNowItem]);
    
    // Frais de livraison standard (7 TND - cohérent avec Cart.js)
    const SHIPPING_COST = 7.00;
    const FREE_SHIPPING_THRESHOLD = 100.00;
    
    // Calcul du sous-total (prix des produits uniquement)
    const subtotal = itemsToDisplay?.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
    }, 0) || 0;
    
    // Calcul des frais de livraison (gratuit si > 100 TND)
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    
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
                        <div className="checkout-header">
                            <h2 className="checkout-title">🛍️ Finaliser votre commande</h2>
                            <p className="checkout-subtitle">Remplissez vos informations pour recevoir votre commande</p>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    {/* Formulaire de livraison - Gauche */}
                    <div className="col-lg-7">
                        <div className="card checkout-form-card mb-4">
                            <div className="card-body">
                                <h5 className="section-title-checkout">
                                    <span className="title-icon">📍</span>
                                    Informations de livraison
                                </h5>
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
                        <div className="card checkout-payment-card">
                            <div className="card-body">
                                <h5 className="section-title-checkout">
                                    <span className="title-icon">💳</span>
                                    Méthode de paiement
                                </h5>
                                <div className="payment-methods">
                                    <label className={`payment-option ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="card"
                                            checked={selectedPaymentMethod === 'card'}
                                            onChange={() => setSelectedPaymentMethod('card')}
                                        />
                                        <span className="payment-icon">💳</span>
                                        <span className="payment-label">Carte bancaire</span>
                                        <span className="payment-badge">Sécurisé</span>
                                    </label>
                                    <label className={`payment-option ${selectedPaymentMethod === 'cod' ? 'selected' : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="cod"
                                            checked={selectedPaymentMethod === 'cod'}
                                            onChange={() => setSelectedPaymentMethod('cod')}
                                        />
                                        <span className="payment-icon">💵</span>
                                        <span className="payment-label">Paiement à la livraison</span>
                                        <span className="payment-badge recommended">Recommandé</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Résumé - Droite */}
                    <div className="col-lg-5">
                        <div className="card checkout-summary-card sticky-summary">
                            <div className="card-header checkout-summary-header">
                                <h5 className="mb-0">
                                    <span className="summary-icon">🛒</span>
                                    Récapitulatif de commande
                                </h5>
                                <span className="items-count">{itemsToDisplay?.length || 0} article(s)</span>
                            </div>
                            <div className="card-body">
                                {/* Liste produits */}
                                <div className="order-items mb-3">
                                                                        {itemsToDisplay.map((item) => {
                                        // Utiliser imageHelper pour gérer les URLs correctement
                                        const imageUrl = getProductImageUrl(
                                            item.images || item.product?.images
                                        );
                                        
                                        // Données du produit
                                        const title = item.title || item.product?.title || 'Produit';
                                        const price = item.price || item.product?.price || 0;
                                        
                                        return (
                                            <div key={item.id} className="checkout-product-item">
                                                <div className="product-image-checkout">
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={title}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/images/default-product.jpg";
                                                        }}
                                                    />
                                                </div>
                                                <div className="product-details-checkout">
                                                    <div className="product-title-checkout">{title}</div>
                                                    <div className="product-quantity-checkout">
                                                        <span className="quantity-badge">x{item.quantity}</span>
                                                    </div>
                                                </div>
                                                <div className="product-price-checkout">{(price * item.quantity).toFixed(2)} DT</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Calculs */}
                                <div className="order-summary">
                                    <div className="summary-row">
                                        <span>📦 Sous-total</span>
                                        <span>{subtotal.toFixed(2)} DT</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>🚚 Livraison</span>
                                        {shippingCost === 0 ? (
                                            <span className="shipping-free">GRATUIT</span>
                                        ) : (
                                            <span>{shippingCost.toFixed(2)} DT</span>
                                        )}
                                    </div>
                                </div>

                                <div className="order-total">
                                    <span>Total à payer</span>
                                    <span className="total-amount">{totalPrice.toFixed(2)} DT</span>
                                </div>

                                {/* Bouton de paiement */}
                                <button 
                                    type="submit" 
                                    className="btn-place-order"
                                    onClick={formik.handleSubmit}
                                >
                                    <span>Passer la commande</span>
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
