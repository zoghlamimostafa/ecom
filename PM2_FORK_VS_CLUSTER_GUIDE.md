# 🚀 PM2 Fork vs Cluster - Guide Complet

## 📖 Définitions

### Mode FORK
**1 seule instance** de l'application qui tourne.

```
Requêtes → [Instance Unique] → Réponses
```

**Analogie :** Un seul caissier dans un magasin.

---

### Mode CLUSTER
**Plusieurs instances** qui se répartissent le travail.

```
          ┌→ [Instance 1] →┐
Requêtes →├→ [Instance 2] →├→ Réponses
          └→ [Instance 3] →┘
```

**Analogie :** Plusieurs caissiers qui se répartissent les clients.

---

## 🎯 Votre Configuration Actuelle

```bash
┌────┬────────────────────┬──────────┬──────┬───────────┐
│ id │ name               │ mode     │ ↺    │ memory    │
├────┼────────────────────┼──────────┼──────┼───────────┤
│ 6  │ backend-fixed      │ fork     │ 6    │ 91.8mb    │ ✅ OK
│ 8  │ sanny-admin        │ fork     │ 8    │ 59.0mb    │ ✅ OK
│ 9  │ sanny-client       │ cluster  │ 65   │ 40.4mb    │ ⚠️ TROP
└────┴────────────────────┴──────────┴──────┴───────────┘
```

### Analyse :

#### ✅ backend-fixed (FORK - OK)
- **6 restarts** = Normal
- **91.8 MB** = Raisonnable pour Express
- **Fork** = Parfait pour un backend API

#### ✅ sanny-admin (FORK - OK)
- **8 restarts** = Normal en développement
- **59.0 MB** = Léger
- **Fork** = Parfait pour interface admin

#### ⚠️ sanny-client (CLUSTER - PROBLÈME)
- **65 restarts** = BEAUCOUP TROP !
- **Cluster** = Inutile en développement
- **Cause** : Trop d'instances qui crashent

---

## 🔧 Solution Recommandée

### Pour Environnement de DÉVELOPPEMENT :

**Passer sanny-client en mode FORK**

```bash
# Arrêter le client actuel
pm2 delete sanny-client

# Redémarrer en mode fork (1 instance)
pm2 start npm --name "sanny-client" -- start

# Sauvegarder la configuration
pm2 save

# Vérifier
pm2 status
```

**Résultat attendu :**
```
│ 9  │ sanny-client       │ fork     │ 0    │ 40.4mb    │
```

---

### Pour Environnement de PRODUCTION :

**Utiliser CLUSTER avec limite d'instances**

```bash
# Avec 2 instances seulement (pas max)
pm2 start npm --name "sanny-client" -i 2 -- start

# OU utiliser fichier ecosystem.config.js
pm2 start ecosystem.config.js --only sanny-client
```

---

## 📊 Tableau Comparatif

| Critère | FORK | CLUSTER |
|---------|------|---------|
| **Instances** | 1 | 2-8 (selon CPU) |
| **RAM totale** | 40 MB | 40 MB × instances |
| **CPU usage** | 1 cœur | Tous les cœurs |
| **Stabilité dev** | ✅ Excellente | ⚠️ Moyenne |
| **Performance** | ✅ Suffisante | 🚀 Maximum |
| **Restarts** | Peu | Beaucoup |
| **Complexité** | 🟢 Simple | 🔴 Complexe |
| **Débogage** | 🟢 Facile | 🔴 Difficile |

---

## 🎓 Quand Utiliser Chaque Mode ?

### Utilisez FORK si :
- ✅ Environnement de développement
- ✅ Application légère (< 100 req/s)
- ✅ Peu d'utilisateurs simultanés
- ✅ Besoin de déboguer facilement
- ✅ Serveur avec peu de RAM
- ✅ Backend API simple
- ✅ Interface admin

**Exemples :**
- Backend Express
- Admin React
- Bot Discord
- Script de traitement

---

### Utilisez CLUSTER si :
- ✅ Environnement de production
- ✅ Application critique
- ✅ Beaucoup d'utilisateurs (> 1000/jour)
- ✅ Haute disponibilité nécessaire
- ✅ Serveur multi-cœurs (4+ CPUs)
- ✅ Load balancing requis

**Exemples :**
- Site e-commerce en production
- API publique
- Application SaaS
- Plateforme de streaming

---

## 🔍 Comprendre les 65 Redémarrages

### Pourquoi autant ?

1. **Mode cluster crée plusieurs instances**
   ```
   Si 4 cœurs CPU → 4 instances
   Si 1 instance crash 15× → 4 × 15 = 60 restarts !
   ```

2. **Webpack recompile souvent**
   ```
   Changement de code → Recompilation → Restart
   En cluster → Chaque instance restart
   ```

3. **Ressources insuffisantes**
   ```
   4 instances × 40 MB = 160 MB RAM
   Si pas assez → Crash → Restart en boucle
   ```

---

## 💡 Commandes Utiles

### Voir les détails d'un processus :
```bash
pm2 show sanny-client
```

### Voir les logs en temps réel :
```bash
pm2 logs sanny-client
```

### Voir les métriques :
```bash
pm2 monit
```

### Redémarrer sans downtime (cluster seulement) :
```bash
pm2 reload sanny-client
```

### Redémarrer avec downtime :
```bash
pm2 restart sanny-client
```

### Changer le mode :
```bash
# Passer de cluster à fork
pm2 delete sanny-client
pm2 start npm --name "sanny-client" -- start

# Passer de fork à cluster (2 instances)
pm2 delete sanny-client
pm2 start npm --name "sanny-client" -i 2 -- start
```

---

## 🎯 Configuration Recommandée pour Vous

### Développement (ACTUEL) :
```bash
backend-fixed : FORK ✅
sanny-admin   : FORK ✅
sanny-client  : FORK ← À CHANGER
```

### Production (FUTUR) :
```bash
backend-fixed : FORK ou CLUSTER (2 instances)
sanny-admin   : FORK
sanny-client  : CLUSTER (2-4 instances)
```

---

## 🔧 Script de Migration vers FORK

```bash
#!/bin/bash

echo "🔄 Migration sanny-client vers mode FORK..."

# Arrêter le client actuel
pm2 delete sanny-client

# Redémarrer en mode fork
cd /home/blackrdp/sanny/san/ecomerce_sanny/Client
pm2 start npm --name "sanny-client" -- start

# Attendre 10 secondes
sleep 10

# Vérifier le statut
pm2 status

# Sauvegarder
pm2 save

echo "✅ Migration terminée !"
echo "📊 Vérifiez que le nombre de restarts diminue"
```

**Pour exécuter :**
```bash
bash migrate-to-fork.sh
```

---

## 📈 Surveillance Post-Migration

### Vérifier les restarts :
```bash
# Avant migration : 65+ restarts
# Après migration : 0-5 restarts

pm2 status
```

### Vérifier la stabilité :
```bash
# Attendre 5 minutes puis :
pm2 status

# Le nombre de restarts devrait être stable
```

### Vérifier les performances :
```bash
# Ouvrir le navigateur
# http://localhost:3000
# La recherche devrait fonctionner
```

---

## 🎉 Résumé Simple

**FORK** = 1 instance = Simple = Développement
**CLUSTER** = Plusieurs instances = Complexe = Production

**Votre problème :** Client en CLUSTER en développement = 65 restarts

**Solution :** Passer en FORK = Stabilité + Moins de RAM

**Commande :**
```bash
pm2 delete sanny-client
pm2 start npm --name "sanny-client" -- start
pm2 save
```

---

**Date :** 2025-10-12  
**Niveau :** 🟢 Débutant à Intermédiaire  
**Temps de lecture :** 10 minutes
