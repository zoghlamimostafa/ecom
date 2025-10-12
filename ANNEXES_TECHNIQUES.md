# 🔧 ANNEXES TECHNIQUES SANNY STORE

## Base de données - Schémas détaillés

### Collection Users
```javascript
{
  _id: ObjectId,
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  cart: [{
    product: { type: ObjectId, ref: "Product" },
    count: Number,
    color: { type: ObjectId, ref: "Color" },
    price: Number
  }],
  address: [{
    type: String
  }],
  wishlist: [{ type: ObjectId, ref: "Product" }],
  refreshToken: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Collection Products
```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: ObjectId,
    ref: "PCategory",
    required: true
  },
  brand: {
    type: ObjectId,
    ref: "Brand",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  images: [{
    public_id: String,
    url: String
  }],
  color: [{
    type: ObjectId,
    ref: "Color"
  }],
  tags: [String],
  ratings: [{
    star: { type: Number, min: 1, max: 5 },
    comment: String,
    postedby: { type: ObjectId, ref: "User" }
  }],
  totalrating: {
    type: String,
    default: 0
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Collection Orders
```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  shippingInfo: {
    firstname: String,
    lastname: String,
    address: String,
    city: String,
    state: String,
    other: String,
    pincode: String
  },
  paymentInfo: {
    razorpayOrderId: String,
    razorpayPaymentId: String
  },
  orderItems: [{
    product: { type: ObjectId, ref: "Product" },
    color: { type: ObjectId, ref: "Color" },
    quantity: Number,
    price: Number
  }],
  paidAt: Date,
  month: {
    type: String,
    default: new Date().getMonth()
  },
  totalPrice: Number,
  totalPriceAfterDiscount: Number,
  orderStatus: {
    type: String,
    default: "Ordered",
    enum: ["Ordered", "Processing", "Dispatched", "Cancelled", "Delivered"]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## API Routes Complètes

### Authentication Routes (/api/user)
```javascript
// Public routes
POST /register              # Inscription utilisateur
POST /login                 # Connexion utilisateur
POST /admin-login           # Connexion administrateur
POST /forgot-password-token # Demande reset password
PUT  /reset-password/:token # Reset password avec token

// Protected routes (auth required)
GET    /                    # Profil utilisateur
GET    /refresh             # Refresh token
GET    /logout              # Déconnexion
PUT    /password            # Changer mot de passe
PUT    /save-address        # Sauvegarder adresse
PUT    /edit-user           # Modifier profil
GET    /wishlist            # Voir wishlist
PUT    /cart                # Modifier panier
GET    /cart                # Voir panier
DELETE /empty-cart          # Vider panier
PUT    /cart/applycoupon    # Appliquer coupon
POST   /cart/cash-order     # Commande cash
GET    /get-orders          # Historique commandes
GET    /getallorders        # Toutes commandes [ADMIN]
POST   /getorderbyuser/:id  # Commandes par utilisateur [ADMIN]
GET    /getaOrder/:id       # Détail commande [ADMIN]
PUT    /updateOrder/:id     # Modifier statut [ADMIN]

// Admin only routes
GET    /all-users           # Liste utilisateurs [ADMIN]
GET    /:id                 # Détail utilisateur [ADMIN]
DELETE /:id                 # Supprimer utilisateur [ADMIN]
PUT    /block-user/:id      # Bloquer utilisateur [ADMIN]
PUT    /unblock-user/:id    # Débloquer utilisateur [ADMIN]
```

### Product Routes (/api/product)
```javascript
// Public routes
GET  /                      # Liste produits avec filtres
GET  /:id                   # Détail produit

// Protected routes
PUT  /wishlist              # Toggle wishlist [AUTH]
PUT  /rating                # Noter produit [AUTH]

// Admin routes
POST   /                    # Créer produit [ADMIN]
PUT    /:id                 # Modifier produit [ADMIN]  
DELETE /:id                 # Supprimer produit [ADMIN]
PUT    /upload/:id          # Upload images [ADMIN]
DELETE /delete-img/:id      # Supprimer image [ADMIN]
```

### Category Routes (/api/category)
```javascript
// Public routes
GET  /                      # Liste catégories

// Admin routes
POST   /                    # Créer catégorie [ADMIN]
PUT    /:id                 # Modifier catégorie [ADMIN]
DELETE /:id                 # Supprimer catégorie [ADMIN]
GET    /:id                 # Détail catégorie [ADMIN]
```

## Configuration détaillée

### Variables d'environnement complètes
```bash
# Server Configuration
NODE_ENV=development
PORT=4000
BASE_URL=http://localhost:4000

# Database
MONGODB_URL=mongodb://127.0.0.1:27017/ecomerce_sanny
DB_NAME=ecomerce_sanny

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Cloudinary (Images)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
SECRET_KEY=your_cloudinary_secret_key

# Payment (Stripe)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_email
SMTP_PASS=your_brevo_smtp_key
EMAIL_FROM=noreply@sannystore.com
EMAIL_FROM_NAME=Sanny Store

# Frontend URLs
CLIENT_URL=http://localhost:3001
ADMIN_URL=http://localhost:3000

# Security
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

### Middleware Configuration
```javascript
// Security middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "res.cloudinary.com"],
      scriptSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP"
});

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(','),
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Morgan logging
app.use(morgan('combined'));
```

## Tests unitaires

### Structure des tests
```
backend/
├── tests/
│   ├── unit/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── products.test.js
│   │   └── orders.test.js
│   └── fixtures/
│       ├── users.json
│       └── products.json
```

### Exemple de test
```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/userModels');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/user/register', () => {
    it('should register a new user', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        mobile: '1234567890'
      };

      const response = await request(app)
        .post('/api/user/register')
        .send(userData)
        .expect(201);

      expect(response.body.firstname).toBe(userData.firstname);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.password).toBeUndefined();
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'invalid-email',
        password: 'password123',
        mobile: '1234567890'
      };

      await request(app)
        .post('/api/user/register')
        .send(userData)
        .expect(400);
    });
  });
});
```

## Performance et optimisation

### Indexation MongoDB
```javascript
// Indexes recommandés
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ category: 1, brand: 1 });
db.products.createIndex({ title: "text", description: "text" });
db.orders.createIndex({ user: 1, createdAt: -1 });
```

### Cache Strategy
```javascript
// Redis configuration pour le cache
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Cache middleware
const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};

// Usage
app.get('/api/product/', cacheMiddleware(300), getAllProducts);
```

### Optimizations recommandées
```javascript
// Pagination
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const products = await Product.find()
  .skip(skip)
  .limit(limit)
  .populate('category brand color');

// Aggregation pour les statistiques
const stats = await Order.aggregate([
  {
    $group: {
      _id: { month: "$month" },
      totalSales: { $sum: "$totalPrice" },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { "_id.month": 1 } }
]);

// Projection pour limiter les données
const products = await Product.find()
  .select('title price images category brand')
  .populate('category', 'title')
  .populate('brand', 'title');
```

## Sécurité avancée

### Validation des données
```javascript
const Joi = require('joi');

const productSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(2000).required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(0).required(),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  brand: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  color: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
  tags: Joi.array().items(Joi.string().max(50))
});
```

### Audit Log
```javascript
const auditLog = {
  user: req.user._id,
  action: 'CREATE_PRODUCT',
  resource: 'Product',
  resourceId: product._id,
  changes: productData,
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  timestamp: new Date()
};

await AuditLog.create(auditLog);
```

## Déploiement Docker

### Dockerfile Backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

USER node

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    container_name: sanny-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    container_name: sanny-backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGODB_URL=mongodb://admin:password@mongodb:27017/ecomerce_sanny?authSource=admin
    depends_on:
      - mongodb
    ports:
      - "4000:4000"

  client:
    build: ./Client
    container_name: sanny-client
    restart: unless-stopped
    ports:
      - "3001:80"

  admin:
    build: ./admin-app
    container_name: sanny-admin
    restart: unless-stopped
    ports:
      - "3000:80"

volumes:
  mongo_data:
```

## Monitoring et logs

### Winston Logger Configuration
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sanny-store' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Health Check Endpoint
```javascript
app.get('/health', async (req, res) => {
  try {
    // Vérifier la connexion MongoDB
    await mongoose.connection.db.admin().ping();
    
    // Vérifier Redis si utilisé
    // await redisClient.ping();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      mongodb: 'connected',
      // redis: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```
