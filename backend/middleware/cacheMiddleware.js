const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Créer une clé unique basée sur l'URL et les paramètres
    const key = req.originalUrl + JSON.stringify(req.query);
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      console.log('📦 Cache HIT pour:', req.originalUrl);
      return res.json(cachedResponse);
    }
    
    // Stocker la méthode json originale
    const originalJson = res.json;
    
    // Override res.json pour capturer et cacher la réponse
    res.json = function(data) {
      cache.set(key, data, duration);
      console.log('💾 Cache SET pour:', req.originalUrl);
      return originalJson.call(this, data);
    };
    
    next();
  };
};

module.exports = cacheMiddleware;