# 🔍 DEBUG IMAGES CHECKOUT - VERSION 2

**Date:** 19 Octobre 2025
**Problème persistant:** Les images des produits n'apparaissent toujours pas sur `/checkout`
**Solution:** Ajout de logging détaillé + gestion de `item.product.images`

---

## 📊 STRUCTURE DES DONNÉES DU PANIER

### Backend: getUserCart (userCtrl.js lignes 525-560)

Le backend renvoie une structure spécifique:

```javascript
const result = cartEntries.map(cartItem => {
  const cartData = cartItem.toJSON();
  const product = productMap[cartItem.productId] || null;
  
  // Images normalisées ajoutées au niveau racine
  if (product && product.images) {
    cartData.images = product.images;
  }
  
  return {
    ...cartData,    // id, userId, productId, quantity, price, color
    product,        // Objet produit complet (title, description, images, etc.)
  };
});
```

### Structure attendue dans Redux (state.auth.cartProducts):

```json
[
  {
    "id": 1,
    "userId": 10,
    "productId": 42,
    "quantity": 2,
    "price": 99.99,
    "color": null,
    "images": [
      {
        "url": "http://74.235.205.26:4000/images/image-123.jpeg",
        "public_id": "image-123"
      }
    ],
    "product": {
      "id": 42,
      "title": "Produit Test",
      "description": "...",
      "price": 99.99,
      "images": [
        {
          "url": "http://74.235.205.26:4000/images/image-123.jpeg",
          "public_id": "image-123"
        }
      ]
    }
  }
]
```

---

## ✅ CORRECTIONS APPLIQUÉES

### Fichier: `/Client/src/pages/Checkout.js`

#### 1. Ajout de logging détaillé (lignes 24-31)

```javascript
// 🔍 DEBUG: Afficher la structure des données du panier
console.log("🛒 DEBUG Checkout - cartState:", cartState);
console.log("🛒 DEBUG Checkout - itemsToDisplay:", itemsToDisplay);
if (itemsToDisplay && itemsToDisplay.length > 0) {
    console.log("🛒 DEBUG Checkout - Premier item:", JSON.stringify(itemsToDisplay[0], null, 2));
}
```

#### 2. Logging par item (lignes 214-221)

```javascript
// 🔍 DEBUG: Structure des données
console.log("🖼️ DEBUG Item:", {
    id: item.id,
    title: item.title || item.product?.title,
    images: item.images,
    productImages: item.product?.images,
    image: item.image
});
```

#### 3. Gestion améliorée des images avec fallback multiple

```javascript
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
```

#### 4. Gestion dynamique title et price

```javascript
// Utiliser les données du produit si disponibles
const title = item.title || item.product?.title || 'Produit';
const price = item.price || item.product?.price || 0;
```

#### 5. Logging des erreurs d'image

```javascript
onError={(e) => {
    console.error("❌ Erreur chargement image:", imageUrl);
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/80";
}}
```

---

## 🧪 TESTS DE DIAGNOSTIC

### Étape 1: Ouvrir la console développeur
1. Appuyez sur **F12** dans votre navigateur
2. Allez sur l'onglet **Console**

### Étape 2: Naviguer vers checkout
```
http://74.235.205.26:3000/checkout
```

### Étape 3: Analyser les logs

#### ✅ Ce que vous DEVRIEZ voir:

```
🛒 DEBUG Checkout - cartState: Array(2)
🛒 DEBUG Checkout - itemsToDisplay: Array(2)
🛒 DEBUG Checkout - Premier item: {
  "id": 1,
  "userId": 10,
  "productId": 42,
  "images": [
    {
      "url": "http://74.235.205.26:4000/images/...",
      "public_id": "..."
    }
  ],
  "product": {...}
}
🖼️ DEBUG Item: {
  id: 1,
  title: "Produit Test",
  images: Array(1),
  productImages: Array(1),
  image: undefined
}
🖼️ URL finale: http://74.235.205.26:4000/images/image-123.jpeg
```

#### ❌ Si vous voyez des erreurs:

**Cas 1: images est undefined**
```
🖼️ DEBUG Item: {
  images: undefined,
  productImages: undefined
}
```
→ **Problème:** Le backend ne renvoie pas les images correctement

**Cas 2: URL invalide ou inaccessible**
```
🖼️ URL finale: http://localhost:4000/images/...
❌ Erreur chargement image: http://localhost:4000/images/...
```
→ **Problème:** BASE_URL incorrecte (localhost au lieu de 74.235.205.26)

**Cas 3: Erreur 404 sur l'image**
```
GET http://74.235.205.26:4000/images/image-123.jpeg 404 (Not Found)
```
→ **Problème:** Le fichier image n'existe pas physiquement

---

## 🛠️ SOLUTIONS PAR CAS

### Cas 1: Images undefined → Vérifier le backend

```bash
# Test direct de l'API
curl -H "Authorization: Bearer VOTRE_TOKEN" \
  http://74.235.205.26:4000/api/user/cart | jq
```

Si les images ne sont pas dans la réponse:
1. Vérifier que `normalizeProductData` est appelé dans `getUserCart`
2. Vérifier que les produits ont bien des images en base de données

### Cas 2: URL avec localhost → Vérifier BASE_URL

```bash
# Vérifier la variable d'environnement
pm2 env backend-fixed | grep BASE_URL

# Si absente, l'ajouter
pm2 restart backend-fixed --update-env
```

Fichier: `/backend/.env`
```
BASE_URL=http://74.235.205.26:4000
```

### Cas 3: Erreur 404 → Vérifier les fichiers

```bash
# Lister les images disponibles
ls -lh /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/

# Vérifier les permissions
chmod 755 /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/
```

---

## 📋 CHECKLIST DE VÉRIFICATION

- [ ] Console développeur ouverte (F12)
- [ ] Panier contient au moins 1 produit
- [ ] Navigation vers http://74.235.205.26:3000/checkout
- [ ] Logs visibles dans la console
- [ ] Structure de `cartState` visible
- [ ] Premier item affiché en détail
- [ ] URL finale calculée visible
- [ ] Vérifier si placeholder ou vraie image

---

## 🔄 SERVICES

```bash
# Statut actuel
pm2 list

# Redémarrer si nécessaire
pm2 restart sanny-client
pm2 restart backend-fixed
```

**Status actuel:**
- ✅ backend-fixed (PID 3346476) - Port 4000
- ✅ sanny-admin (PID 880141) - Port 3001
- ✅ sanny-client (PID 3348796) - Port 3000

---

## 📝 PROCHAINES ÉTAPES

1. **Ouvrir la console** et aller sur `/checkout`
2. **Copier les logs** de la console
3. **Envoyer les logs** pour analyse
4. **Vérifier l'onglet Network** pour voir les requêtes d'images
5. **Screenshot** si nécessaire

---

## 💡 HYPOTHÈSES

### Hypothèse 1: Redux ne récupère pas le panier
- Vérifier `getUserCart` dans `userSlice.js`
- Vérifier que `state.auth.cartProducts` est peuplé
- Utiliser Redux DevTools pour inspecter l'état

### Hypothèse 2: Images parsées incorrectement
- Le backend stocke peut-être les images en string JSON
- `normalizeImages` devrait parser automatiquement
- Vérifier la colonne `images` dans la table `products`

### Hypothèse 3: CORS bloque les images
- Vérifier dans Network si requête bloquée
- Ajouter headers CORS appropriés dans `/backend/index.js`

---

**Status:** ⚠️ **EN COURS DE DIAGNOSTIC**
**Attente:** Logs de la console développeur

