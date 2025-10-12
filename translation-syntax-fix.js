const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Client/src/contexts/TranslationContext.js');

console.log('🔧 Correction de la syntaxe JavaScript...');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Corrections pour réparer la syntaxe JavaScript
  const fixes = [
    // Métadonnées du site
    { from: 'site title:', to: 'siteTitle:' },
    { from: 'site description:', to: 'siteDescription:' },
    { from: 'site keywords:', to: 'siteKeywords:' },
    
    // Titres de pages
    { from: 'store page title:', to: 'storePageTitle:' },
    { from: 'store page description:', to: 'storePageDescription:' },
    { from: 'store page keywords:', to: 'storePageKeywords:' },
    { from: 'contact page title:', to: 'contactPageTitle:' },
    { from: 'contact page description:', to: 'contactPageDescription:' },
    { from: 'contact page keywords:', to: 'contactPageKeywords:' },
    { from: 'cart page title:', to: 'cartPageTitle:' },
    { from: 'cart page description:', to: 'cartPageDescription:' },
    { from: 'cart page keywords:', to: 'cartPageKeywords:' },
    { from: 'log in page title:', to: 'loginPageTitle:' },
    { from: 'log in page description:', to: 'loginPageDescription:' },
    { from: 'log in page keywords:', to: 'loginPageKeywords:' },
    { from: 'home page title:', to: 'homePageTitle:' },
    { from: 'home page description:', to: 'homePageDescription:' },
    { from: 'home page keywords:', to: 'homePageKeywords:' },
    { from: 'about page title:', to: 'aboutPageTitle:' },
    { from: 'about page description:', to: 'aboutPageDescription:' },
    { from: 'about page keywords:', to: 'aboutPageKeywords:' },
    
    // Actions de produits
    { from: 'add to cart:', to: 'addToCart:' },
    { from: 'add to wishlist:', to: 'addToWishlist:' },
    { from: 'remove from wishlist:', to: 'removeFromWishlist:' },
    { from: 'remove from cart:', to: 'removeFromCart:' },
    { from: 'out of stock:', to: 'outOfStock:' },
    { from: 'add to wishlistTitle:', to: 'addToWishlistTitle:' },
    { from: 'remove from wishlistTitle:', to: 'removeFromWishlistTitle:' },
    
    // Messages de validation
    { from: 'firstname too short:', to: 'firstnameTooShort:' },
    { from: 'lastname too short:', to: 'lastnameTooShort:' },
    { from: 'password too short:', to: 'passwordTooShort:' },
    { from: 'passwords do notMatch:', to: 'passwordsDoNotMatch:' },
    { from: 'confirm password required:', to: 'confirmPasswordRequired:' },
    { from: 'account created successfully:', to: 'accountCreatedSuccessfully:' },
    { from: 'redirecting to login:', to: 'redirectingToLogin:' },
    { from: 'already have account:', to: 'alreadyHaveAccount:' },
    { from: 'back to home:', to: 'backToHome:' },
    
    // Messages du magasin
    { from: 'no products found:', to: 'noProductsFound:' },
    { from: 'try modifying search:', to: 'tryModifyingSearch:' },
    { from: 'clear all filters:', to: 'clearAllFilters:' },
    
    // Page de paiement
    { from: 'fill all requiredFields:', to: 'fillAllRequiredFields:' },
    { from: 'payment failed try Again:', to: 'paymentFailedTryAgain:' },
    { from: 'error processing try Again:', to: 'errorProcessingTryAgain:' },
    { from: 'order number placeholder:', to: 'orderNumberPlaceholder:' },
    { from: 'amount in tnd:', to: 'amountInTnd:' },
    { from: 'payment method idPlaceholder:', to: 'paymentMethodIdPlaceholder:' },
    { from: 'back to articles:', to: 'backToArticles:' },
    { from: 'see more articles:', to: 'seeMoreArticles:' },
    { from: 'article not found:', to: 'articleNotFound:' },
    { from: 'cash on delivery:', to: 'cashOnDelivery:' },
    
    // Catégories
    { from: 'category fashion clothing:', to: 'categoryFashionClothing:' },
    { from: 'category fashion desc:', to: 'categoryFashionDesc:' },
    { from: 'category women fashion:', to: 'categoryWomenFashion:' },
    { from: 'category women fashionDesc:', to: 'categoryWomenFashionDesc:' },
    { from: 'category men fashion:', to: 'categoryMenFashion:' },
    { from: 'category men fashionDesc:', to: 'categoryMenFashionDesc:' },
    { from: 'category women shoes:', to: 'categoryWomenShoes:' },
    { from: 'category women shoesDesc:', to: 'categoryWomenShoesDesc:' },
    { from: 'category men shoes:', to: 'categoryMenShoes:' },
    { from: 'category men shoesDesc:', to: 'categoryMenShoesDesc:' },
    { from: 'category auto moto:', to: 'categoryAutoMoto:' },
    { from: 'category auto motoDesc:', to: 'categoryAutoMotoDesc:' },
    { from: 'category auto parts:', to: 'categoryAutoParts:' },
    { from: 'category auto partsDesc:', to: 'categoryAutoPartsDesc:' },
    { from: 'category auto accessories:', to: 'categoryAutoAccessories:' },
    { from: 'category auto accessoriesDesc:', to: 'categoryAutoAccessoriesDesc:' },
    { from: 'category tires wheels:', to: 'categoryTiresWheels:' },
    { from: 'category tires wheelsDesc:', to: 'categoryTiresWheelsDesc:' },
    { from: 'category car maintenance:', to: 'categoryCarMaintenance:' },
    { from: 'category car maintenanceDesc:', to: 'categoryCarMaintenanceDesc:' },
    { from: 'category moto equipment:', to: 'categoryMotoEquipment:' },
    { from: 'category moto equipmentDesc:', to: 'categoryMotoEquipmentDesc:' },
    { from: 'category moto parts:', to: 'categoryMotoParts:' },
    { from: 'category moto partsDesc:', to: 'categoryMotoPartsDesc:' },
    { from: 'category electronics desc:', to: 'categoryElectronicsDesc:' },
    { from: 'category smartphones desc:', to: 'categorySmartphonesDesc:' },
    { from: 'category computers desc:', to: 'categoryComputersDesc:' },
    { from: 'category tVAudio desc:', to: 'categoryTVAudioDesc:' },
    { from: 'category tablets desc:', to: 'categoryTabletsDesc:' },
    { from: 'category gaming desc:', to: 'categoryGamingDesc:' },
    { from: 'category tech accessories:', to: 'categoryTechAccessories:' },
    { from: 'category tech accessoriesDesc:', to: 'categoryTechAccessoriesDesc:' },
    { from: 'category photo video:', to: 'categoryPhotoVideo:' },
    { from: 'category photo videoDesc:', to: 'categoryPhotoVideoDesc:' },
    { from: 'category home garden:', to: 'categoryHomeGarden:' },
    { from: 'category home gardenDesc:', to: 'categoryHomeGardenDesc:' },
    { from: 'category furniture desc:', to: 'categoryFurnitureDesc:' },
    { from: 'category gardening desc:', to: 'categoryGardeningDesc:' },
    { from: 'category decoration desc:', to: 'categoryDecorationDesc:' },
    { from: 'category appliances desc:', to: 'categoryAppliancesDesc:' },
    { from: 'category bedding desc:', to: 'categoryBeddingDesc:' },
    { from: 'category lighting desc:', to: 'categoryLightingDesc:' },
    { from: 'category sport leisure:', to: 'categorySportLeisure:' },
    { from: 'category sport leisureDesc:', to: 'categorySportLeisureDesc:' },
    { from: 'category fitness desc:', to: 'categoryFitnessDesc:' },
    { from: 'category team sports:', to: 'categoryTeamSports:' },
    { from: 'category team sportsDesc:', to: 'categoryTeamSportsDesc:' },
    { from: 'category individual sports:', to: 'categoryIndividualSports:' },
    { from: 'category individual sportsDesc:', to: 'categoryIndividualSportsDesc:' },
    { from: 'category outdoor desc:', to: 'categoryOutdoorDesc:' },
    { from: 'category water sports:', to: 'categoryWaterSports:' },
    { from: 'category water sportsDesc:', to: 'categoryWaterSportsDesc:' },
    { from: 'category sports wear:', to: 'categorySportsWear:' },
    { from: 'category sports wearDesc:', to: 'categorySportsWearDesc:' },
    { from: 'category health beauty:', to: 'categoryHealthBeauty:' },
    { from: 'category health beautyDesc:', to: 'categoryHealthBeautyDesc:' },
    { from: 'category cosmetics desc:', to: 'categoryCosmeticsDesc:' },
    { from: 'category face care:', to: 'categoryFaceCare:' },
    { from: 'category face careDesc:', to: 'categoryFaceCareDesc:' },
    { from: 'category perfumes desc:', to: 'categoryPerfumesDesc:' },
    { from: 'category body care:', to: 'categoryBodyCare:' },
    { from: 'category body careDesc:', to: 'categoryBodyCareDesc:' },
    { from: 'category health desc:', to: 'categoryHealthDesc:' },
    { from: 'category hair care:', to: 'categoryHairCare:' },
    { from: 'category hair careDesc:', to: 'categoryHairCareDesc:' },
    { from: 'category kids babies:', to: 'categoryKidsBabies:' },
    { from: 'category kids babiesDesc:', to: 'categoryKidsBabiesDesc:' },
    { from: 'category baby clothes:', to: 'categoryBabyClothes:' },
    { from: 'category baby clothesDesc:', to: 'categoryBabyClothesDesc:' },
    { from: 'category toys desc:', to: 'categoryToysDesc:' },
    { from: 'category baby food:', to: 'categoryBabyFood:' },
    { from: 'category baby foodDesc:', to: 'categoryBabyFoodDesc:' },
    { from: 'category kids furniture:', to: 'categoryKidsFurniture:' },
    { from: 'category kids furnitureDesc:', to: 'categoryKidsFurnitureDesc:' },
    { from: 'category strollers seats:', to: 'categoryStrollersSeats:' },
    { from: 'category strollers seatsDesc:', to: 'categoryStrollersSeatsDesc:' },
    { from: 'category baby hygiene:', to: 'categoryBabyHygiene:' },
    { from: 'category baby hygieneDesc:', to: 'categoryBabyHygieneDesc:' },
    { from: 'category pets desc:', to: 'categoryPetsDesc:' },
    { from: 'category dogs desc:', to: 'categoryDogsDesc:' },
    { from: 'category cats desc:', to: 'categoryCatsDesc:' },
    { from: 'category birds desc:', to: 'categoryBirdsDesc:' },
    { from: 'category food desc:', to: 'categoryFoodDesc:' },
    { from: 'category grocery desc:', to: 'categoryGroceryDesc:' },
    { from: 'category organic desc:', to: 'categoryOrganicDesc:' },
    { from: 'category beverages desc:', to: 'categoryBeveragesDesc:' },
    { from: 'category books desc:', to: 'categoryBooksDesc:' },
    { from: 'category books only:', to: 'categoryBooksOnly:' },
    { from: 'category books onlyDesc:', to: 'categoryBooksOnlyDesc:' },
    { from: 'category movies desc:', to: 'categoryMoviesDesc:' },
    { from: 'category music desc:', to: 'categoryMusicDesc:' },
    { from: 'category tools desc:', to: 'categoryToolsDesc:' },
    { from: 'category materials desc:', to: 'categoryMaterialsDesc:' },
    { from: 'category safety desc:', to: 'categorySafetyDesc:' },
    { from: 'category office desc:', to: 'categoryOfficeDesc:' },
    { from: 'category office supplies:', to: 'categoryOfficeSupplies:' },
    { from: 'category office suppliesDesc:', to: 'categoryOfficeSuppliesDesc:' },
    { from: 'category office furniture:', to: 'categoryOfficeFurniture:' },
    { from: 'category office furnitureDesc:', to: 'categoryOfficeFurnitureDesc:' },
    
    // Page d'accueil
    { from: 'our partner brands:', to: 'ourPartnerBrands:' },
    { from: 'fast delivery carousel:', to: 'fastDeliveryCarousel:' },
    { from: 'secure payment carousel:', to: 'securePaymentCarousel:' },
    { from: 'free return carousel:', to: 'freeReturnCarousel:' },
    { from: 'express delivery carousel:', to: 'expressDeliveryCarousel:' },
    { from: 'quality guarantee carousel:', to: 'qualityGuaranteeCarousel:' },
    { from: 'your trusted partner:', to: 'yourTrustedPartner:' },
    { from: 'revolutionize online shopping:', to: 'revolutionizeOnlineShopping:' },
    { from: 'discover our store:', to: 'discoverOurStore:' },
    { from: 'welcome to sanny:', to: 'welcomeToSanny:' },
    { from: 'buy and sellConfidently:', to: 'buyAndSellConfidently:' },
    { from: 'best offers ofTheMoment:', to: 'bestOffersOfTheMoment:' },
    { from: 'no promotions available:', to: 'noPromotionsAvailable:' },
    { from: 'see all offers:', to: 'seeAllOffers:' },
    { from: 'discover most appreciated:', to: 'discoverMostAppreciated:' },
    { from: 'no products available:', to: 'noProductsAvailable:' },
    { from: 'see all products:', to: 'seeAllProducts:' },
    { from: 'no new products:', to: 'noNewProducts:' },
    { from: 'see all newProducts:', to: 'seeAllNewProducts:' },
    { from: 'why choose sanny:', to: 'whyChooseSanny:' },
    { from: 'why choose sannySubtitle:', to: 'whyChooseSannySubtitle:' },
    { from: 'fast service description:', to: 'fastServiceDescription:' },
    { from: 'reliable transactions description:', to: 'reliableTransactionsDescription:' },
    { from: 'secure payment description:', to: 'securePaymentDescription:' },
    
    // Magasin
    { from: 'our store:', to: 'ourStore:' }
  ];
  
  console.log(`🔍 Application de ${fixes.length} corrections de syntaxe...`);
  
  let correctionCount = 0;
  fixes.forEach(fix => {
    const regex = new RegExp(fix.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, fix.to);
      correctionCount += matches.length;
      console.log(`✅ ${fix.from} → ${fix.to} (${matches.length} occurrence(s))`);
    }
  });
  
  // Sauvegarde du fichier corrigé
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✅ ${correctionCount} corrections de syntaxe appliquées avec succès!`);
  console.log(`📁 Fichier mis à jour: ${filePath}`);
  
} catch (error) {
  console.error('❌ Erreur lors de la correction de syntaxe:', error.message);
  process.exit(1);
}