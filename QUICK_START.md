# 🚀 Quick Start Guide - Sanny E-Commerce

## One-Command Setup and Run

This guide shows you how to install and run the entire Sanny e-commerce application with a single command.

## Prerequisites

- **Node.js**: v14.0.0 or higher (v18.19.1 tested)
- **npm**: v10.x or higher

## 🎯 Quick Start (Single Command)

To install all dependencies and start all services (backend, client, admin) in one go:

```bash
cd /path/to/sanny/san/ecomerce_sanny
npm run dev
```

This will:
1. Start the **Backend API** on http://localhost:4000
2. Start the **Client Store** on http://localhost:3000
3. Start the **Admin Panel** on http://localhost:3001

## 🔧 Manual Setup (Alternative)

If you prefer to install dependencies separately:

```bash
cd /path/to/sanny/san/ecomerce_sanny

# Install all dependencies for all sub-projects
npm run install-all

# Then start all services
npm run dev
```

## 📦 Individual Service Commands

### Backend Only
```bash
cd backend
npm run dev        # Start with nodemon (auto-reload)
# or
node index.js      # Start without auto-reload
```

### Client Store Only
```bash
cd Client
npm start
```

### Admin Panel Only
```bash
cd admin-app
npm start
```

## 🌐 Access URLs

Once running, you can access:

- **Client Store**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/

## 🐛 Common Issues & Solutions

### CORS Errors
**Fixed!** The backend now properly configures CORS to allow requests from:
- http://localhost:3000 (Client)
- http://localhost:3001 (Admin)
- http://localhost:3002 (Backup)

### Port Already in Use
If you see "port already in use" errors:

```bash
# Kill process on port 4000 (backend)
lsof -ti :4000 | xargs kill -9

# Kill process on port 3000 (client)
lsof -ti :3000 | xargs kill -9

# Kill process on port 3001 (admin)
lsof -ti :3001 | xargs kill -9
```

### Module Not Found Errors
**Fixed!** Case-sensitive import paths have been corrected:
- `refreshToken` → `refreshtoken`

## 📁 Project Structure

```
san/ecomerce_sanny/
├── backend/           # Node.js/Express API (Port 4000)
├── Client/            # React Customer Store (Port 3000)
├── admin-app/         # React Admin Panel (Port 3001)
├── package.json       # Root scripts for coordinated start
└── QUICK_START.md     # This file
```

## 🗄️ Database

The application uses **SQLite** by default:
- Database file: `backend/database.sqlite`
- Automatically created on first run
- Tables synchronized automatically

## 🔐 Environment Variables

Make sure you have a `.env` file in the `backend/` directory with:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
# Add other credentials as needed (Stripe, Cloudinary, etc.)
```

## ✅ Verification

Test that everything is working:

```bash
# Test backend health
curl http://localhost:4000/api/

# Test products API
curl http://localhost:4000/api/product

# Open browser and check:
# - http://localhost:3000 (should show store homepage)
# - http://localhost:3001 (should show admin login)
```

## 🛠️ Bug Fixes Applied

1. **CORS Configuration**: Removed duplicate `cors()` middleware and properly configured allowed origins
2. **Case-Sensitive Imports**: Fixed `refreshToken` → `refreshtoken` in multiple files
3. **Dependencies**: Installed all required packages for backend, client, and admin

## 📝 Next Steps

- Configure your payment gateway credentials (Stripe, etc.)
- Set up Cloudinary for image uploads
- Configure email service for password reset
- Review and update security settings for production

## 🆘 Need Help?

Check the main documentation files:
- `DOCUMENTATION_SANNY_STORE.md`
- `GUIDE_DEMARRAGE_CORRIGE.md`
- `DATABASE_GUIDE.md`

---

**Last Updated**: October 10, 2025
**Status**: ✅ All services running successfully
