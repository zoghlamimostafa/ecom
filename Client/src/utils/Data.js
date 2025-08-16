import { FaShippingFast, FaGift, FaHeadset, FaMoneyBillAlt, FaLock } from 'react-icons/fa';

const servicesData = [
    { 
      icon: <FaShippingFast className="service-icon" />, 
      title: "Livraison rapide", 
      tagline: "Livraison express dans toute la Tunisie." 
    },
    { 
      icon: <FaGift className="service-icon" />, 
      title: "Cadeau surprise", 
      tagline: "Recevez un cadeau surprise chaque semaine." 
    },
    { 
      icon: <FaHeadset className="service-icon" />, 
      title: "Support client", 
      tagline: "Assistance client disponible 24/7." 
    },
    { 
      icon: <FaMoneyBillAlt className="service-icon" />, 
      title: "Prix abordables", 
      tagline: "Offres spéciales et prix compétitifs." 
    },
    { 
      icon: <FaLock className="service-icon" />, 
      title: "Paiements sécurisés", 
      tagline: "Transactions sécurisées pour une tranquillité d'esprit." 
    }
];

export default servicesData;
