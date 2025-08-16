// src/PaymentPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

// Charge Stripe.js avec la clé publique depuis les variables d'environnement
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51NpHZvG3llw1QwnpOPEni9oFYhsi6ck2r1GilJH0liC7cpBrokLvkKkzEGY3TXdCbhGTOFvlEK4dwoYE1bZQnBFu00fajYHl11');

const PaymentPage = () => {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('tnd');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage('');

    if (!orderId || !amount || !paymentMethodId) {
      setMessage('Veuillez remplir tous les champs');
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

      const stripe = await stripePromise;

      // Confirmer le paiement avec le clientSecret
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

      if (error) {
        setMessage(`Erreur lors du paiement: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        setMessage('Paiement effectué avec succès !');
      } else {
        setMessage('Le paiement a échoué');
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setMessage('Une erreur s\'est produite. Veuillez réessayer.');
    }

    setIsProcessing(false);
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Page de Paiement</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="orderId">ID de la commande</label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Entrez l'ID de la commande"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Montant (en TND)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Entrez le montant"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentMethodId">ID de la méthode de paiement</label>
            <input
              type="text"
              id="paymentMethodId"
              value={paymentMethodId}
              onChange={(e) => setPaymentMethodId(e.target.value)}
              placeholder="Entrez l'ID de la méthode de paiement"
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isProcessing}>
              {isProcessing ? 'Traitement en cours...' : 'Payer'}
            </button>
          </div>
        </form>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default PaymentPage;
