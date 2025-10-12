// Script spécialisé pour corriger les mots collés dans les traductions Sanny Store
const fs = require('fs');

const TRANSLATION_FILE = 'C:/xampp/htdocs/sanny/san/ecomerce_sanny/Client/src/contexts/TranslationContext.js';

// Corrections spécifiques identifiées
const specificCorrections = {
  // Français - mots collés courants
  'Contactez-nous': 'Contactez-nous', // Déjà correct
  'serviceclient': 'service client',
  'livraison rapide': 'livraison rapide', // Déjà correct
  'modepaiement': 'mode paiement',
  'cartecadeau': 'carte cadeau',
  'boutiqueen ligne': 'boutique en ligne',
  'ajouterau panier': 'ajouter au panier',
  'listedesouhaits': 'liste de souhaits',
  'compteUtilisateur': 'compte utilisateur',
  'adresselivraison': 'adresse livraison',
  'historiquecommandes': 'historique commandes',
  'parametrescompte': 'paramètres compte',
  'politiqueconfidentialite': 'politique confidentialité',
  'conditionsgenerales': 'conditions générales',
  'questionsfrequentes': 'questions fréquentes',
  'avisclients': 'avis clients',
  'nouveauproduit': 'nouveau produit',
  'produitpopulaire': 'produit populaire',
  'offrespeciale': 'offre spéciale',
  'promojour': 'promo jour',
  'ventflash': 'vent flash',
  'livraisongratuite': 'livraison gratuite',
  'livraisonexpress': 'livraison express',
  'retourproduit': 'retour produit',
  'echangeproduit': 'échange produit',
  'guidetailles': 'guide tailles',
  'optionscouleur': 'options couleur',
  'stockdisponible': 'stock disponible',
  'rupturestock': 'rupture stock',
  'commandeenvoyee': 'commande envoyée',
  'commandelivree': 'commande livrée',
  
  // Anglais - mots collés courants
  'shoppingcart': 'shopping cart',
  'wishlist': 'wish list',
  'checkout': 'check out',
  'signup': 'sign up',
  'login': 'log in',
  'logout': 'log out',
  'homepage': 'home page',
  'customerservice': 'customer service',
  'paymentmethod': 'payment method',
  'shippingaddress': 'shipping address',
  'billingaddress': 'billing address',
  'orderhistory': 'order history',
  'userprofile': 'user profile',
  'accountsettings': 'account settings',
  'privacypolicy': 'privacy policy',
  'termsofservice': 'terms of service',
  'frequentlyaskedquestions': 'frequently asked questions',
  'customerreviews': 'customer reviews',
  'productdetails': 'product details',
  'sizeguide': 'size guide',
  'coloroptions': 'color options',
  'instock': 'in stock',
  'outofstock': 'out of stock',
  'backorder': 'back order',
  'freeshipping': 'free shipping',
  'expressdelivery': 'express delivery',
  'returnpolicy': 'return policy',
  'exchangepolicy': 'exchange policy',
  'giftcard': 'gift card',
  'discountcode': 'discount code',
  'promocode': 'promo code',
  'specialoffer': 'special offer',
  'dailydeals': 'daily deals',
  'flashsale': 'flash sale',
  'bestseller': 'best seller',
  'newarrival': 'new arrival',
  'toprated': 'top rated',
  'mostpopular': 'most popular',
  'recommendedfor': 'recommended for',
  'similarproducts': 'similar products',
  'relateditems': 'related items',
  'viewmore': 'view more',
  'showless': 'show less',
  'loadmore': 'load more',
  'sortby': 'sort by',
  'filterby': 'filter by',
  'searchresults': 'search results',
  'noresults': 'no results',
  'tryagain': 'try again',
  'goback': 'go back',
  'nextpage': 'next page',
  'previouspage': 'previous page',
  'firstpage': 'first page',
  'lastpage': 'last page',
  
  // Arabe - mots collés identifiés
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
  'الصفحةالأخيرة': 'الصفحة الأخيرة',
  'إضافةإلىالسلة': 'إضافة إلى السلة',
  'إضافةإلىالمفضلة': 'إضافة إلى المفضلة',
  'إزالةمنالسلة': 'إزالة من السلة',
  'إزالةمنالمفضلة': 'إزالة من المفضلة',
  'تحديثالسلة': 'تحديث السلة',
  'إفراغالسلة': 'إفراغ السلة',
  'متابعةالتسوق': 'متابعة التسوق',
  'إنهاءالطلب': 'إنهاء الطلب',
  'تأكيدالطلب': 'تأكيد الطلب',
  'إلغاءالطلب': 'إلغاء الطلب',
  'تتبعالطلب': 'تتبع الطلب',
  'حالةالطلب': 'حالة الطلب',
  'رقمالطلب': 'رقم الطلب',
  'تاريخالطلب': 'تاريخ الطلب',
  'مجموعالطلب': 'مجموع الطلب',
  'رسومالشحن': 'رسوم الشحن',
  'الضرائب': 'الضرائب',
  'المجموعالنهائي': 'المجموع النهائي'
};

function fixTranslations() {
  try {
    console.log('🔧 Correction des mots collés dans les traductions...');
    
    let content = fs.readFileSync(TRANSLATION_FILE, 'utf8');
    let corrections = 0;
    
    // Appliquer les corrections spécifiques
    Object.entries(specificCorrections).forEach(([wrong, correct]) => {
      const beforeCount = content.split(wrong).length - 1;
      content = content.replaceAll(wrong, correct);
      const afterCount = content.split(wrong).length - 1;
      if (beforeCount > afterCount) {
        corrections += (beforeCount - afterCount);
        console.log(`✅ "${wrong}" → "${correct}" (${beforeCount - afterCount} fois)`);
      }
    });
    
    // Corrections automatiques supplémentaires pour camelCase dans les valeurs
    const camelCaseRegex = /("[^"]*?)([a-z])([A-Z])([a-z][^"]*?")/g;
    content = content.replace(camelCaseRegex, (match, start, lowerChar, upperChar, end) => {
      const original = match;
      const corrected = `${start}${lowerChar} ${upperChar.toLowerCase()}${end}`;
      if (original !== corrected) {
        corrections++;
        console.log(`🔄 CamelCase: ${original} → ${corrected}`);
      }
      return corrected;
    });
    
    // Corrections pour les mots très longs sans espaces (probablement collés)
    const longWordRegex = /("[^"]*?)([a-zA-Z]{20,})([^"]*?")/g;
    content = content.replace(longWordRegex, (match, start, longWord, end) => {
      // Diviser les mots très longs en ajoutant des espaces avant les majuscules
      const spaced = longWord.replace(/([a-z])([A-Z])/g, '$1 $2');
      if (longWord !== spaced) {
        corrections++;
        console.log(`📏 Mot long: "${longWord}" → "${spaced}"`);
        return `${start}${spaced}${end}`;
      }
      return match;
    });
    
    // Sauvegarder le fichier corrigé
    if (corrections > 0) {
      fs.writeFileSync(TRANSLATION_FILE, content, 'utf8');
      console.log(`\n✅ ${corrections} corrections appliquées avec succès!`);
      console.log(`📁 Fichier mis à jour: ${TRANSLATION_FILE}`);
    } else {
      console.log('✨ Aucune correction nécessaire - le fichier est déjà correct!');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Fonction pour vérifier les mots potentiellement collés
function findPotentialIssues() {
  try {
    const content = fs.readFileSync(TRANSLATION_FILE, 'utf8');
    console.log('\n🔍 Recherche de mots potentiellement collés...');
    
    // Extraire toutes les chaînes de traduction
    const stringMatches = content.match(/"[^"]+"/g) || [];
    const issues = [];
    
    stringMatches.forEach(str => {
      const clean = str.slice(1, -1); // Enlever les guillemets
      
      // Chercher les mots sans espaces appropriés
      if (clean.length > 15 && !clean.includes(' ') && /[a-zA-Z]/.test(clean)) {
        issues.push(clean);
      }
      
      // Chercher les mots arabes très longs sans espaces
      if (clean.length > 10 && /[\u0600-\u06FF]{10,}/.test(clean)) {
        issues.push(clean);
      }
    });
    
    if (issues.length > 0) {
      console.log(`⚠️  ${issues.length} mots potentiellement collés détectés:`);
      issues.slice(0, 20).forEach((issue, index) => {
        console.log(`${index + 1}. "${issue}"`);
      });
      if (issues.length > 20) {
        console.log(`... et ${issues.length - 20} autres`);
      }
    } else {
      console.log('✅ Aucun mot potentiellement collé détecté!');
    }
    
    return issues;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
    return [];
  }
}

// Exécution
console.log('🚀 Correction Spécialisée des Mots Collés - Sanny Store');
console.log('====================================================');

findPotentialIssues();
fixTranslations();
findPotentialIssues(); // Vérification finale

console.log('\n✨ Correction terminée!');