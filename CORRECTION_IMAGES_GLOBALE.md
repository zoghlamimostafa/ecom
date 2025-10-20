# 🔧 CORRECTION GLOBALE DES IMAGES - CART, WISHLIST & CHECKOUT

**Date:** 19 Octobre 2025  
**Problème:** Les images ne s'affichent pas dans **Cart**, **Wishlist** et **Checkout**  
**Cause probable:** Images stockées en string JSON dans la base de données mais pas parsées correctement  

---

## 📊 ARCHITECTURE DU SYSTÈME

### Backend - Endpoints concernés:

1. **GET /api/user/cart** → `getUserCart()` (userCtrl.js ligne 525)
2. **GET /api/user/wishlist** → `getUserProductWishlist()` (userCtrl.js ligne 501)

### Frontend - Composants affectés:

1. **Cart.js** → `/Client/src/pages/Cart.js`
2. **Wishlist.js** → `/Client/src/pages/Wishlist.js`
3. **Checkout.js** → `/Client/src/pages/Checkout.js`

---

## ✅ CORRECTIONS APPLIQUÉES

### 1. Backend - Ajout de logging détaillé

#### Fichier: `/backend/controller/userCtrl.js`

**A. getUserProductWishlist (lignes 501-545)**

```javascript
const getUserProductWishlist = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 getUserProductWishlist - userId:", userId);
    
    const wishlistEntries = await require('../models/Wishlist').findAll({
      where: { userId },
    });
    console.log("🔍 Wishlist entries count:", wishlistEntries.length);
    
    const productIds = wishlistEntries.map(w => w.productId);
    const products = await Product.findAll({
      where: { id: productIds },
    });
    console.log("🔍 Products found:", products.length);
    
    // Normaliser tous les produits
    const result = products.map(product => {
      const productJson = product.toJSON();
      
      // LOG: État AVANT normalisation
      console.log("🔍 Product AVANT normalisation:", {
        id: productJson.id,
        title: productJson.title,
        images: productJson.images,
        imagesType: typeof productJson.images
      });
      
      const normalized = normalizeProductData(productJson);
      
      // LOG: État APRES normalisation
      console.log("🔍 Product APRES normalisation:", {
        id: normalized.id,
        title: normalized.title,
        images: normalized.images
      });
      
      return normalized;
    });
    
    console.log("✅ getUserProductWishlist - Returning", result.length, "products");
    res.json(result);
  } catch (error) {
    console.error("❌ getUserProductWishlist error:", error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la wishlist', 
      error: error.message 
    });
  }
});
```

**B. getUserCart (lignes 548-610)**

```javascript
const getUserCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 getUserCart - userId:", userId);
    
    const cartEntries = await require('../models/Cart').findAll({
      where: { userId },
    });
    console.log("🔍 Cart entries count:", cartEntries.length);
    
    const productIds = cartEntries.map(c => c.productId);
    const products = await Product.findAll({
      where: { id: productIds },
    });
    console.log("🔍 Products found:", products.length);
    
    // Map productId to product object normalisé
    const productMap = {};
    products.forEach(product => {
      const productJson = product.toJSON();
      
      // LOG: État AVANT normalisation
      console.log("🔍 Cart Product AVANT normalisation:", {
        id: productJson.id,
        title: productJson.title,
        images: productJson.images,
        imagesType: typeof productJson.images
      });
      
      const normalizedProduct = normalizeProductData(productJson);
      
      // LOG: État APRES normalisation
      console.log("🔍 Cart Product APRES normalisation:", {
        id: normalizedProduct.id,
        title: normalizedProduct.title,
        images: normalizedProduct.images
      });
      
      productMap[product.id] = normalizedProduct;
    });
    
    // Build cart response with product details
    const result = cartEntries.map(cartItem => {
      const cartData = cartItem.toJSON();
      const product = productMap[cartItem.productId] || null;
      
      // Ajouter les images normalisées au niveau du cart item
      if (product && product.images) {
        cartData.images = product.images;
        console.log("✅ Images copiées au niveau racine pour productId:", cartItem.productId);
      }
      
      return {
        ...cartData,
        product,
      };
    });
    
    console.log("✅ getUserCart - Returning", result.length, "cart items");
    res.json(result);
  } catch (error) {
    console.error("❌ getUserCart error:", error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du panier', 
      error: error.message 
    });
  }
});
```

### 2. Frontend - Checkout.js amélioré

**Fichier: `/Client/src/pages/Checkout.js`**

```javascript
// Ajout de logging au chargement (lignes 24-31)
const cartState = useSelector(state => state.auth.cartProducts);
const { user } = useSelector(state => state.auth);
const itemsToDisplay = buyNowItem ? [buyNowItem] : cartState;

// 🔍 DEBUG: Afficher la structure des données du panier
console.log("🛒 DEBUG Checkout - cartState:", cartState);
console.log("🛒 DEBUG Checkout - itemsToDisplay:", itemsToDisplay);
if (itemsToDisplay && itemsToDisplay.length > 0) {
    console.log("🛒 DEBUG Checkout - Premier item:", JSON.stringify(itemsToDisplay[0], null, 2));
}

// Gestion améliorée des images (lignes 214-270)
{itemsToDisplay.map((item) => {
    // 🔍 DEBUG: Structure des données
    console.log("🖼️ DEBUG Item:", {
        id: item.id,
        title: item.title || item.product?.title,
        images: item.images,
        productImages: item.product?.images,
        image: item.image
    });
    
    // Gestion intelligente des images avec 3 niveaux de fallback
    let imageUrl = "https://via.placeholder.com/80";
    
    // 1. Priorité: images au niveau racine (depuis getUserCart)
    if (item.images && item.images.length > 0) {
        const firstImage = item.images[0];
        if (firstImage && typeof firstImage === 'object' && firstImage.url) {
            imageUrl = firstImage.url;
        } else if (typeof firstImage === 'string') {
            imageUrl = firstImage;
        }
    }
    // 2. Fallback: images dans product.images
    else if (item.product?.images && item.product.images.length > 0) {
        const firstImage = item.product.images[0];
        if (firstImage && typeof firstImage === 'object' && firstImage.url) {
            imageUrl = firstImage.url;
        } else if (typeof firstImage === 'string') {
            imageUrl = firstImage;
        }
    }
    // 3. Fallback: item.image (singular)
    else if (item.image) {
        imageUrl = typeof item.image === 'string' ? item.image : item.image.url;
    }
    
    console.log("🖼️ URL finale:", imageUrl);
    
    // Utiliser les données du produit si disponibles
    const title = item.title || item.product?.title || 'Produit';
    const price = item.price || item.product?.price || 0;
    
    return (
        <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
            <img 
                src={imageUrl} 
                alt={title}
                style={{width: '60px', height: '60px', objectFit: 'cover'}}
                className="rounded me-3"
                onError={(e) => {
                    console.error("❌ Erreur chargement image:", imageUrl);
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/80";
                }}
            />
            <div className="flex-grow-1">
                <h6 className="mb-1">{title}</h6>
                <small className="text-muted">Qté: {item.quantity}</small>
            </div>
            <span className="fw-bold">{(price * item.quantity).toFixed(2)} TND</span>
        </div>
    );
})}
```

---

## 🔬 DIAGNOSTIC

### Utilisation du normalizeProductData

Le backend utilise `/backend/utils/imageNormalizer.js` qui:

1. **Parse les strings JSON** en objets
2. **Convertit les strings simples** en objets `{url: "..."}`
3. **Uniformise le format** en array d'objets

**Fonction clé:**

```javascript
const normalizeImages = (images) => {
  // Si null ou undefined, retourner tableau vide
  if (!images) return [];
  
  // Si c'est une string JSON, parser
  if (typeof images === 'string') {
    try {
      images = JSON.parse(images);
    } catch (e) {
      // Si le parsing échoue, c'est peut-être une URL simple
      if (images.trim() !== '' && images !== 'null' && images !== 'undefined') {
        return [{ url: images }];
      }
      return [];
    }
  }
  
  // Si c'est un tableau...
  if (Array.isArray(images)) {
    return images.map(img => {
      if (typeof img === 'string') {
        return { url: img };
      }
      if (img && typeof img === 'object') {
        return {
          url: img.url || img.path || img.public_id || '',
          public_id: img.public_id || undefined
        };
      }
      return null;
    }).filter(img => img && img.url);
  }
  
  return [];
};
```

---

## 🧪 TESTS À EFFECTUER

### 1. Test du backend avec script automatisé

```bash
cd /home/blackrdp/sanny/san/ecomerce_sanny
./test-images-cart-wishlist.sh
```

Ce script va:
- Demander votre token d'authentification
- Tester l'API cart
- Tester l'API wishlist
- Vérifier l'accessibilité des images

### 2. Test manuel depuis la console navigateur

**A. Récupérer votre token:**

```javascript
// Dans la console (F12)
localStorage.getItem('token')
```

**B. Tester l'API Cart:**

```javascript
fetch('http://74.235.205.26:4000/api/user/cart', {
  headers: {
    'Authorization': 'Bearer VOTRE_TOKEN_ICI'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Cart data:', data);
  if (data[0]) {
    console.log('First item images:', data[0].images);
    console.log('First item product.images:', data[0].product?.images);
  }
});
```

**C. Tester l'API Wishlist:**

```javascript
fetch('http://74.235.205.26:4000/api/user/wishlist', {
  headers: {
    'Authorization': 'Bearer VOTRE_TOKEN_ICI'
  }
})
.then(r => r.json())
.then(data => {
  console.log('Wishlist data:', data);
  if (data[0]) {
    console.log('First product images:', data[0].images);
  }
});
```

### 3. Vérifier les logs backend

```bash
pm2 logs backend-fixed --lines 100
```

**Recherchez ces patterns:**

```
🔍 getUserCart - userId: X
🔍 Cart entries count: X
🔍 Products found: X
🔍 Cart Product AVANT normalisation: {...}
🔍 Cart Product APRES normalisation: {...}
✅ Images copiées au niveau racine pour productId: X
✅ getUserCart - Returning X cart items
```

---

## 🎯 SCÉNARIOS POSSIBLES

### Scénario 1: Images stockées en string JSON

**Symptôme:** 
```
imagesType: string
images: "[{\"url\":\"http://...\"}]"
```

**Solution:** `normalizeImages` va parser automatiquement

### Scénario 2: Images déjà en array

**Symptôme:**
```
imagesType: object
images: [{url: "http://..."}]
```

**Solution:** `normalizeImages` retourne tel quel (déjà bon format)

### Scénario 3: Images null ou undefined

**Symptôme:**
```
images: null
```

**Solution:** `normalizeImages` retourne `[]` (array vide)

### Scénario 4: URL d'image cassée

**Symptôme:**
```
images: [{url: "http://localhost:4000/images/..."}]
```

**Solution:** Vérifier BASE_URL dans `.env` et `ecosystem.config.js`

---

## 🔄 SERVICES REDÉMARRÉS

```bash
pm2 restart backend-fixed  # ✅ Logging activé
pm2 restart sanny-client   # ✅ Checkout mis à jour
```

**Status:**
- ✅ backend-fixed (Port 4000) - Online avec logging
- ✅ sanny-admin (Port 3001) - Online
- ✅ sanny-client (Port 3000) - Online avec debug Checkout

---

## 📝 PROCHAINES ÉTAPES

1. **Exécuter le script de test:**
   ```bash
   ./test-images-cart-wishlist.sh
   ```

2. **Consulter les logs backend:**
   ```bash
   pm2 logs backend-fixed
   ```

3. **Tester les pages frontend:**
   - http://74.235.205.26:3000/cart (avec console F12)
   - http://74.235.205.26:3000/wishlist (avec console F12)
   - http://74.235.205.26:3000/checkout (avec console F12)

4. **Envoyer les résultats:**
   - Logs de la console navigateur (🛒 et 🖼️ messages)
   - Logs du backend (🔍 messages)
   - Screenshots si images toujours absentes

---

## 🐛 SI LE PROBLÈME PERSISTE

### Vérification 1: Structure de la base de données

```bash
cd /home/blackrdp/sanny/san/ecomerce_sanny/backend
sqlite3 database.sqlite "SELECT id, title, images FROM products LIMIT 3;"
```

Cela montrera comment les images sont stockées en BDD.

### Vérification 2: Fichiers images physiques

```bash
ls -lh /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ | head -10
```

### Vérification 3: CORS et BASE_URL

```bash
grep BASE_URL /home/blackrdp/sanny/san/ecomerce_sanny/backend/.env
pm2 env backend-fixed | grep BASE_URL
```

---

**Status:** ⚙️ **LOGGING ACTIVÉ - EN ATTENTE DE TESTS**  
**Fichiers modifiés:**
- ✅ `/backend/controller/userCtrl.js` (getUserCart + getUserProductWishlist)
- ✅ `/Client/src/pages/Checkout.js` (logging + gestion images améliorée)
- ✅ `/test-images-cart-wishlist.sh` (script de test créé)

