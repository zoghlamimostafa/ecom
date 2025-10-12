import { FaShippingFast, FaGift, FaHeadset, FaMoneyBillAlt, FaLock } from 'react-icons/fa';

const servicesData = [
    { 
      icon: <FaShippingFast className="service-icon" />, 
      titleKey: "fastDelivery", 
      taglineKey: "fastDeliveryDesc" 
    },
    { 
      icon: <FaGift className="service-icon" />, 
      titleKey: "surpriseGift", 
      taglineKey: "surpriseGiftDesc" 
    },
    { 
      icon: <FaHeadset className="service-icon" />, 
      titleKey: "customerSupport", 
      taglineKey: "customerSupportDesc" 
    },
    { 
      icon: <FaMoneyBillAlt className="service-icon" />, 
      titleKey: "affordablePrices", 
      taglineKey: "affordablePricesDesc" 
    },
    { 
      icon: <FaLock className="service-icon" />, 
      titleKey: "securePayments", 
      taglineKey: "securePaymentsDesc" 
    }
];

export default servicesData;
