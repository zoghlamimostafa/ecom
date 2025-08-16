// models/orderModel.js
const mongoose = require("mongoose");

// Déclaration du schéma du modèle MongoDB
const orderSchema = new mongoose.Schema(
  {
    // Référence à l'utilisateur qui passe la commande
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Informations de livraison
    shippingInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      other: { type: String },
      pincode: { type: String, required: true },
    },

    // Informations de paiement avec Stripe
    paymentInfo: {
      stripePaymentId: { type: String, required: true },
      stripeTransactionId: { type: String, required: true },
    },

    // Produits commandés
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        color: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Color",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    // Prix total de la commande
    totalPrice: { type: Number, required: true },
    totalPriceAfterDiscount: { type: Number, required: true },

    // Statut de la commande
    orderStatus: {
      type: String,
      enum: ["Ordered", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Ordered",
    },

    // Date de paiement
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Export du modèle
module.exports = mongoose.model("Order", orderSchema);
