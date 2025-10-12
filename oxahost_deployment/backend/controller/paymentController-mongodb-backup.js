
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Utiliser la clé Stripe depuis les variables d'environnement
const Order = require('../models/orderModel'); // Assurez-vous que le modèle Order existe dans votre projet

exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount, currency, paymentMethodId } = req.body;

    // Vérifier si l'ordre existe
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Créer un PaymentIntent avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Montant en centimes (par exemple, 10 TND = 1000 centimes)
      currency: currency,
      payment_method: paymentMethodId,
      confirm: true,
      metadata: { order_id: orderId },
    });

    // Si le paiement est réussi, mettre à jour l'état de la commande
    if (paymentIntent.status === 'succeeded') {
      order.paymentInfo.stripePaymentId = paymentIntent.id;
      order.paymentInfo.stripeTransactionId = paymentIntent.charges.data[0].id;
      order.orderStatus = 'Paid';
      order.paidAt = Date.now();

      await order.save();

      res.status(200).json({
        message: 'Paiement effectué avec succès',
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      return res.status(400).json({ message: 'Le paiement a échoué' });
    }
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};
