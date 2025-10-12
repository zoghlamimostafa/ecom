// Script de correction de l'espacement dans les traductions
const fs = require('fs');
const path = require('path');

const TRANSLATION_FILE = 'C:/xampp/htdocs/sanny/san/ecomerce_sanny/Client/src/contexts/TranslationContext.js';

// Dictionnaire des corrections communes pour séparer les mots
const corrections = {
  // Général
  'ContactUs': 'Contact Us',
  'AboutUs': 'About Us',
  'SignUp': 'Sign Up',
  'LogIn': 'Log In',
  'SignOut': 'Sign Out',
  'CheckOut': 'Check Out',
  'WishList': 'Wish List',
  'ShoppingCart': 'Shopping Cart',
  'HomePage': 'Home Page',
  'SiteMap': 'Site Map',
  'CustomerService': 'Customer Service',
  'PaymentMethod': 'Payment Method',
  'ShippingAddress': 'Shipping Address',
  'BillingAddress': 'Billing Address',
  'OrderHistory': 'Order History',
  'UserProfile': 'User Profile',
  'AccountSettings': 'Account Settings',
  'PrivacyPolicy': 'Privacy Policy',
  'TermsOfService': 'Terms of Service',
  'FrequentlyAskedQuestions': 'Frequently Asked Questions',
  'CustomerReviews': 'Customer Reviews',
  'ProductDetails': 'Product Details',
  'SizeGuide': 'Size Guide',
  'ColorOptions': 'Color Options',
  'InStock': 'In Stock',
  'OutOfStock': 'Out of Stock',
  'BackOrder': 'Back Order',
  'FreeShipping': 'Free Shipping',
  'ExpressDelivery': 'Express Delivery',
  'ReturnPolicy': 'Return Policy',
  'ExchangePolicy': 'Exchange Policy',
  'GiftCard': 'Gift Card',
  'DiscountCode': 'Discount Code',
  'PromoCode': 'Promo Code',
  'SpecialOffer': 'Special Offer',
  'DailyDeals': 'Daily Deals',
  'FlashSale': 'Flash Sale',
  'BestSeller': 'Best Seller',
  'NewArrival': 'New Arrival',
  'TopRated': 'Top Rated',
  'MostPopular': 'Most Popular',
  'RecommendedFor': 'Recommended For',
  'SimilarProducts': 'Similar Products',
  'RelatedItems': 'Related Items',
  'ViewMore': 'View More',
  'ShowLess': 'Show Less',
  'LoadMore': 'Load More',
  'SortBy': 'Sort By',
  'FilterBy': 'Filter By',
  'SearchResults': 'Search Results',
  'NoResults': 'No Results',
  'TryAgain': 'Try Again',
  'GoBack': 'Go Back',
  'NextPage': 'Next Page',
  'PreviousPage': 'Previous Page',
  'FirstPage': 'First Page',
  'LastPage': 'Last Page',
  
  // Français
  'AccueilPage': 'Accueil Page',
  'NotreBoutique': 'Notre Boutique',
  'ServiceClient': 'Service Client',
  'PolitiqueDeConfidentialite': 'Politique de Confidentialité',
  'ConditionsGenerales': 'Conditions Générales',
  'ModeDePaiement': 'Mode de Paiement',
  'AdresseDeLivraison': 'Adresse de Livraison',
  'AdresseDeFacturation': 'Adresse de Facturation',
  'HistoriqueCommandes': 'Historique Commandes',
  'ProfilUtilisateur': 'Profil Utilisateur',
  'ParametresCompte': 'Paramètres Compte',
  'QuestionsFrequentes': 'Questions Fréquentes',
  'AvisClients': 'Avis Clients',
  'DetailsProduites': 'Détails Produits',
  'GuideDesTailles': 'Guide des Tailles',
  'OptionsColor': 'Options Couleur',
  'EnStock': 'En Stock',
  'RuptureStock': 'Rupture Stock',
  'LivraisonGratuite': 'Livraison Gratuite',
  'LivraisonExpress': 'Livraison Express',
  'PolitiqueRetour': 'Politique Retour',
  'PolitiqueEchange': 'Politique Échange',
  'CartesCadeaux': 'Cartes Cadeaux',
  'CodeReduction': 'Code Réduction',
  'CodePromo': 'Code Promo',
  'OffreSpeciale': 'Offre Spéciale',
  'PromoJour': 'Promo Jour',
  'VenteFlash': 'Vente Flash',
  'MeilleureVente': 'Meilleure Vente',
  'NouvelleArrivee': 'Nouvelle Arrivée',
  'MieuxNote': 'Mieux Noté',
  'PlusPopulaire': 'Plus Populaire',
  'RecommandePour': 'Recommandé Pour',
  'ProduitsSimilaires': 'Produits Similaires',
  'ArticlesConnexes': 'Articles Connexes',
  'VoirPlus': 'Voir Plus',
  'VoirMoins': 'Voir Moins',
  'ChargerPlus': 'Charger Plus',
  'TrierPar': 'Trier Par',
  'FiltrerPar': 'Filtrer Par',
  'ResultatsRecherche': 'Résultats Recherche',
  'AucunResultat': 'Aucun Résultat',
  'EssayerNouveau': 'Essayer Nouveau',
  'RetourArriere': 'Retour Arrière',
  'PageSuivante': 'Page Suivante',
  'PagePrecedente': 'Page Précédente',
  'PremierePage': 'Première Page',
  'DernierePage': 'Dernière Page',
  
  // Arabe (common issues)
  'الصفحةالرئيسية': 'الصفحة الرئيسية',
  'خدمةالعملاء': 'خدمة العملاء',
  'سياسةالخصوصية': 'سياسة الخصوصية',
  'الشروطوالأحكام': 'الشروط والأحكام',
  'طريقةالدفع': 'طريقة الدفع',
  'عنوانالتسليم': 'عنوان التسليم',
  'عنوانالفوترة': 'عنوان الفوترة',
  'تاريخالطلبات': 'تاريخ الطلبات',
  'ملفالمستخدم': 'ملف المستخدم',
  'إعداداتالحساب': 'إعدادات الحساب',
  'الأسئلةالشائعة': 'الأسئلة الشائعة',
  'آراءالعملاء': 'آراء العملاء',
  'تفاصيلالمنتج': 'تفاصيل المنتج',
  'دليلالأحجام': 'دليل الأحجام',
  'خياراتاللون': 'خيارات اللون',
  'متوفرفيالمخزن': 'متوفر في المخزن',
  'نفدمنالمخزن': 'نفد من المخزن',
  'الشحنالمجاني': 'الشحن المجاني',
  'التوصيلالسريع': 'التوصيل السريع',
  'سياسةالإرجاع': 'سياسة الإرجاع',
  'سياسةالاستبدال': 'سياسة الاستبدال',
  'بطاقةهدية': 'بطاقة هدية',
  'كودالخصم': 'كود الخصم',
  'الكودالترويجي': 'الكود الترويجي',
  'عرضخاص': 'عرض خاص',
  'صفقاتاليوم': 'صفقات اليوم',
  'تخفيضاتسريعة': 'تخفيضات سريعة',
  'الأكثرمبيعا': 'الأكثر مبيعا',
  'وصولجديد': 'وصول جديد',
  'الأعلىتقييما': 'الأعلى تقييما',
  'الأكثرشعبية': 'الأكثر شعبية',
  'موصىبه': 'موصى به',
  'منتجاتمشابهة': 'منتجات مشابهة',
  'عناصرذاتصلة': 'عناصر ذات صلة',
  'عرضالمزيد': 'عرض المزيد',
  'عرضأقل': 'عرض أقل',
  'تحميلالمزيد': 'تحميل المزيد',
  'ترتيبحسب': 'ترتيب حسب',
  'تصفيةحسب': 'تصفية حسب',
  'نتائجالبحث': 'نتائج البحث',
  'لاتوجدنتائج': 'لا توجد نتائج',
  'حاولمرةأخرى': 'حاول مرة أخرى',
  'العودةللخلف': 'العودة للخلف',
  'الصفحةالتالية': 'الصفحة التالية',
  'الصفحةالسابقة': 'الصفحة السابقة',
  'الصفحةالأولى': 'الصفحة الأولى',
  'الصفحةالأخيرة': 'الصفحة الأخيرة'
};

function findUnseparatedWords(text) {
  const issues = [];
  
  // Regex pour trouver les mots collés (camelCase ou mots sans espaces)
  const patterns = [
    // CamelCase: mot + Majuscule + mot
    /([a-z])([A-Z])/g,
    // Mots arabes collés (caractères arabes sans espaces appropriés)
    /[\u0600-\u06FF]{3,}[\u0600-\u06FF]{3,}/g,
    // Mots français/anglais très longs sans espaces
    /[a-zA-Z]{15,}/g
  ];
  
  patterns.forEach((pattern, index) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      issues.push({
        type: `Pattern ${index + 1}`,
        match: match[0],
        position: match.index,
        line: text.substring(0, match.index).split('\n').length
      });
    }
  });
  
  return issues;
}

function applyCorrections(content) {
  let correctedContent = content;
  
  // Appliquer les corrections du dictionnaire
  Object.entries(corrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`"([^"]*?)${wrong}([^"]*?)"`, 'g');
    correctedContent = correctedContent.replace(regex, (match, before, after) => {
      return `"${before}${correct}${after}"`;
    });
  });
  
  // Corrections automatiques pour camelCase dans les chaînes
  correctedContent = correctedContent.replace(/"([^"]*?)([a-z])([A-Z])([^"]*?)"/g, (match, before, lowerChar, upperChar, after) => {
    return `"${before}${lowerChar} ${upperChar.toLowerCase()}${after}"`;
  });
  
  return correctedContent;
}

function analyzeTranslationFile() {
  try {
    console.log('🔍 Analyse du fichier de traduction...');
    
    const content = fs.readFileSync(TRANSLATION_FILE, 'utf8');
    const issues = findUnseparatedWords(content);
    
    console.log(`\n📊 Résultats de l'analyse:`);
    console.log(`- Fichier analysé: ${TRANSLATION_FILE}`);
    console.log(`- Problèmes détectés: ${issues.length}`);
    
    if (issues.length > 0) {
      console.log('\n⚠️  Problèmes détectés:');
      issues.slice(0, 20).forEach((issue, index) => {
        console.log(`${index + 1}. Ligne ${issue.line}: "${issue.match}" (${issue.type})`);
      });
      
      if (issues.length > 20) {
        console.log(`... et ${issues.length - 20} autres problèmes`);
      }
      
      console.log('\n🔧 Application des corrections...');
      const correctedContent = applyCorrections(content);
      
      // Sauvegarder le fichier corrigé
      const backupFile = TRANSLATION_FILE.replace('.js', '_backup.js');
      fs.writeFileSync(backupFile, content, 'utf8');
      fs.writeFileSync(TRANSLATION_FILE, correctedContent, 'utf8');
      
      console.log(`✅ Corrections appliquées!`);
      console.log(`📁 Sauvegarde créée: ${backupFile}`);
      console.log(`📁 Fichier corrigé: ${TRANSLATION_FILE}`);
      
      // Analyser les corrections apportées
      const newIssues = findUnseparatedWords(correctedContent);
      console.log(`\n📈 Résultats après correction:`);
      console.log(`- Problèmes corrigés: ${issues.length - newIssues.length}`);
      console.log(`- Problèmes restants: ${newIssues.length}`);
      
      if (newIssues.length > 0) {
        console.log('\n⚠️  Problèmes restants (nécessitent une correction manuelle):');
        newIssues.slice(0, 10).forEach((issue, index) => {
          console.log(`${index + 1}. Ligne ${issue.line}: "${issue.match}"`);
        });
      }
    } else {
      console.log('✅ Aucun problème d\'espacement détecté!');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error.message);
  }
}

// Test des corrections
function testCorrections() {
  console.log('\n🧪 Test des corrections:');
  
  const testCases = [
    'ContactUs',
    'ServiceClient', 
    'CustomerService',
    'الصفحةالرئيسية',
    'NotreBoutique',
    'ShoppingCart'
  ];
  
  testCases.forEach(test => {
    const corrected = corrections[test] || 'Pas de correction disponible';
    console.log(`"${test}" → "${corrected}"`);
  });
}

// Exécution
console.log('🚀 Script de Correction des Espaces dans les Traductions');
console.log('==================================================');

testCorrections();
analyzeTranslationFile();

console.log('\n✨ Analyse terminée!');