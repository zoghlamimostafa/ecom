# Database Management Commands

## 🎯 Quick Commands

### Start the project:
```bash
# Root directory
npm run dev

# Or start each component separately:
cd backend && npm start      # Backend API
cd Client && npm start       # Client app
cd admin-app && npm start    # Admin panel
```

### Database Operations:
```bash
# Seed database with fake data
cd backend && node seed-complete.js

# Verify database content
cd backend && node verify-db.js

# Create admin user only
cd backend && node setup-admin.js
```

## 📊 What's in your database now:

### 👤 Users (6 total):
- **Admin**: admin@admin.com / admin123
- **Regular users**: 
  - jean.dupont@email.com / password123
  - marie.martin@email.com / password123
  - pierre.bernard@email.com / password123
  - sophie.dubois@email.com / password123
  - lucas.moreau@email.com / password123

### 🛍️ Products (5 total):
- iPhone 15 Pro Max (1299€)
- Samsung Galaxy S24 Ultra (1199€)
- Nike Air Max 270 (150€)
- Robe Zara Élégante (89€)
- Casque Sony WH-1000XM5 (350€)

### 📁 Categories (8 total):
- Électronique
- Mode Homme
- Mode Femme
- Maison & Jardin
- Sports & Loisirs
- Bébé & Enfant
- Auto & Moto
- Santé & Beauté

### 🏷️ Brands (8 total):
- Samsung, Apple, Nike, Adidas, Sony, LG, Zara, H&M

### 🎨 Colors (8 total):
- Rouge, Bleu, Vert, Noir, Blanc, Jaune, Rose, Gris

### 🎟️ Coupons (3 total):
- WELCOME2025: 10% off
- SUMMER2025: 15% off
- TECH50: 50% off

### 📝 Blog Content (2 articles + 4 categories)

## 🚀 Next Steps:

1. **Start the applications**:
   ```bash
   npm run dev
   ```

2. **Test admin login**:
   - Go to admin panel (usually http://localhost:3001)
   - Login with: admin@admin.com / admin123

3. **Test client app**:
   - Go to client app (usually http://localhost:3000)
   - Browse products, create account, test features

4. **MongoDB Connection**:
   - Your MongoDB is running on: `mongodb://localhost:27017/ecomerce_sanny`
   - Database name: `ecomerce_sanny`

## 🔧 Troubleshooting:

If you need to reset the database:
```bash
cd backend && node seed-complete.js
```

If MongoDB is not running:
- Start MongoDB service on your system
- Or use MongoDB Atlas for cloud database
