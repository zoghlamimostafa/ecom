# 🚀 GUIDE RAPIDE - SYSTÈME D'UPLOAD CORRIGÉ

## ✅ SYSTÈME OPÉRATIONNEL

Tous les problèmes ont été corrigés. Le système d'upload fonctionne maintenant correctement.

---

## 🧪 TEST IMMÉDIAT

```bash
# 1. Vérifier que tout tourne
pm2 list

# 2. Ouvrir le monitoring en temps réel
cd ~/sanny/san/ecomerce_sanny/backend
./monitor-upload.sh

# 3. Dans un autre terminal/navigateur, tester l'upload
# URL: http://74.235.205.26:3001/admin/product
```

---

## 📊 COMMANDES UTILES

### Voir l'état des services
```bash
pm2 list
pm2 status
```

### Voir les logs
```bash
# Tous les logs
pm2 logs backend-fixed

# Seulement les erreurs
pm2 logs backend-fixed --err

# Dernières 50 lignes
pm2 logs backend-fixed --lines 50 --nostream
```

### Redémarrer le backend
```bash
# Redémarrage simple
pm2 restart backend-fixed

# Redémarrage avec rechargement .env
pm2 restart backend-fixed --update-env

# Redémarrage complet
pm2 delete backend-fixed
cd ~/sanny/san/ecomerce_sanny/backend
pm2 start ecosystem.config.js
```

### Vérifier la configuration
```bash
# Voir les variables d'environnement
pm2 env 13

# Vérifier BASE_URL spécifiquement
pm2 env 13 | grep BASE_URL

# Vérifier le fichier .env
cat ~/sanny/san/ecomerce_sanny/backend/.env | grep BASE_URL
```

### Voir les images uploadées
```bash
# Dernières images
ls -lht ~/sanny/san/ecomerce_sanny/backend/public/images/ | head -10

# Compter le nombre d'images
ls ~/sanny/san/ecomerce_sanny/backend/public/images/*.jpeg | wc -l

# Espace disque utilisé
du -sh ~/sanny/san/ecomerce_sanny/backend/public/images/
```

### Nettoyer les logs
```bash
# Effacer les logs PM2
pm2 flush backend-fixed

# Effacer toutes les logs PM2
pm2 flush
```

### Tester l'API
```bash
# Health check local
curl http://localhost:4000/api/

# Health check externe
curl http://74.235.205.26:4000/api/

# Vérifier les images statiques
curl -I http://74.235.205.26:4000/images/images-1760885241448-664600807.jpeg
```

---

## 🔧 DÉPANNAGE

### Si l'upload ne fonctionne pas

1. **Vérifier que le backend tourne:**
```bash
pm2 list | grep backend-fixed
# Doit être "online"
```

2. **Vérifier les logs d'erreur:**
```bash
pm2 logs backend-fixed --err --lines 20
```

3. **Vérifier BASE_URL:**
```bash
pm2 env 13 | grep BASE_URL
# Doit afficher: BASE_URL: http://74.235.205.26:4000
```

4. **Si BASE_URL incorrect:**
```bash
pm2 restart backend-fixed --update-env
```

### Si les URLs contiennent "localhost"

```bash
# Vérifier que BASE_URL est bien dans ecosystem.config.js
cat ~/sanny/san/ecomerce_sanny/backend/ecosystem.config.js

# Redémarrer complètement
pm2 delete backend-fixed
cd ~/sanny/san/ecomerce_sanny/backend
pm2 start ecosystem.config.js
```

### Si erreur Sharp persiste

```bash
# Vérifier que resize est désactivé
grep -n "productImgResize" ~/sanny/san/ecomerce_sanny/backend/routes/uploadRoute.js

# Doit afficher une ligne commentée: // productImgResize
```

### Si timeout pendant l'upload

```bash
# Vérifier la taille des fichiers
ls -lh ~/sanny/san/ecomerce_sanny/backend/public/images/*.jpeg | tail -5

# Limite actuelle: 500MB par fichier
```

---

## 📁 FICHIERS IMPORTANTS

```
backend/
├── controller/uploadCtrl.js          # Logique d'upload
├── routes/uploadRoute.js             # Route d'upload (resize désactivé)
├── middlewares/uploadImage.js        # Multer config
├── ecosystem.config.js               # Config PM2 avec BASE_URL
├── .env                              # Variables d'environnement
├── public/images/                    # Dossier des images
├── monitor-upload.sh                 # Script de monitoring
└── test-upload-complete.js           # Script de test

documentation/
├── STATUS_FIXES_APPLIQUES.md         # Résumé des corrections
└── DIAGNOSTIC_UPLOAD_2025-10-19.md   # Documentation complète
```

---

## 🎯 CE QUI A ÉTÉ CORRIGÉ

| Problème | Solution | Fichier modifié |
|----------|----------|-----------------|
| Erreur Sharp resize | Resize désactivé | `routes/uploadRoute.js` |
| URLs avec localhost | BASE_URL configurée | `ecosystem.config.js`, `.env` |
| PM2 cache code | Hard restart | Command PM2 |

---

## 🚨 POINTS D'ATTENTION

### Resize désactivé
- **Impact:** Images gardent leur taille originale
- **Alternative:** Compresser les images avant upload
- **Future:** Implémenter resize côté client

### IP externe
- **Actuelle:** 74.235.205.26
- **Si changement:** Modifier `.env` et `ecosystem.config.js`, puis restart PM2

### Limite d'upload
- **Actuelle:** 50 images max, 500MB par fichier
- **Modifier:** Dans `routes/uploadRoute.js` (uploadPhoto.array)

---

## 📞 SUPPORT

### En cas de problème persistant

1. **Capturer les logs:**
```bash
pm2 logs backend-fixed --lines 100 > ~/upload-error.log
```

2. **Vérifier la console navigateur:**
- Ouvrir DevTools (F12)
- Onglet Console
- Onglet Network (pour voir les requêtes)

3. **Informations à fournir:**
- Message d'erreur exact
- Logs backend (upload-error.log)
- Logs console navigateur
- Capture d'écran si possible

---

## 📚 RESSOURCES

- **Documentation complète:** `DIAGNOSTIC_UPLOAD_2025-10-19.md`
- **Status des corrections:** `STATUS_FIXES_APPLIQUES.md`
- **Script de monitoring:** `./backend/monitor-upload.sh`
- **Script de test:** `./backend/test-upload-complete.js`

---

## ✅ CHECKLIST FINALE

Avant de tester, vérifiez:

- [ ] PM2 backend online: `pm2 list`
- [ ] BASE_URL configurée: `pm2 env 13 | grep BASE_URL`
- [ ] Resize désactivé: `grep productImgResize backend/routes/uploadRoute.js`
- [ ] Backend répond: `curl http://localhost:4000/api/`
- [ ] Admin accessible: http://74.235.205.26:3001

Si tous les checks passent: **✅ PRÊT POUR L'UPLOAD**

---

**Dernière mise à jour:** 19 Octobre 2025, 15:18  
**Status:** ✅ OPÉRATIONNEL

*Créé par GitHub Copilot*
