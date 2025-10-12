// Script de préparation pour le déploiement de Sanny Store
const fs = require('fs');
const path = require('path');

console.log('🚀 PRÉPARATION DÉPLOIEMENT SANNY STORE');
console.log('=====================================\n');

// Vérification de la structure du projet
const checkProjectStructure = () => {
  console.log('1. 📋 Vérification de la structure du projet:');
  
  const requiredPaths = [
    'Client/package.json',
    'Client/src/App.js',
    'Client/public/index.html',
    'backend/package.json',
    'backend/index.js'
  ];
  
  let allExists = true;
  requiredPaths.forEach(pathToCheck => {
    const exists = fs.existsSync(pathToCheck);
    console.log(`   ${exists ? '✅' : '❌'} ${pathToCheck}`);
    if (!exists) allExists = false;
  });
  
  return allExists;
};

// Création des fichiers de configuration pour le déploiement
const createDeploymentConfig = () => {
  console.log('\n2. 📝 Création des fichiers de configuration:');
  
  // .env.example pour le backend
  const envExample = `# Configuration de production
NODE_ENV=production
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanny_store
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=https://your-frontend-domain.com
`;

  // Dockerfile pour le backend
  const dockerfile = `FROM node:18-alpine

# Créer le répertoire de l'app
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 4000

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Démarrer l'application
CMD ["npm", "start"]
`;

  // docker-compose.yml pour l'environnement complet
  const dockerCompose = `version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=sanny_store
      - DB_USER=postgres
      - DB_PASSWORD=postgres123
    depends_on:
      - db
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=sanny_store
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  frontend:
    build: ./Client
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:4000
    volumes:
      - ./Client:/usr/src/app
      - /usr/src/app/node_modules

volumes:
  postgres_data:
`;

  // Dockerfile pour le frontend
  const frontendDockerfile = `FROM node:18-alpine as build

WORKDIR /usr/src/app

# Copier package.json
COPY package*.json ./
RUN npm ci --silent

# Copier le code source et build
COPY . .
RUN npm run build

# Production stage avec Nginx
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;

  // Configuration Nginx
  const nginxConfig = `events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Handle React Router
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # API proxy
        location /api/ {
            proxy_pass http://backend:4000/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript;
    }
}
`;

  // Railway configuration
  const railwayConfig = `{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
`;

  // Vercel configuration
  const vercelConfig = `{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
`;

  // Scripts de déploiement
  const deployScript = `#!/bin/bash
# Script de déploiement automatique pour Sanny Store

echo "🚀 Déploiement Sanny Store - $(date)"
echo "=================================="

# Vérification des dépendances
command -v node >/dev/null 2>&1 || { echo "❌ Node.js requis"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm requis"; exit 1; }

# Variables
FRONTEND_DIR="Client"
BACKEND_DIR="backend"
BUILD_DIR="build"

echo "📦 1. Nettoyage et installation des dépendances..."

# Frontend
cd $FRONTEND_DIR
echo "   🔨 Frontend: installation des dépendances..."
npm ci --silent
echo "   📦 Frontend: build de production..."
npm run build
cd ..

# Backend
cd $BACKEND_DIR
echo "   🔨 Backend: installation des dépendances..."
npm ci --production --silent
echo "   🧪 Backend: tests..."
npm test --silent
cd ..

echo "✅ 2. Build terminé avec succès!"

# Vérification du build
if [ -d "$FRONTEND_DIR/$BUILD_DIR" ]; then
    echo "   ✅ Build frontend créé: $(du -sh $FRONTEND_DIR/$BUILD_DIR | cut -f1)"
else
    echo "   ❌ Erreur: Build frontend introuvable"
    exit 1
fi

echo "🌐 3. Prêt pour le déploiement!"
echo "   📁 Frontend build: $FRONTEND_DIR/$BUILD_DIR"
echo "   ⚙️  Backend: $BACKEND_DIR"
echo ""
echo "🚀 Étapes suivantes:"
echo "   1. Configurer les variables d'environnement"
echo "   2. Déployer le backend sur Railway/Heroku"
echo "   3. Déployer le frontend sur Vercel/Netlify"
echo "   4. Configurer le domaine personnalisé"
echo ""
echo "📖 Documentation complète: GUIDE_HEBERGEMENT_COMPLETE.md"
`;

  // Écriture des fichiers
  try {
    if (!fs.existsSync('backend/.env.example')) {
      fs.writeFileSync('backend/.env.example', envExample);
      console.log('   ✅ .env.example créé');
    }
    
    if (!fs.existsSync('backend/Dockerfile')) {
      fs.writeFileSync('backend/Dockerfile', dockerfile);
      console.log('   ✅ backend/Dockerfile créé');
    }
    
    if (!fs.existsSync('Client/Dockerfile')) {
      fs.writeFileSync('Client/Dockerfile', frontendDockerfile);
      console.log('   ✅ Client/Dockerfile créé');
    }
    
    if (!fs.existsSync('Client/nginx.conf')) {
      fs.writeFileSync('Client/nginx.conf', nginxConfig);
      console.log('   ✅ nginx.conf créé');
    }
    
    if (!fs.existsSync('docker-compose.yml')) {
      fs.writeFileSync('docker-compose.yml', dockerCompose);
      console.log('   ✅ docker-compose.yml créé');
    }
    
    if (!fs.existsSync('backend/railway.json')) {
      fs.writeFileSync('backend/railway.json', railwayConfig);
      console.log('   ✅ railway.json créé');
    }
    
    if (!fs.existsSync('Client/vercel.json')) {
      fs.writeFileSync('Client/vercel.json', vercelConfig);
      console.log('   ✅ vercel.json créé');
    }
    
    if (!fs.existsSync('deploy.sh')) {
      fs.writeFileSync('deploy.sh', deployScript);
      console.log('   ✅ deploy.sh créé');
    }
    
  } catch (error) {
    console.error('   ❌ Erreur lors de la création des fichiers:', error.message);
  }
};

// Vérification des dépendances
const checkDependencies = () => {
  console.log('\n3. 🔍 Vérification des dépendances:');
  
  try {
    // Frontend
    const frontendPkg = JSON.parse(fs.readFileSync('Client/package.json', 'utf8'));
    console.log(`   ✅ Frontend React ${frontendPkg.dependencies.react}`);
    
    // Backend
    const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    console.log(`   ✅ Backend Node.js (Express ${backendPkg.dependencies.express})`);
    
    // Vérification des scripts
    if (frontendPkg.scripts && frontendPkg.scripts.build) {
      console.log('   ✅ Script de build frontend disponible');
    } else {
      console.log('   ⚠️  Script de build manquant dans frontend');
    }
    
    if (backendPkg.scripts && backendPkg.scripts.start) {
      console.log('   ✅ Script de start backend disponible');
    } else {
      console.log('   ⚠️  Script de start manquant dans backend');
    }
    
  } catch (error) {
    console.error('   ❌ Erreur lors de la vérification:', error.message);
  }
};

// Génération du rapport de déploiement
const generateDeploymentReport = () => {
  console.log('\n4. 📊 Rapport de déploiement:');
  
  const report = {
    timestamp: new Date().toISOString(),
    project: 'Sanny Store E-commerce',
    status: 'Prêt pour déploiement',
    frontend: {
      framework: 'React 18.2.0',
      buildTool: 'Create React App',
      recommended: 'Vercel ou Netlify'
    },
    backend: {
      runtime: 'Node.js',
      framework: 'Express',
      database: 'SQLite (migration PostgreSQL recommandée)',
      recommended: 'Railway ou Heroku'
    },
    estimatedCost: {
      free: '0€/mois (Vercel + Railway gratuit)',
      professional: '12-15€/mois (VPS + domaine)'
    }
  };
  
  console.log(`   📅 Date: ${report.timestamp}`);
  console.log(`   🎯 Projet: ${report.project}`);
  console.log(`   📱 Frontend: ${report.frontend.framework} → ${report.frontend.recommended}`);
  console.log(`   ⚙️  Backend: ${report.backend.framework} → ${report.backend.recommended}`);
  console.log(`   💰 Coût estimé: ${report.estimatedCost.free}`);
  
  // Sauvegarde du rapport
  fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
  console.log('   ✅ Rapport sauvegardé: deployment-report.json');
};

// Conseils finaux
const showFinalAdvice = () => {
  console.log('\n5. 💡 Conseils pour le déploiement:');
  console.log('   🔐 Sécurisez vos variables d\'environnement');
  console.log('   🗄️  Migrez vers PostgreSQL pour la production');
  console.log('   📈 Configurez le monitoring (UptimeRobot)');
  console.log('   🔒 Activez HTTPS sur votre domaine');
  console.log('   💾 Configurez des backups automatiques');
  console.log('   📊 Ajoutez Google Analytics');
  
  console.log('\n🎯 Prochaines étapes recommandées:');
  console.log('   1. Choisir votre solution d\'hébergement');
  console.log('   2. Créer les comptes (Vercel, Railway, etc.)');
  console.log('   3. Configurer les variables d\'environnement');
  console.log('   4. Exécuter le script deploy.sh');
  console.log('   5. Tester votre site en production');
  
  console.log('\n📖 Documentation complète: GUIDE_HEBERGEMENT_COMPLETE.md');
};

// Exécution du script
const main = () => {
  const structureOk = checkProjectStructure();
  
  if (!structureOk) {
    console.log('\n❌ Structure du projet incomplète. Vérifiez les fichiers manquants.');
    return;
  }
  
  createDeploymentConfig();
  checkDependencies();
  generateDeploymentReport();
  showFinalAdvice();
  
  console.log('\n✅ Préparation terminée! Votre projet est prêt pour le déploiement.');
};

// Lancement du script
main();