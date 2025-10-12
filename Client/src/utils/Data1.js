import { FaPhone, FaUtensils, FaHeartbeat, FaTv, FaTshirt, FaHome, FaLaptop, FaGamepad, FaDumbbell, FaTools, FaShoppingBasket, FaEllipsisH } from 'react-icons/fa';

const servicesData1 = [
  { titleKey: "phoneTablet", icon: FaPhone, link: "/telephone" },
  { titleKey: "kitchenAppliances", icon: FaUtensils, link: "/cuisine-electromenager" },
  { titleKey: "healthBeauty", icon: FaHeartbeat, link: "/sante-beaute" },
  { titleKey: "electronics", icon: FaTv, link: "/electroniques" },
  { titleKey: "fashion", icon: FaTshirt, link: "/mode" },
  { titleKey: "homeOffice", icon: FaHome, link: "/maison-bureau" },
  { titleKey: "computers", icon: FaLaptop, link: "/info" },
  { titleKey: "gamesConsoles", icon: FaGamepad, link: "/jeux" },
  { titleKey: "sports", icon: FaDumbbell, link: "/sport" },
  { titleKey: "gardenHardware", icon: FaTools, link: "/jardin" },
  { titleKey: "supermarket", icon: FaShoppingBasket, link: "/superette" },
  { titleKey: "otherCategories", icon: FaEllipsisH, link: "/other" }
];

export default servicesData1;
