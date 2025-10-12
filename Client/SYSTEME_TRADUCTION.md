# 📖 Système de Traduction - Sanny Store

## 🌐 Vue d'ensemble

Le système de traduction de Sanny Store permet de supporter **3 langues** :
- **🇫🇷 Français** (par défaut)
- **🇬🇧 Anglais**
- **🇸🇦 Arabe**

## 🏗️ Architecture

### 📁 Fichier principal : `src/contexts/TranslationContext.js`

Ce fichier contient :
- ✅ **Provider** React Context pour les traductions
- ✅ **Hook** `useTranslation()` pour accéder aux traductions
- ✅ **Base de données** des traductions en 3 langues
- ✅ **Persistance** de la langue dans localStorage

### 🔧 Comment utiliser les traductions

#### 1. Importer le hook
```javascript
import { useTranslation } from '../contexts/TranslationContext';
```

#### 2. Utiliser dans un composant
```javascript
const MonComposant = () => {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('homePageTitle')}</h1>
      <p>{t('homePageDescription')}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
};
```

## 📝 Catégories de traductions disponibles

### 🔧 Interface utilisateur
- Navigation : `home`, `ourStore`, `wishlist`, `cart`, `contact`
- Actions : `addToCart`, `addToWishlist`, `viewDetails`, `search`
- Messages : `loading`, `error`, `success`, `warning`

### 🛒 E-commerce
- Produits : `price`, `rating`, `brand`, `color`, `category`
- Panier : `cartEmpty`, `cartTotal`, `checkout`, `quantity`
- Commande : `order`, `orderStatus`, `orderHistory`

### 📱 Messages Toast
- Succès : `productAddedToCart`, `productAddedToWishlist`
- Erreurs : `pleaseLoginForCart`, `productInfoMissing`
- Informations : `linkCopied`, `wishlistUpdateSuccess`

### 🏪 Carrousel de garanties
- Services : `ourGuarantees`, `fastDeliveryCarousel`
- Descriptions : `fastDeliveryDesc`, `securePaymentDesc`

## ➕ Ajouter une nouvelle traduction

### 1. Ajouter la clé dans TranslationContext.js

```javascript
const translations = {
  fr: {
    // ... traductions existantes
    newKey: "Nouveau texte en français",
  },
  en: {
    // ... traductions existantes  
    newKey: "New text in English",
  },
  ar: {
    // ... traductions existantes
    newKey: "النص الجديد بالعربية",
  }
};
```

### 2. Utiliser dans le composant

```javascript
const { t } = useTranslation();
return <span>{t('newKey')}</span>;
```

## 🌐 Ajouter une nouvelle langue

### 1. Étendre l'objet translations
```javascript
const translations = {
  fr: { /* traductions françaises */ },
  en: { /* traductions anglaises */ },
  ar: { /* traductions arabes */ },
  es: { /* nouvelles traductions espagnoles */ },
};
```

### 2. Ajouter le sélecteur de langue
Dans `LanguageSelector.js`, ajouter l'option :
```javascript
<option value="es">🇪🇸 Español</option>
```

## 📊 Statut actuel

### ✅ Traduit complètement
- ✅ Navigation et menus
- ✅ Messages toast et erreurs
- ✅ Formulaires et placeholders
- ✅ Carrousel de services
- ✅ Badges et boutons produits
- ✅ Interface panier et wishlist

### ⚠️ Partiellement traduit
- ⚠️ Données de démonstration (AvisClients.js)
- ⚠️ Catégories temporaires (temporaryCategories.js)
- ⚠️ Fichiers Ultra et versions alternatives

### 📍 Notes importantes

1. **Langue par défaut** : Français
2. **Persistance** : La langue choisie est sauvée dans localStorage
3. **Fallback** : Si une clé n'existe pas, elle s'affiche telle quelle
4. **RTL** : Le support RTL pour l'arabe peut être ajouté avec CSS

## 🚀 Utilisation pratique

### Changer la langue programmatiquement
```javascript
const { changeLanguage } = useTranslation();
changeLanguage('en'); // Anglais
changeLanguage('ar'); // Arabe
changeLanguage('fr'); // Français
```

### Obtenir la langue actuelle
```javascript
const { currentLanguage } = useTranslation();
console.log(currentLanguage); // 'fr', 'en', ou 'ar'
```

### Lister toutes les langues disponibles
```javascript
const { availableLanguages } = useTranslation();
console.log(availableLanguages); // ['fr', 'en', 'ar']
```

## 🎯 Bonnes pratiques

1. **Noms de clés descriptifs** : Utilisez des noms clairs comme `addToCartBtn` au lieu de `btn1`
2. **Organisation logique** : Groupez les traductions par fonctionnalité
3. **Cohérence** : Utilisez la même terminologie dans toute l'app
4. **Tests** : Testez chaque langue après ajout de nouvelles traductions

---

**📧 Support** : Pour toute question sur le système de traduction, consultez ce guide ou l'équipe de développement.