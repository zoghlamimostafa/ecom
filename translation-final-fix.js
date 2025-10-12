const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Client/src/contexts/TranslationContext.js');

console.log('🔧 Correction finale de la syntaxe JavaScript...');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Corrections pour les propriétés restantes avec des espaces
  const finalFixes = [
    { from: 'developed by:', to: 'developedBy:' },
    { from: 'wish list:', to: 'wishList:' },
    { from: 'sign up:', to: 'signUp:' },
    { from: 'log in:', to: 'logIn:' },
    { from: 'log out:', to: 'logOut:' },
    { from: 'contact us:', to: 'contactUs:' },
    { from: 'about us:', to: 'aboutUs:' },
    { from: 'more info:', to: 'moreInfo:' },
    { from: 'view details:', to: 'viewDetails:' },
    { from: 'view more:', to: 'viewMore:' },
    { from: 'read more:', to: 'readMore:' },
    { from: 'show more:', to: 'showMore:' },
    { from: 'show less:', to: 'showLess:' },
    { from: 'load more:', to: 'loadMore:' },
    { from: 'price range:', to: 'priceRange:' },
    { from: 'free shipping:', to: 'freeShipping:' },
    { from: 'quick view:', to: 'quickView:' },
    { from: 'add review:', to: 'addReview:' },
    { from: 'customer reviews:', to: 'customerReviews:' },
    { from: 'user account:', to: 'userAccount:' },
    { from: 'my account:', to: 'myAccount:' },
    { from: 'order history:', to: 'orderHistory:' },
    { from: 'order details:', to: 'orderDetails:' },
    { from: 'track order:', to: 'trackOrder:' },
    { from: 'payment method:', to: 'paymentMethod:' },
    { from: 'payment methods:', to: 'paymentMethods:' },
    { from: 'billing address:', to: 'billingAddress:' },
    { from: 'shipping address:', to: 'shippingAddress:' },
    { from: 'delivery address:', to: 'deliveryAddress:' },
    { from: 'delivery info:', to: 'deliveryInfo:' },
    { from: 'delivery options:', to: 'deliveryOptions:' },
    { from: 'estimated delivery:', to: 'estimatedDelivery:' },
    { from: 'order confirmation:', to: 'orderConfirmation:' },
    { from: 'order summary:', to: 'orderSummary:' },
    { from: 'shopping cart:', to: 'shoppingCart:' },
    { from: 'cart total:', to: 'cartTotal:' },
    { from: 'sub total:', to: 'subTotal:' },
    { from: 'grand total:', to: 'grandTotal:' },
    { from: 'total price:', to: 'totalPrice:' },
    { from: 'unit price:', to: 'unitPrice:' },
    { from: 'special offer:', to: 'specialOffer:' },
    { from: 'special offers:', to: 'specialOffers:' },
    { from: 'discount code:', to: 'discountCode:' },
    { from: 'promo code:', to: 'promoCode:' },
    { from: 'coupon code:', to: 'couponCode:' },
    { from: 'product details:', to: 'productDetails:' },
    { from: 'product info:', to: 'productInfo:' },
    { from: 'product description:', to: 'productDescription:' },
    { from: 'product features:', to: 'productFeatures:' },
    { from: 'product specifications:', to: 'productSpecifications:' },
    { from: 'product images:', to: 'productImages:' },
    { from: 'product gallery:', to: 'productGallery:' },
    { from: 'product reviews:', to: 'productReviews:' },
    { from: 'related products:', to: 'relatedProducts:' },
    { from: 'similar products:', to: 'similarProducts:' },
    { from: 'recommended products:', to: 'recommendedProducts:' },
    { from: 'featured products:', to: 'featuredProducts:' },
    { from: 'best sellers:', to: 'bestSellers:' },
    { from: 'new arrivals:', to: 'newArrivals:' },
    { from: 'top rated:', to: 'topRated:' },
    { from: 'on sale:', to: 'onSale:' },
    { from: 'in stock:', to: 'inStock:' },
    { from: 'stock status:', to: 'stockStatus:' },
    { from: 'availability:', to: 'availability:' }
  ];
  
  console.log(`🔍 Application de ${finalFixes.length} corrections finales...`);
  
  let correctionCount = 0;
  finalFixes.forEach(fix => {
    const regex = new RegExp(fix.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, fix.to);
      correctionCount += matches.length;
      console.log(`✅ ${fix.from} → ${fix.to} (${matches.length} occurrence(s))`);
    }
  });
  
  // Correction des quotes manquantes pour les propriétés avec espaces restantes
  console.log('\n🔍 Correction des propriétés avec espaces...');
  
  // Regex pour trouver les propriétés avec espaces non quotées
  const spacePropertyRegex = /^(\s*)([a-zA-Z][a-zA-Z0-9]*\s+[a-zA-Z][a-zA-Z0-9\s]*)\s*:/gm;
  
  content = content.replace(spacePropertyRegex, (match, indent, property, colon) => {
    if (!property.includes('"') && !property.includes("'")) {
      console.log(`✅ "${property}" → "${property}"`);
      return `${indent}"${property}":`;
    }
    return match;
  });
  
  // Sauvegarde du fichier corrigé
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✅ ${correctionCount} corrections finales appliquées avec succès!`);
  console.log(`📁 Fichier mis à jour: ${filePath}`);
  
} catch (error) {
  console.error('❌ Erreur lors de la correction finale:', error.message);
  process.exit(1);
}