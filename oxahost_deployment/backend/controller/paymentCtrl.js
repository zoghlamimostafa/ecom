const Fatora = require("fatora");

// Initialisez l'instance Fatora avec vos clés d'API
const fatora = new Fatora({
  apiKey: "c4719514-9b6e-4998-93df-0544576343bc",
  apiSecret: "YOUR_API_SECRET",
});

// Fonction pour créer une commande
const checkout = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // Créez une commande avec les détails fournis
    const order = await fatora.createOrder({
      amount, // Montant de la commande en centimes
      currency, // Devise de la commande (par exemple, "TND" pour Dinar tunisien)
      // Autres détails de commande peuvent être ajoutés ici selon les besoins
    });

    // Renvoyez la commande créée comme réponse
    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la création de la commande" });
  }
};

// Fonction pour vérifier le paiement
const paymentVerification = async (req, res) => {
  const { paymentId, orderId } = req.body;

  try {
    // Récupérez les détails du paiement avec l'identifiant de paiement fourni
    const payment = await fatora.getPayment(paymentId);

    // Vérifiez si l'ID de commande du paiement correspond à l'ID de commande attendu
    if (payment.orderId === orderId) {
      // Le paiement a été vérifié avec succès
      res.json({ success: true, message: "Paiement vérifié avec succès" });
    } else {
      res.status(400).json({ success: false, message: "ID de commande invalide" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la vérification du paiement" });
  }
};

module.exports = { checkout, paymentVerification };
