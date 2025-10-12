# 📸 Configuration des Tailles d'Images

## 🎯 Tailles Actuelles
- **Backend (Multer)** : 1MB (1,000,000 bytes)
- **Frontend (Dropzone)** : 5MB (5,242,880 bytes)
- **Problème** : Incohérence entre les deux limites !

## ⚙️ Recommandations par Usage

### 🛍️ **E-commerce Standard (Recommandé)**
```javascript
// Backend
limits: { fileSize: 5 * 1024 * 1024 }, // 5MB

// Frontend  
maxSize={5 * 1024 * 1024} // 5MB
```

### 🏪 **Boutique Haut de Gamme**
```javascript
// Backend
limits: { fileSize: 10 * 1024 * 1024 }, // 10MB

// Frontend
maxSize={10 * 1024 * 1024} // 10MB
```

### 📱 **Mobile/Performance Optimisée**
```javascript
// Backend
limits: { fileSize: 2 * 1024 * 1024 }, // 2MB

// Frontend
maxSize={2 * 1024 * 1024} // 2MB
```

### 🎨 **Portfolio/Images Artistiques**
```javascript
// Backend
limits: { fileSize: 20 * 1024 * 1024 }, // 20MB

// Frontend
maxSize={20 * 1024 * 1024} // 20MB
```

## 🔧 Fichiers à Modifier

### 1. Backend : `backend/middlewares/uploadImage.js`
```javascript
limits: { fileSize: NOUVELLE_TAILLE },
```

### 2. Frontend : `admin-app/src/pages/Addproduct.js`
```javascript
maxSize={NOUVELLE_TAILLE} // Même valeur que backend
```

### 3. Messages d'erreur à synchroniser
- Textes d'aide dans l'interface
- Messages toast d'erreur

## 🚨 Points d'Attention

1. **Synchronisation** : Backend et Frontend doivent avoir la MÊME limite
2. **Cloudinary** : Vérifier les limites de votre plan
3. **Serveur** : Plus de RAM nécessaire pour gros fichiers
4. **UX** : Avertir l'utilisateur des temps d'upload plus longs

## 🎯 Modification Recommandée Immédiate

**Problème actuel** : Backend limite à 1MB mais Frontend accepte 5MB
**Solution** : Augmenter le backend à 5MB pour synchroniser
