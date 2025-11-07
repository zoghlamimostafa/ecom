# 🎫 Guide d'Utilisation de l'API Coupons

## 📋 Endpoints Disponibles

### 1. 🌐 Récupérer les Coupons Actifs (Public)

**Endpoint:** `GET /api/coupon/active`

**Authentification:** Non requise

**Description:** Retourne tous les coupons actifs et non expirés

**Exemple:**
```javascript
// Récupérer les coupons actifs
fetch('http://localhost:4000/api/coupon/active')
  .then(res => res.json())
  .then(data => {
    console.log('Coupons disponibles:', data.coupons);
  });
```

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "coupons": [
    {
      "id": 2,
      "name": "LLL",
      "expiry": "2222-02-22T00:00:00.000Z",
      "discount": 10,
      "isActive": true,
      "usageLimit": null,
      "usageCount": 0
    }
  ]
}
```

---

### 2. 🔐 Appliquer un Coupon (Utilisateur Connecté)

**Endpoint:** `POST /api/coupon/apply`

**Authentification:** Token JWT requis

**Description:** Applique un coupon au panier et calcule la réduction

**Headers:**
```
Authorization: Bearer <votre_token_jwt>
Content-Type: application/json
```

**Body:**
```json
{
  "couponName": "LLL",
  "cartTotal": 100
}
```

**Exemple React:**
```javascript
const applyCoupon = async (couponName, cartTotal) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch('http://localhost:4000/api/coupon/apply', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        couponName: couponName,
        cartTotal: cartTotal
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Réduction appliquée:', data.coupon.discountAmount);
      console.log('Nouveau total:', data.coupon.totalAfterDiscount);
      return data.coupon;
    } else {
      console.error('Erreur:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    return null;
  }
};

// Utilisation
applyCoupon('LLL', 100);
```

**Réponse Succès:**
```json
{
  "success": true,
  "message": "Code promo appliqué ! -10%",
  "coupon": {
    "id": 2,
    "name": "LLL",
    "discount": 10,
    "discountAmount": 10,
    "totalAfterDiscount": 90
  }
}
```

**Réponses d'Erreur:**
```json
// Coupon invalide
{
  "success": false,
  "message": "Code promo invalide"
}

// Coupon expiré
{
  "success": false,
  "message": "Ce code promo a expiré"
}

// Coupon inactif
{
  "success": false,
  "message": "Ce code promo n'est plus actif"
}

// Limite atteinte
{
  "success": false,
  "message": "Ce code promo a atteint sa limite d'utilisation"
}
```

---

### 3. 👨‍💼 Gestion Admin (Admin uniquement)

**Endpoints Admin:**
- `POST /api/coupon/` - Créer un coupon
- `GET /api/coupon/` - Liste tous les coupons
- `GET /api/coupon/:id` - Détails d'un coupon
- `PUT /api/coupon/:id` - Modifier un coupon
- `DELETE /api/coupon/:id` - Supprimer un coupon

**Authentification:** Token JWT Admin requis

**Exemple - Créer un Coupon:**
```javascript
const createCoupon = async (couponData) => {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch('http://localhost:4000/api/coupon/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: "PROMO2024",
      discount: 15,
      expiry: "2024-12-31",
      isActive: true,
      usageLimit: 100
    })
  });
  
  return await response.json();
};
```

---

## 🎨 Exemple Composant React - Panier avec Coupon

```jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CartWithCoupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const cartTotal = useSelector(state => state.cart.total);
  const token = useSelector(state => state.auth.token);

  // Charger les coupons disponibles
  useEffect(() => {
    fetch('http://localhost:4000/api/coupon/active')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCoupons(data.coupons);
        }
      });
  }, []);

  // Appliquer le coupon
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      alert('Veuillez entrer un code promo');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/coupon/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          couponName: couponCode.toUpperCase(),
          cartTotal: cartTotal
        })
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.coupon);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Erreur lors de l\'application du coupon');
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = appliedCoupon 
    ? appliedCoupon.totalAfterDiscount 
    : cartTotal;

  return (
    <div className="cart-summary">
      {/* Afficher les coupons disponibles */}
      {coupons.length > 0 && (
        <div className="available-coupons">
          <h3>Codes Promo Disponibles</h3>
          {coupons.map(coupon => (
            <div key={coupon.id} className="coupon-badge">
              <span className="coupon-name">{coupon.name}</span>
              <span className="coupon-discount">-{coupon.discount}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire d'application */}
      <div className="coupon-form">
        <input
          type="text"
          placeholder="Code promo"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        />
        <button onClick={handleApplyCoupon} disabled={loading}>
          {loading ? 'Application...' : 'Appliquer'}
        </button>
      </div>

      {/* Résumé */}
      <div className="cart-totals">
        <div className="total-line">
          <span>Sous-total</span>
          <span>{cartTotal.toFixed(2)} €</span>
        </div>

        {appliedCoupon && (
          <div className="total-line discount">
            <span>Réduction ({appliedCoupon.name})</span>
            <span>-{appliedCoupon.discountAmount.toFixed(2)} €</span>
          </div>
        )}

        <div className="total-line final">
          <span>Total</span>
          <span>{finalTotal.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
};

export default CartWithCoupon;
```

---

## 📝 Notes Importantes

1. **Sécurité:** L'application de coupon nécessite l'authentification pour éviter les abus
2. **Validation:** Les coupons sont validés automatiquement (date, statut, limites)
3. **Case-insensitive:** Les codes sont convertis en majuscules automatiquement
4. **Calcul précis:** La réduction est calculée côté serveur pour garantir l'intégrité

---

## ✅ Checklist Frontend

- [ ] Afficher les coupons disponibles sur la page panier
- [ ] Formulaire de saisie de code promo
- [ ] Validation en temps réel
- [ ] Affichage de la réduction appliquée
- [ ] Mise à jour du total
- [ ] Gestion des erreurs (coupon invalide, expiré, etc.)
- [ ] Loading state pendant l'application
- [ ] Toast notifications pour feedback utilisateur

---

## 🚀 Prêt à Utiliser

L'API est maintenant complètement fonctionnelle et sécurisée !
