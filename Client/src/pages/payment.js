// src/PaymentPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from '../contexts/TranslationContext';

const PaymentPage = () => {
  const { t } = useTranslation();
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('tnd');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  
  // Charge Stripe.js uniquement quand ce composant est monté
  useEffect(() => {
    const loadStripeLib = async () => {
      try {
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(
          process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 
          'pk_test_51NpHZvG3llw1QwnpOPEni9oFYhsi6ck2r1GilJH0liC7cpBrokLvkKkzEGY3TXdCbhGTOFvlEK4dwoYE1bZQnBFu00fajYHl11'
        );
        setStripePromise(stripe);
      } catch (error) {
        console.warn('Stripe.js non disponible:', error);
        setMessage('Le système de paiement n\'est pas disponible actuellement.');
        setMessageType('error');
      }
    };
    
    loadStripeLib();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage('');
    setMessageType('');

    if (!orderId || !amount || !paymentMethodId) {
      setMessage(t('fillAllRequiredFields'));
      setMessageType('error');
      setIsProcessing(false);
      return;
    }

    try {
      // Envoi des informations au backend pour créer un PaymentIntent
      const response = await axios.post('http://localhost:4000/api/payment/process', {
        orderId,
        amount,
        currency,
        paymentMethodId,
      });

      const { clientSecret } = response.data;

      if (!stripePromise) {
        setMessage('Le système de paiement n\'est pas encore chargé. Veuillez réessayer.');
        setMessageType('error');
        setIsProcessing(false);
        return;
      }

      // Confirmer le paiement avec le clientSecret
      const { error, paymentIntent } = await stripePromise.confirmCardPayment(clientSecret);

      if (error) {
        setMessage(`Erreur lors du paiement: ${error.message}`);
        setMessageType('error');
      } else if (paymentIntent.status === 'succeeded') {
        setMessage('🎉 Paiement effectué avec succès ! Votre commande a été confirmée.');
        setMessageType('success');
        
        // Réinitialiser le formulaire après succès
        setTimeout(() => {
          setOrderId('');
          setAmount('');
          setPaymentMethodId('');
          setMessage('');
          setMessageType('');
        }, 3000);
      } else {
        setMessage(t('paymentFailedTryAgain'));
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setMessage(t('errorProcessingTryAgain'));
      setMessageType('error');
    }

    setIsProcessing(false);
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Paiement Sécurisé</h2>
        <p style={{ textAlign: 'center', color: '#6c757d', marginBottom: '2rem' }}>
          Finalisez votre commande en toute sécurité
        </p>
        
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group" data-field="orderId">
                        <label htmlFor="orderId">{t('orderNumber')} *</label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Ex: CMD-2024-001"
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group" data-field="amount">
                        <label htmlFor="amount">{t('amount')} *</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 150.00"
              step="0.01"
              min="0"
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group" data-field="paymentMethod">
            <label htmlFor="paymentMethodId">{t('paymentMethod')} *</label>
            <input
              type="text"
              id="paymentMethodId"
              value={paymentMethodId}
              onChange={(e) => setPaymentMethodId(e.target.value)}
              placeholder={t('paymentMethodIdPlaceholder')}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className={`submit-btn ${isProcessing ? 'loading' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing ? t('processingPayment') : t('confirmPayment')}
            </button>
          </div>
        </form>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#6c757d',
          textAlign: 'center'
        }}>
          🔒 Vos informations de paiement sont sécurisées par cryptage SSL
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
