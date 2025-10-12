import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveUserAddress } from "../features/user/userSlice";
import { createNewOrder } from "../features/user/ordersSlice"; 
import { toast } from "react-toastify";

const DeliveryAddressPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Récupérer l'état de Redux - auth.auth pour l'utilisateur connecté
  const { auth: user } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  const { loading: orderLoading } = useSelector((state) => state.orders);

  // Initialisation de l'adresse avec les données existantes si elles sont présentes
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    if (user && user.address) {
      try {
        // Si l'utilisateur a déjà une adresse enregistrée, la pré-remplir dans le formulaire
        const parsedAddress = typeof user.address === 'string' ? JSON.parse(user.address) : user.address;
        setAddress(parsedAddress);
      } catch (error) {
        console.error("Error parsing address:", error);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation des champs de formulaire
    if (!address.street || !address.city || !address.postalCode || !address.country) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    // Appel de l'action Redux pour enregistrer l'adresse
    dispatch(saveUserAddress(address));
  };

  useEffect(() => {
    if (isSuccess && !orderCreated) {
      toast.success("Adresse enregistrée avec succès !");
      
      // Create order after address is saved successfully
      const orderData = {
        COD: true  // Cash on Delivery
      };
      
      dispatch(createNewOrder(orderData))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            setOrderCreated(true);
            toast.success("Commande créée avec succès !");
            
            // Navigate to order confirmation or success page
            setTimeout(() => {
              navigate("/"); // or navigate to an order success page
            }, 2000);
          }
        })
        .catch((error) => {
          console.error("Order creation failed:", error);
          toast.error("Erreur lors de la création de la commande");
        });
    }
    
    if (isError) {
      toast.error(message || "Une erreur est survenue lors de l'enregistrement de l'adresse.");
    }
  }, [isSuccess, isError, message, dispatch, navigate, orderCreated]);

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Adresse de Livraison</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <input
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              className="form-input"
              placeholder="Entrez votre rue"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              className="form-input"
              placeholder="Entrez votre ville"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              className="form-input"
              placeholder="Entrez votre code postal"
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="text"
              id="country"
              name="country"
              value={address.country}
              onChange={handleChange}
              placeholder="Entrez votre pays"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading || orderLoading}>
            {isLoading ? "Enregistrement..." : orderLoading ? "Création de la commande..." : "Confirmer la livraison"}
          </button>
        </form>

        {/* Afficher les messages de succès et d'erreur */}
        {isSuccess && <p style={{ color: "green" }}>Adresse enregistrée avec succès !</p>}
        {isError && <p style={{ color: "red" }}>{message}</p>}
      </div>
    </div>
  );
};

export default DeliveryAddressPage;
