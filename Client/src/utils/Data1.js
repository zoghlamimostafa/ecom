import React from 'react';
import { FaPhone, FaUtensils, FaHeartbeat, FaTv, FaTshirt, FaHome, FaLaptop, FaGamepad, FaDumbbell, FaTools, FaShoppingBasket, FaEllipsisH } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const servicesData1 = [
  {
    title: "Téléphone & Tablette",
    icon: <FaPhone />,
    link: "/telephone",
  },
  {
    title: "Cuisine & Électroménager",
    icon: <FaUtensils />,
    link: "/cuisine-electromenager",
  },
  {
    title: "Santé & Beauté",
    icon: <FaHeartbeat />,
    link: "/sante-beaute",
  },
  {
    title: "Électroniques",
    icon: <FaTv />,
    link: "/electroniques",
  },
  {
    title: "Mode",
    icon: <FaTshirt />,
    link: "/mode",
  },
  {
    title: "Maison & Bureau",
    icon: <FaHome />,
    link: "/maison-bureau",
  },
  {
    title: "Informatique",
    icon: <FaLaptop />,
    link: "/info",
  },
  {
    title: "Jeux vidéos & Consoles",
    icon: <FaGamepad />,
    link: "/jeux",
  },
  {
    title: "Articles de sport",
    icon: <FaDumbbell />,
    link: "/sport",
  },
  {
    title: "Quincaillerie & Jardin",
    icon: <FaTools />,
    link: "/jardin",
  },
  {
    title: "Superette",
    icon: <FaShoppingBasket />,
    link: "/superette",
  },
  {
    title: "Autres catégories",
    icon: <FaEllipsisH />,
    link: "/other",
  },
];

export default servicesData1;
