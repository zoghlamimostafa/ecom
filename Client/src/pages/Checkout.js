import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createOrder } from '../features/user/userSlice';
import Container from '../components/Container';
import Meta from '../components/Meta';
import { getProductImageUrl } from '../utils/imageHelper';
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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('card');
    
    const cartState = useSelector(state => state.auth.cartProducts);
    const buyNowItem = useSelector(state => state.auth.buyNowItem);
    const itemsToDisplay = buyNowItem ? [buyNowItem] : cartState;
    
    const shippingCost = 8.00;
    
    const subtotal = itemsToDisplay?.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
    }, 0) || 0;
    
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
        },
    });

    return (
        <>
            <Meta title={"Paiement"} />
            <div className="checkout-page">
                <Container class1='py-5'>
                    {/* Barre de progression des étapes */}
                    <div className="checkout-steps">
                        <div className="step completed">
                            <div className="step-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                </svg>
                            </div>
                            <div className="step-label">Panier</div>
                        </div>
                        
                        <div className="step-line completed"></div>
                        
                        <div className="step active">
                            <div className="step-circle">2</div>
                            <div className="step-label">Informations</div>
                        </div>
                        
                        <div className="step-line"></div>
                        
                        <div className="step">
                            <div className="step-circle">3</div>
                            <div className="step-label">Paiement</div>
                        </div>
                        
                        <div className="step-line"></div>
                        
                        <div className="step">
                            <div className="step-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                                </svg>
                            </div>
                            <div className="step-label">Confirmation</div>
                        </div>
                    </div>
                    
                    <div className="row">
                        {/* Colonne gauche - Détails */}
                        <div className="col-lg-7">
                            <div className="checkout-section">
                                <h4 className="section-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="title-icon" viewBox="0 0 16 16">
                                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                                    </svg>
                                    Informations de Livraison
                                </h4>
                                
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="label-icon" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                                </svg>
                                                Prénom *
                                            </label>
                                            <input 
                                                type="text" 
                                                name="firstName" 
                                                className="form-control"
                                                placeholder="Entrez votre prénom"
                                                {...formik.getFieldProps('firstName')} 
                                            />
                                            {formik.touched.firstName && formik.errors.firstName && (
                                                <div className="text-danger small">{formik.errors.firstName}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="label-icon" viewBox="0 0 16 16">
                                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                                </svg>
                                                Nom *
                                            </label>
                                            <input 
                                                type="text" 
                                                name="lastName" 
                                                className="form-control"
                                                placeholder="Entrez votre nom"
                                                {...formik.getFieldProps('lastName')} 
                                            />
                                            {formik.touched.lastName && formik.errors.lastName && (
                                                <div className="text-danger small">{formik.errors.lastName}</div>
                                            )}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="label-icon" viewBox="0 0 16 16">
                                                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5z"/>
                                                </svg>
                                                Adresse *
                                            </label>
                                            <input 
                                                type="text" 
                                                name="address" 
                                                className="form-control"
                                                placeholder="Numéro et rue"
                                                {...formik.getFieldProps('address')} 
                                            />
                                            {formik.touched.address && formik.errors.address && (
                                                <div className="text-danger small">{formik.errors.address}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="label-icon" viewBox="0 0 16 16">
                                                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                                                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                                </svg>
                                                Ville *
                                            </label>
                                            <input 
                                                type="text" 
                                                name="city" 
                                                className="form-control"
                                                placeholder="Votre ville"
                                                {...formik.getFieldProps('city')} 
                                            />
                                            {formik.touched.city && formik.errors.city && (
                                                <div className="text-danger small">{formik.errors.city}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="label-icon" viewBox="0 0 16 16">
                                                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Z"/>
                                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5.5a.5.5 0 0 1-1 0V5a1 1 0 0 0-1-1v1H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.5a.5.5 0 0 1-1 0V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h6.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-2V4Z"/>
                                                </svg>
                                                Code Postal *
                                            </label>
                                            <input 
                                                type="text" 
                                                name="zipcode" 
                                                className="form-control"
                                                placeholder="Code postal"
                                                {...formik.getFieldProps('zipcode')} 
                                            />
                                            {formik.touched.zipcode && formik.errors.zipcode && (
                                                <div className="text-danger small">{formik.errors.zipcode}</div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Méthode de paiement */}
                            <div className="checkout-section mt-4">
                                <h4 className="section-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="title-icon" viewBox="0 0 16 16">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/>
                                        <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/>
                                    </svg>
                                    Méthode de Paiement
                                </h4>
                                
                                <div className="payment-methods">
                                    <div 
                                        className={`payment-option ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}
                                        onClick={() => setSelectedPaymentMethod('card')}
                                    >
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            checked={selectedPaymentMethod === 'card'}
                                            readOnly
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="payment-icon" viewBox="0 0 16 16">
                                            <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z"/>
                                            <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z"/>
                                        </svg>
                                        <span>Carte Bancaire</span>
                                    </div>
                                    
                                    <div 
                                        className={`payment-option ${selectedPaymentMethod === 'cod' ? 'selected' : ''}`}
                                        onClick={() => setSelectedPaymentMethod('cod')}
                                    >
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            checked={selectedPaymentMethod === 'cod'}
                                            readOnly
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="payment-icon" viewBox="0 0 16 16">
                                            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                                        </svg>
                                        <span>Paiement à la livraison</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Colonne droite - Résumé/Facture */}
                        <div className="col-lg-5">
                            <div className="checkout-section sticky-summary">
                                <h4 className="section-title">Résumé de la Commande</h4>
                                
                                {/* Liste des produits */}
                                <div className="order-items">
                                    {itemsToDisplay?.map((item) => (
                                        <div key={item._id} className="order-item">
                                            <div className="item-image">
                                                <img 
                                                    src={getProductImageUrl(item.images)} 
                                                    alt={item.title}
                                                    onError={(e) => e.target.src = '/images/default-product.jpg'}
                                                />
                                            </div>
                                            <div className="item-details">
                                                <div className="item-name">{item.title}</div>
                                                <div className="item-quantity">Quantité: {item.quantity}</div>
                                            </div>
                                            <div className="item-price">
                                                {(item.price * item.quantity).toFixed(2)} TND
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <hr />

                                {/* Calculs */}
                                <div className="order-calculations">
                                    <div className="calc-row">
                                        <span>Sous-total</span>
                                        <span>{subtotal.toFixed(2)} TND</span>
                                    </div>
                                    <div className="calc-row">
                                        <span>Livraison</span>
                                        <span>{shippingCost.toFixed(2)} TND</span>
                                    </div>
                                    <div className="calc-row">
                                        <span>TVA (19%)</span>
                                        <span>{(subtotal * 0.19).toFixed(2)} TND</span>
                                    </div>
                                </div>

                                <hr />

                                {/* Total */}
                                <div className="order-total">
                                    <span>Total</span>
                                    <span className="total-amount">{totalPrice.toFixed(2)} TND</span>
                                </div>

                                {/* Bouton de paiement */}
                                <button 
                                    type="button" 
                                    className="btn-checkout"
                                    onClick={formik.handleSubmit}
                                >
                                    Confirmer la Commande
                                </button>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Checkout;
