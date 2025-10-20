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
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    other: ""
  });

  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    if (user && user.address) {
      try {
        // Si l'utilisateur a déjà une adresse enregistrée, la pré-remplir dans le formulaire
        const parsedAddress = typeof user.address === 'string' ? JSON.parse(user.address) : user.address;
        setAddress({
          firstName: user.firstname || "",
          lastName: user.lastname || "",
          address: parsedAddress.address || parsedAddress.street || "",
          city: parsedAddress.city || "",
          state: parsedAddress.state || "",
          pincode: parsedAddress.pincode || parsedAddress.postalCode || "",
          country: parsedAddress.country || "",
          other: parsedAddress.other || ""
        });
      } catch (error) {
        console.error("Error parsing address:", error);
        // Initialiser avec les infos utilisateur au moins
        setAddress(prev => ({
          ...prev,
          firstName: user.firstname || "",
          lastName: user.lastname || ""
        }));
      }
    } else if (user) {
      // Si pas d'adresse mais utilisateur connecté, pré-remplir nom et prénom
      setAddress(prev => ({
        ...prev,
        firstName: user.firstname || "",
        lastName: user.lastname || ""
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation des champs de formulaire
    if (!address.firstName || !address.lastName || !address.address || !address.city || !address.state || !address.pincode) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
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
        shippingInfo: {
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country,
          other: address.other || ""
        },
        paymentInfo: {
          method: 'COD'
        }
      };
      
      dispatch(createNewOrder(orderData))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            setOrderCreated(true);
            toast.success("Commande créée avec succès !");
            
            // Navigate to order confirmation or success page
            setTimeout(() => {
              navigate("/my-orders"); // Rediriger vers la page des commandes
            }, 2000);
          } else if (response.error) {
            console.error("Order creation failed:", response.error);
            toast.error(response.error.message || "Un problème est survenu lors de la création de la commande");
          }
        })
        .catch((error) => {
          console.error("Order creation failed:", error);
          toast.error("Un problème est survenu lors de la création de la commande");
        });
    }
    
    if (isError) {
      toast.error(message || "Une erreur est survenue lors de l'enregistrement de l'adresse.");
    }
  }, [isSuccess, isError, message, dispatch, navigate, orderCreated, address]);

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Adresse de Livraison</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={address.firstName}
              onChange={handleChange}
              className="form-input"
              placeholder="Prénom *"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={address.lastName}
              onChange={handleChange}
              className="form-input"
              placeholder="Nom *"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="address"
              name="address"
              value={address.address}
              onChange={handleChange}
              className="form-input"
              placeholder="Adresse complète *"
              required
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
              placeholder="Ville *"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              className="form-input"
              placeholder="Région / État *"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={address.pincode}
              onChange={handleChange}
              className="form-input"
              placeholder="Code postal *"
              required
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
              placeholder="Pays"
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="text"
              id="other"
              name="other"
              value={address.other}
              onChange={handleChange}
              placeholder="Informations supplémentaires (optionnel)"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading || orderLoading}>
            {isLoading ? "Enregistrement..." : orderLoading ? "Création de la commande..." : "Passer la commande"}
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
