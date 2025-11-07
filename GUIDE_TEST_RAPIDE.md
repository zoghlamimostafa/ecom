# 🧪 Guide de Test Rapide - Modifications du 5 Novembre 2024

## ✅ Tests à Effectuer

### 1️⃣ Test : Cartes Produits Non Étirées ⏱️ 2 min

**Objectif :** Vérifier que les cartes de produits gardent leur taille normale lors des recherches.

**Étapes :**
1. Ouvrir votre navigateur et aller sur : `http://localhost:3000/store`
2. Dans la barre de recherche en haut, taper "iPhone" ou "Samsung"
3. Observer les cartes de produits qui s'affichent

**✅ Résultat Attendu :**
- Les cartes ont toutes la **même hauteur** (300px)
- Les cartes ont toutes la **même largeur** (240px)
- Les images de produits sont **centrées** et ne sont pas déformées
- La grille est **uniforme** et professionnelle

**❌ Ce qui NE doit PAS arriver :**
- ❌ Cartes avec des hauteurs différentes
- ❌ Cartes étirées verticalement
- ❌ Images de produits déformées ou compressées

**Screenshot recommandé :** Prendre une capture d'écran de la grille de recherche pour archiver le "avant/après"

---

### 2️⃣ Test : Nouveaux Articles de Blog ⏱️ 5 min

**Objectif :** Vérifier que les 6 nouveaux articles professionnels sont visibles et fonctionnels.

**Étapes :**

#### A. Page Principale Blog
1. Aller sur : `http://localhost:3000/blogs`
2. Observer la page qui s'affiche

**✅ Résultat Attendu :**
- **6 articles** sont visibles (plus l'ancien article de test)
- Chaque article a un **titre accrocheur** :
  - "Guide Complet : Comment Choisir son Smartphone en 2024"
  - "Mode Durable : Les Tendances Éthiques..."
  - "Électroménager Intelligent : Domotique..."
  - "Gaming 2024 : PC ou Console ?"
  - "Beauté Bio : La Cosmétique Naturelle..."
  - "Nutrition Sportive : Optimiser Performances..."
- Chaque article affiche une **image d'illustration**
- Les **catégories** sont affichées en badges (Technologie, Mode, Maison, Gaming, Beauté, Sport)

#### B. Filtres de Catégories
1. En haut de la page blog, localiser les **boutons de filtrage** par catégorie
2. Cliquer sur le bouton **"Technologie"** 📱

**✅ Résultat Attendu :**
- Seul l'article "Guide Complet : Comment Choisir son Smartphone en 2024" s'affiche
- Les autres articles sont masqués
- Le bouton "Technologie" est **surligné/actif**

3. Cliquer sur **"Mode"** 👗

**✅ Résultat Attendu :**
- Seul l'article "Mode Durable" s'affiche

4. Cliquer sur **"Tous"** ou désactiver le filtre

**✅ Résultat Attendu :**
- Tous les 6 articles réapparaissent

#### C. Lecture d'un Article
1. Cliquer sur l'article **"Gaming 2024 : PC ou Console ?"**
2. Observer la page de l'article complet

**✅ Résultat Attendu :**
- Titre principal visible : "Gaming 2024 : PC ou Console ? Le Grand Comparatif"
- Contenu **long et structuré** avec :
  - Sections H2 et H3 (Performance Brute, Catalogue de Jeux, etc.)
  - Listes à puces
  - Tableau comparatif (coût PC vs Console)
  - Paragraphes de contenu riche
- Auteur affiché : **Maxime Rousseau**
- Nombre de vues : **2,134**
- **Images d'illustration** visibles

**❌ Ce qui NE doit PAS arriver :**
- ❌ Contenu vide ou Lorem Ipsum
- ❌ Message "Aucun article trouvé"
- ❌ Images cassées (icône ❌)
- ❌ Contenu court et non professionnel

---

### 3️⃣ Test : Responsive Mobile ⏱️ 2 min

**Objectif :** Vérifier que les modifications fonctionnent aussi sur mobile.

**Étapes :**
1. Ouvrir les **DevTools** (F12)
2. Activer le **mode responsive** (Ctrl+Shift+M ou icône mobile)
3. Sélectionner **iPhone 12 Pro** ou définir la largeur à **375px**

#### A. Page Boutique Mobile
1. Aller sur `/store`
2. Rechercher "iPhone"

**✅ Résultat Attendu :**
- Cartes produits adaptées à **180×250px** (mobile)
- 2 colonnes de produits sur mobile
- Grille responsive et uniforme

#### B. Page Blog Mobile
1. Aller sur `/blogs`

**✅ Résultat Attendu :**
- Articles empilés en **1 colonne**
- Filtres de catégories utilisables (scroll horizontal si nécessaire)
- Texte lisible sans zoom
- Images responsive (largeur 100%)

---

## 🔍 Vérifications API (Optionnel - Technique)

### Test API Blog
Ouvrir un terminal et exécuter :

```bash
curl http://localhost:4000/api/blog/ | jq -r '.[] | .title'
```

**✅ Résultat Attendu :**
```
Guide Complet : Comment Choisir son Smartphone en 2024
Mode Durable : Les Tendances Éthiques qui Transforment l'Industrie
Électroménager Intelligent : Domotique et Économies d'Énergie
Gaming 2024 : PC ou Console ? Le Grand Comparatif
Beauté Bio : La Cosmétique Naturelle Efficace et Certifiée
Nutrition Sportive : Optimiser Performances et Récupération
```

### Test Images Blog
```bash
curl http://localhost:4000/api/blog/21 | jq '.images'
```

**✅ Résultat Attendu :**
```json
[
  {
    "url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    "public_id": "smartphone-guide-1"
  },
  {
    "url": "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
    "public_id": "smartphone-guide-2"
  }
]
```

---

## 📊 Checklist de Validation Complète

Cocher au fur et à mesure :

### Boutique (OurStore)
- [ ] Page `/store` charge correctement
- [ ] Barre de recherche fonctionne
- [ ] Recherche "iPhone" retourne des résultats
- [ ] Cartes produits ont toutes la même hauteur (300px)
- [ ] Cartes produits ont toutes la même largeur (240px)
- [ ] Images produits centrées et non déformées
- [ ] Grille responsive en mobile (180×250px)

### Blog
- [ ] Page `/blogs` charge correctement
- [ ] 6 articles professionnels s'affichent
- [ ] Article 1 : "Guide Smartphone" visible
- [ ] Article 2 : "Mode Durable" visible
- [ ] Article 3 : "Électroménager" visible
- [ ] Article 4 : "Gaming 2024" visible
- [ ] Article 5 : "Beauté Bio" visible
- [ ] Article 6 : "Nutrition Sportive" visible
- [ ] Chaque article a une image d'illustration
- [ ] Filtres de catégories fonctionnent
- [ ] Filtre "Technologie" affiche uniquement l'article smartphone
- [ ] Filtre "Gaming" affiche uniquement l'article gaming
- [ ] Bouton "Tous" réaffiche tous les articles
- [ ] Clic sur article ouvre la page de lecture complète
- [ ] Page article affiche contenu long et structuré (H2, H3, listes)
- [ ] Auteur et nombre de vues affichés
- [ ] Blog responsive en mobile (1 colonne)

### Performance
- [ ] Pas d'erreurs dans la console navigateur (F12)
- [ ] Temps de chargement < 3 secondes
- [ ] Images chargent sans erreur 404
- [ ] Pas de layout shift (contenu qui bouge après chargement)

---

## 🐛 Résolution de Problèmes

### Si les cartes sont toujours étirées :
1. Vider le cache du navigateur (Ctrl+Shift+Del)
2. Faire un hard refresh (Ctrl+F5)
3. Vérifier dans DevTools (F12 → Elements) que les styles CSS sont bien appliqués :
   ```css
   .product-card-container {
       height: 300px !important;
       width: 240px !important;
   }
   ```

### Si les articles de blog ne s'affichent pas :
1. Vérifier que le backend est en ligne :
   ```bash
   pm2 list
   # backend-fixed doit être "online"
   ```
2. Tester l'API directement :
   ```bash
   curl http://localhost:4000/api/blog/
   # Doit retourner un tableau JSON avec 6 articles
   ```
3. Vérifier les logs backend :
   ```bash
   pm2 logs backend-fixed --lines 20
   ```

### Si les images de blog ne s'affichent pas :
- Les images Unsplash peuvent nécessiter une connexion Internet
- Vérifier dans la console navigateur (F12) si des URLs sont bloquées
- URLs commençant par `https://images.unsplash.com/` doivent être accessibles

---

## ✅ Validation Finale

Une fois tous les tests effectués avec succès, votre application e-commerce présente maintenant :

1. **Une interface boutique professionnelle** avec cartes produits uniformes
2. **Un blog de qualité** avec 6 articles de fond optimisés SEO
3. **Une expérience utilisateur améliorée** sur desktop et mobile

**Statut :** ✅ Production Ready pour ces fonctionnalités

---

## 📞 Support

En cas de problème persistant :

1. Consulter le fichier `AMELIORATIONS_CARTES_BLOG_05NOV2024.md` pour les détails techniques
2. Vérifier les logs PM2 : `pm2 logs --lines 50`
3. Vérifier la base de données :
   ```bash
   cd /home/blackrdp/sanny/san/ecomerce_sanny/backend
   sqlite3 database.sqlite "SELECT COUNT(*) FROM Blogs;"
   # Doit retourner : 6
   ```

**Date du guide :** 5 Novembre 2024  
**Version testée :** Client (restart #37), Backend (restart #17)
