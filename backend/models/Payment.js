// models/paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    // ID du paiement Stripe
    stripePaymentId: {
      type: String,
      required: true,
      unique: true,
    },
    
    // ID de la transaction Stripe
    stripeTransactionId: {
      type: String,
      required: true,
    },
    
    // Montant total payé
    amount: {
      type: Number,
      required: true,
    },
    
    // Monnaie utilisée (ex: 'usd', 'eur')
    currency: {
      type: String,
      required: true,
    },
    
    // Statut du paiement
    paymentStatus: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'pending',
    },
    
    // Date à laquelle le paiement a été effectué
    paidAt: {
      type: Date,
      default: Date.now,
    },

    // Référence à la commande associée à ce paiement
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    // Informations supplémentaires (optionnel)
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
