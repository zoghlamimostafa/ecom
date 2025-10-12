
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Utiliser la clé Stripe depuis les variables d'environnement
const { Order } = require('../models/index'); // Utiliser les modèles Sequelize

exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount, currency, paymentMethodId } = req.body;

    // Vérifier si l'ordre existe
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Créer un PaymentIntent avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Montant en centimes (par exemple, 10 TND = 1000 centimes)
      currency: currency,
      payment_method: paymentMethodId,
      confirm: true,
      metadata: { orderid: orderId },
    });

    // Si le paiement est réussi, mettre à jour l'état de la commande
    if (paymentIntent.status === 'succeeded') {
      const paymentInfo = JSON.parse(order.paymentInfo || '{}');
      paymentInfo.stripePaymentId = paymentIntent.id;
      paymentInfo.stripeTransactionId = paymentIntent.charges.data[0].id;
      
      await order.update({
        paymentInfo: JSON.stringify(paymentInfo),
        orderStatus: 'Paid',
        paidAt: new Date()
      });

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
