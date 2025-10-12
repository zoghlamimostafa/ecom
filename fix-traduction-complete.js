// Script de correction complète du système de traduction
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Client/src/contexts/TranslationContext.js');

console.log('🔧 CORRECTION SYSTÈME DE TRADUCTION');
console.log('====================================\n');

const translationsFixed = {
  fr: {
    // Métadonnées du site
    siteName: "Sanny Store",
    siteTitle: "Sanny Store - Votre Destination Shopping",
    siteDescription: "Découvrez Sanny Store, votre boutique e-commerce de confiance. Large gamme de produits, livraison rapide, service client exceptionnel.",
    siteKeywords: "boutique en ligne, e-commerce, achat, shopping, mode, électronique, beauté, maison",
    developedBy: "Développé par Sanny Team",
    
    // Navigation et liens
    home: "Accueil",
    ourStore: "Notre Boutique",
    shop: "Boutique",
    store: "Magasin",
    products: "Produits",
    wishlist: "Liste de souhaits",
    favorites: "Favoris",
    cart: "Panier",
    basket: "Panier",
    contact: "Contact",
    contactUs: "Contactez-nous",
    about: "À propos",
    aboutUs: "À propos de nous",
    privacy: "Confidentialité",
    privacyPolicy: "Politique de confidentialité",
    refund: "Remboursement",
    refundPolicy: "Politique de remboursement",
    shipping: "Livraison",
    shippingPolicy: "Politique de livraison",
    terms: "Conditions",
    termsAndConditions: "Conditions d'utilisation",
    blog: "Blog",
    blogs: "Articles",
    news: "Actualités",
    faq: "FAQ",
    help: "Aide",
    support: "Support",
    compare: "Comparer",
    comparison: "Comparaison",
    
    // Authentification
    login: "Connexion",
    logIn: "Se connecter",
    logout: "Déconnexion",
    logOut: "Se déconnecter",
    register: "Inscription",
    signUp: "S'inscrire",
    signup: "Inscription",
    forgotPassword: "Mot de passe oublié",
    resetPassword: "Réinitialiser le mot de passe",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    firstname: "Prénom",
    lastname: "Nom",
    phone: "Téléphone",
    address: "Adresse",
    
    // Messages spécifiques de la page d'accueil
    welcomeToSanny: "Bienvenue chez Sanny Store",
    buyAndSellConfidently: "Achetez et vendez en toute confiance",
    bestOffersOfTheMoment: "Meilleures offres du moment",
    noPromotionsAvailable: "Aucune promotion disponible",
    seeAllOffers: "Voir toutes les offres",
    popularProducts: "Produits populaires",
    discoverMostAppreciated: "Découvrez nos produits les plus appréciés",
    noProductsAvailable: "Aucun produit disponible",
    seeAllProducts: "Voir tous les produits",
    newProducts: "Nouveaux produits",
    latestArrivals: "Dernières nouveautés",
    noNewProducts: "Aucun nouveau produit",
    seeAllNewProducts: "Voir tous les nouveaux produits",
    exploreCategories: "Explorez nos catégories",
    
    // Actions produits
    addToCart: "Ajouter au panier",
    addToWishlist: "Ajouter aux favoris",
    removeFromCart: "Retirer du panier",
    removeFromWishlist: "Retirer des favoris",
    viewDetails: "Voir les détails",
    quickView: "Aperçu rapide",
    buyNow: "Acheter maintenant",
    outOfStock: "Rupture de stock",
    inStock: "En stock",
    availability: "Disponibilité",
    price: "Prix",
    priceRange: "Gamme de prix",
    unitPrice: "Prix unitaire",
    totalPrice: "Prix total",
    subtotal: "Sous-total",
    total: "Total",
    
    // Panier et commandes
    cartTotal: "Total panier",
    grandTotal: "Total général",
    checkout: "Commander",
    orderSummary: "Résumé de la commande",
    orderDetails: "Détails de la commande",
    orderHistory: "Historique des commandes",
    trackOrder: "Suivre la commande",
    quantity: "Quantité",
    
    // Paiement et livraison
    paymentMethod: "Mode de paiement",
    paymentMethods: "Modes de paiement",
    billingAddress: "Adresse de facturation",
    deliveryAddress: "Adresse de livraison",
    deliveryInfo: "Informations de livraison",
    deliveryOptions: "Options de livraison",
    estimatedDelivery: "Livraison estimée",
    freeShipping: "Livraison gratuite",
    cashOnDelivery: "Paiement à la livraison",
    
    // Interface utilisateur
    search: "Rechercher",
    searchProducts: "Rechercher des produits...",
    filter: "Filtrer",
    sort: "Trier",
    sortBy: "Trier par",
    filterBy: "Filtrer par",
    category: "Catégorie",
    categories: "Catégories",
    brand: "Marque",
    brands: "Marques",
    showMore: "Afficher plus",
    showLess: "Afficher moins",
    viewMore: "Voir plus",
    loadMore: "Charger plus",
    
    // Messages d'état
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    warning: "Avertissement",
    info: "Information",
    noResults: "Aucun résultat",
    tryAgain: "Réessayer",
    
    // Compte utilisateur
    welcome: "Bienvenue",
    account: "Compte",
    profile: "Profil",
    myAccount: "Mon compte",
    myProfile: "Mon profil",
    myOrders: "Mes commandes",
    settings: "Paramètres",
    
    // Avis et évaluations
    customerReviews: "Avis clients",
    rating: "Note",
    review: "Avis",
    reviews: "Avis",
    writeReview: "Écrire un avis",
    
    // Footer
    companyInfo: "Informations entreprise",
    followUs: "Suivez-nous",
    newsletter: "Newsletter",
    subscribe: "S'abonner",
    
    // Messages d'erreur et validation
    required: "Requis",
    invalid: "Invalide",
    emailRequired: "Email requis",
    passwordRequired: "Mot de passe requis",
    passwordTooShort: "Mot de passe trop court",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    
    // Divers
    yes: "Oui",
    no: "Non",
    ok: "OK",
    cancel: "Annuler",
    confirm: "Confirmer",
    save: "Enregistrer",
    edit: "Modifier",
    delete: "Supprimer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    close: "Fermer"
  },
  
  en: {
    // Site metadata
    siteName: "Sanny Store",
    siteTitle: "Sanny Store - Your Shopping Destination",
    siteDescription: "Discover Sanny Store, your trusted e-commerce boutique. Wide range of products, fast delivery, exceptional customer service.",
    siteKeywords: "online store, e-commerce, shopping, fashion, electronics, beauty, home",
    developedBy: "Developed by Sanny Team",
    
    // Navigation and links
    home: "Home",
    ourStore: "Our Store",
    shop: "Shop",
    store: "Store",
    products: "Products",
    wishlist: "Wishlist",
    favorites: "Favorites",
    cart: "Cart",
    basket: "Basket",
    contact: "Contact",
    contactUs: "Contact Us",
    about: "About",
    aboutUs: "About Us",
    privacy: "Privacy",
    privacyPolicy: "Privacy Policy",
    refund: "Refund",
    refundPolicy: "Refund Policy",
    shipping: "Shipping",
    shippingPolicy: "Shipping Policy",
    terms: "Terms",
    termsAndConditions: "Terms and Conditions",
    blog: "Blog",
    blogs: "Articles",
    news: "News",
    faq: "FAQ",
    help: "Help",
    support: "Support",
    compare: "Compare",
    comparison: "Comparison",
    
    // Authentication
    login: "Login",
    logIn: "Log In",
    logout: "Logout",
    logOut: "Log Out",
    register: "Register",
    signUp: "Sign Up",
    signup: "Signup",
    forgotPassword: "Forgot Password",
    resetPassword: "Reset Password",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    firstname: "First Name",
    lastname: "Last Name",
    phone: "Phone",
    address: "Address",
    
    // Home page specific messages
    welcomeToSanny: "Welcome to Sanny Store",
    buyAndSellConfidently: "Buy and sell with confidence",
    bestOffersOfTheMoment: "Best offers of the moment",
    noPromotionsAvailable: "No promotions available",
    seeAllOffers: "See all offers",
    popularProducts: "Popular products",
    discoverMostAppreciated: "Discover our most appreciated products",
    noProductsAvailable: "No products available",
    seeAllProducts: "See all products",
    newProducts: "New products",
    latestArrivals: "Latest arrivals",
    noNewProducts: "No new products",
    seeAllNewProducts: "See all new products",
    exploreCategories: "Explore our categories",
    
    // Product actions
    addToCart: "Add to Cart",
    addToWishlist: "Add to Wishlist",
    removeFromCart: "Remove from Cart",
    removeFromWishlist: "Remove from Wishlist",
    viewDetails: "View Details",
    quickView: "Quick View",
    buyNow: "Buy Now",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    availability: "Availability",
    price: "Price",
    priceRange: "Price Range",
    unitPrice: "Unit Price",
    totalPrice: "Total Price",
    subtotal: "Subtotal",
    total: "Total",
    
    // Cart and orders
    cartTotal: "Cart Total",
    grandTotal: "Grand Total",
    checkout: "Checkout",
    orderSummary: "Order Summary",
    orderDetails: "Order Details",
    orderHistory: "Order History",
    trackOrder: "Track Order",
    quantity: "Quantity",
    
    // Payment and delivery
    paymentMethod: "Payment Method",
    paymentMethods: "Payment Methods",
    billingAddress: "Billing Address",
    deliveryAddress: "Delivery Address",
    deliveryInfo: "Delivery Info",
    deliveryOptions: "Delivery Options",
    estimatedDelivery: "Estimated Delivery",
    freeShipping: "Free Shipping",
    cashOnDelivery: "Cash on Delivery",
    
    // User interface
    search: "Search",
    searchProducts: "Search products...",
    filter: "Filter",
    sort: "Sort",
    sortBy: "Sort by",
    filterBy: "Filter by",
    category: "Category",
    categories: "Categories",
    brand: "Brand",
    brands: "Brands",
    showMore: "Show More",
    showLess: "Show Less",
    viewMore: "View More",
    loadMore: "Load More",
    
    // Status messages
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    noResults: "No results",
    tryAgain: "Try Again",
    
    // User account
    welcome: "Welcome",
    account: "Account",
    profile: "Profile",
    myAccount: "My Account",
    myProfile: "My Profile",
    myOrders: "My Orders",
    settings: "Settings",
    
    // Reviews and ratings
    customerReviews: "Customer Reviews",
    rating: "Rating",
    review: "Review",
    reviews: "Reviews",
    writeReview: "Write Review",
    
    // Footer
    companyInfo: "Company Info",
    followUs: "Follow Us",
    newsletter: "Newsletter",
    subscribe: "Subscribe",
    
    // Error and validation messages
    required: "Required",
    invalid: "Invalid",
    emailRequired: "Email required",
    passwordRequired: "Password required",
    passwordTooShort: "Password too short",
    passwordsDoNotMatch: "Passwords do not match",
    
    // Miscellaneous
    yes: "Yes",
    no: "No",
    ok: "OK",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close"
  },
  
  ar: {
    // بيانات الموقع
    siteName: "متجر ساني",
    siteTitle: "متجر ساني - وجهتك للتسوق",
    siteDescription: "اكتشف متجر ساني، متجرك الإلكتروني الموثوق. مجموعة واسعة من المنتجات، توصيل سريع، خدمة عملاء استثنائية.",
    siteKeywords: "متجر إلكتروني، تجارة إلكترونية، تسوق، موضة، إلكترونيات، جمال، منزل",
    developedBy: "تم التطوير بواسطة فريق ساني",
    
    // الروابط والتنقل
    home: "الرئيسية",
    ourStore: "متجرنا",
    shop: "متجر",
    store: "متجر",
    products: "المنتجات",
    wishlist: "قائمة الأمنيات",
    favorites: "المفضلة",
    cart: "السلة",
    basket: "السلة",
    contact: "اتصل بنا",
    contactUs: "اتصل بنا",
    about: "حول",
    aboutUs: "من نحن",
    privacy: "الخصوصية",
    privacyPolicy: "سياسة الخصوصية",
    refund: "الاسترداد",
    refundPolicy: "سياسة الاسترداد",
    shipping: "الشحن",
    shippingPolicy: "سياسة الشحن",
    terms: "الشروط",
    termsAndConditions: "الشروط والأحكام",
    blog: "المدونة",
    blogs: "المقالات",
    news: "الأخبار",
    faq: "الأسئلة الشائعة",
    help: "مساعدة",
    support: "الدعم",
    compare: "مقارنة",
    comparison: "المقارنة",
    
    // المصادقة
    login: "تسجيل الدخول",
    logIn: "دخول",
    logout: "تسجيل الخروج",
    logOut: "خروج",
    register: "التسجيل",
    signUp: "إنشاء حساب",
    signup: "التسجيل",
    forgotPassword: "نسيت كلمة المرور",
    resetPassword: "إعادة تعيين كلمة المرور",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    firstname: "الاسم الأول",
    lastname: "اسم العائلة",
    phone: "الهاتف",
    address: "العنوان",
    
    // رسائل الصفحة الرئيسية
    welcomeToSanny: "مرحباً بك في متجر ساني",
    buyAndSellConfidently: "اشترِ وبع بثقة",
    bestOffersOfTheMoment: "أفضل العروض للحظة",
    noPromotionsAvailable: "لا توجد عروض ترويجية",
    seeAllOffers: "عرض جميع العروض",
    popularProducts: "المنتجات الشائعة",
    discoverMostAppreciated: "اكتشف أكثر منتجاتنا تقديراً",
    noProductsAvailable: "لا توجد منتجات متاحة",
    seeAllProducts: "عرض جميع المنتجات",
    newProducts: "منتجات جديدة",
    latestArrivals: "آخر الوافدين",
    noNewProducts: "لا توجد منتجات جديدة",
    seeAllNewProducts: "عرض جميع المنتجات الجديدة",
    exploreCategories: "استكشف فئاتنا",
    
    // إجراءات المنتجات
    addToCart: "أضف للسلة",
    addToWishlist: "أضف للمفضلة",
    removeFromCart: "احذف من السلة",
    removeFromWishlist: "احذف من المفضلة",
    viewDetails: "عرض التفاصيل",
    quickView: "عرض سريع",
    buyNow: "اشتري الآن",
    outOfStock: "نفدت الكمية",
    inStock: "متوفر",
    availability: "التوفر",
    price: "السعر",
    priceRange: "نطاق السعر",
    unitPrice: "سعر الوحدة",
    totalPrice: "السعر الإجمالي",
    subtotal: "المجموع الفرعي",
    total: "المجموع",
    
    // السلة والطلبات
    cartTotal: "مجموع السلة",
    grandTotal: "المجموع الكلي",
    checkout: "الدفع",
    orderSummary: "ملخص الطلب",
    orderDetails: "تفاصيل الطلب",
    orderHistory: "تاريخ الطلبات",
    trackOrder: "تتبع الطلب",
    quantity: "الكمية",
    
    // الدفع والتوصيل
    paymentMethod: "طريقة الدفع",
    paymentMethods: "طرق الدفع",
    billingAddress: "عنوان الفوترة",
    deliveryAddress: "عنوان التوصيل",
    deliveryInfo: "معلومات التوصيل",
    deliveryOptions: "خيارات التوصيل",
    estimatedDelivery: "التوصيل المتوقع",
    freeShipping: "شحن مجاني",
    cashOnDelivery: "الدفع عند التوصيل",
    
    // واجهة المستخدم
    search: "بحث",
    searchProducts: "البحث عن المنتجات...",
    filter: "تصفية",
    sort: "ترتيب",
    sortBy: "ترتيب حسب",
    filterBy: "تصفية حسب",
    category: "الفئة",
    categories: "الفئات",
    brand: "العلامة التجارية",
    brands: "العلامات التجارية",
    showMore: "عرض المزيد",
    showLess: "عرض أقل",
    viewMore: "مشاهدة المزيد",
    loadMore: "تحميل المزيد",
    
    // رسائل الحالة
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    warning: "تحذير",
    info: "معلومات",
    noResults: "لا توجد نتائج",
    tryAgain: "حاول مرة أخرى",
    
    // حساب المستخدم
    welcome: "مرحباً",
    account: "الحساب",
    profile: "الملف الشخصي",
    myAccount: "حسابي",
    myProfile: "ملفي الشخصي",
    myOrders: "طلباتي",
    settings: "الإعدادات",
    
    // المراجعات والتقييمات
    customerReviews: "آراء العملاء",
    rating: "التقييم",
    review: "مراجعة",
    reviews: "المراجعات",
    writeReview: "كتابة مراجعة",
    
    // التذييل
    companyInfo: "معلومات الشركة",
    followUs: "تابعنا",
    newsletter: "النشرة الإخبارية",
    subscribe: "اشترك",
    
    // رسائل الخطأ والتحقق
    required: "مطلوب",
    invalid: "غير صحيح",
    emailRequired: "البريد الإلكتروني مطلوب",
    passwordRequired: "كلمة المرور مطلوبة",
    passwordTooShort: "كلمة المرور قصيرة جداً",
    passwordsDoNotMatch: "كلمات المرور غير متطابقة",
    
    // متنوع
    yes: "نعم",
    no: "لا",
    ok: "موافق",
    cancel: "إلغاء",
    confirm: "تأكيد",
    save: "حفظ",
    edit: "تعديل",
    delete: "حذف",
    back: "العودة",
    next: "التالي",
    previous: "السابق",
    close: "إغلاق"
  }
};

const newFileContent = `import React, { createContext, useContext, useState } from 'react';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

const translations = ${JSON.stringify(translationsFixed, null, 2)};

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');

  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  // Load language from localStorage on mount
  React.useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && translations[savedLang]) {
      setCurrentLanguage(savedLang);
    }
  }, []);

  return (
    <TranslationContext.Provider value={{ 
      t, 
      currentLanguage, 
      changeLanguage,
      availableLanguages: Object.keys(translations)
    }}>
      {children}
    </TranslationContext.Provider>
  );
};
`;

try {
  // Sauvegarde de l'ancien fichier
  const backup = fs.readFileSync(filePath, 'utf8');
  const backupPath = filePath + '.backup.' + Date.now();
  fs.writeFileSync(backupPath, backup, 'utf8');
  console.log(`💾 Sauvegarde créée: ${backupPath}`);
  
  // Écriture du nouveau fichier
  fs.writeFileSync(filePath, newFileContent, 'utf8');
  
  console.log('✅ Système de traduction corrigé avec succès !');
  console.log('\n📊 Améliorations apportées:');
  console.log('   • Syntaxe JavaScript propre');
  console.log('   • 3 langues complètes (fr, en, ar)');
  console.log('   • Clés cohérentes entre toutes les langues');
  console.log('   • Exports correctement configurés');
  console.log('   • Structure organisée et lisible');
  
  const frKeys = Object.keys(translationsFixed.fr).length;
  const enKeys = Object.keys(translationsFixed.en).length;
  const arKeys = Object.keys(translationsFixed.ar).length;
  
  console.log(`\n🌍 Clés de traduction par langue:`);
  console.log(`   • Français: ${frKeys} clés`);
  console.log(`   • Anglais: ${enKeys} clés`);
  console.log(`   • Arabe: ${arKeys} clés`);
  
} catch (error) {
  console.error('❌ Erreur lors de la correction:', error.message);
}