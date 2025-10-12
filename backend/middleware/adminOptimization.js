const asyncHandler = require("express-async-handler");

// Middleware pour optimiser les requêtes admin
const adminOptimizationMiddleware = asyncHandler(async (req, res, next) => {
  // Forcer la pagination pour les requêtes admin
  if (req.originalUrl.includes('/admin') && req.method === 'GET') {
    // Limiter le nombre d'éléments par page pour l'admin
    if (!req.query.limit || parseInt(req.query.limit) > 100) {
      req.query.limit = '20'; // Maximum 20 éléments par page pour l'admin
    }
    
    // S'assurer qu'il y a toujours une page
    if (!req.query.page) {
      req.query.page = '1';
    }
    
    // Ajouter un timeout pour les requêtes longues
    req.setTimeout(10000); // 10 secondes max
  }
  
  next();
});

// Middleware pour logger les performances
const performanceLoggerMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 2000) { // Si la requête prend plus de 2 secondes
      console.warn(`⚠️  SLOW REQUEST: ${req.method} ${req.originalUrl} took ${duration}ms`);
    } else {
      console.log(`✅ ${req.method} ${req.originalUrl} - ${duration}ms`);
    }
  });
  
  next();
};

module.exports = {
  adminOptimizationMiddleware,
  performanceLoggerMiddleware
};