const express = require('express');
const app = express();
const cors = require('cors');

const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const paymentRouter = require("./routes/paymentRoutes");
const productRouter = require('./routes/productRoute');
const blogRoute = require('./routes/blogRoute');
const blogcategoryRouter = require('./routes/blogCatRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const colorRouter = require("./routes/colorRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const enqRouter = require("./routes/enqRoute");
const refreshTokenRouter = require("./routes/refreshToken");
const session = require('express-session');
// const images = require ("./routes/imageRoutes");             // Temporarily commented

const ConnectDatabase = require('./config/dbConnect');

app.use(cors());
app.use(session({
    secret: 'secret', // Changez ceci pour un secret plus sécurisé
    resave: false,
    saveUninitialized: true
}));
const morgan = require("morgan");
app.use(morgan("dev"));
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

ConnectDatabase();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // Allow admin, client frontends and React app
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json({ limit: '500mb' })); // Limite très élevée
app.use(bodyParser.urlencoded({ extended: false, limit: '500mb' }));

// Health check route
app.get('/api/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/user', authRouter);
app.use("/api/payment", paymentRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRoute);
app.use('/api/blogcategory', blogcategoryRouter);
app.use('/api/brand', brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/category", categoryRouter);
// app.use("/api/images", images);        // Temporarily commented
app.use("/api/token", refreshTokenRouter); // Added route for refreshing tokens

app.use(notFound);
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running at http://0.0.0.0:${PORT}`);
        console.log(`Also accessible at http://localhost:${PORT}`);
    });
}