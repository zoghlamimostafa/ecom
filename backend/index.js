const express = require('express');
const app = express();
const cors = require('cors');

const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoute');
const paymentRouter = require("./routes/paymentRoutes");
const productRouter = require('./routes/productRoute');
const blogRoute = require('./routes/blogRoute');
const blogcategoryRouter = require('./routes/blogCatRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require("./routes/couponRoute");
// const uploadRouter = require("./routes/uploadRoute");         // Temporarily commented
const colorRouter = require("./routes/colorRoute");
const categoryRouter = require("./routes/prodcategoryRoute");

// const enqRouter = require("./routes/enqRoute");               // Temporarily commented
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

if (mongoose.connection.readyState === 0) {
    ConnectDatabase();
}

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow both admin and client frontends
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/user', authRouter);
app.use("/api/payment", paymentRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRoute);
app.use('/api/blogcategory', blogcategoryRouter);
app.use('/api/brand', brandRouter);
app.use("/api/coupon", couponRouter);
// app.use("/api/upload", uploadRouter);  // Temporarily commented
app.use("/api/color", colorRouter);
// app.use("/api/enquiry", enqRouter);    // Temporarily commented
app.use("/api/category", categoryRouter);
// app.use("/api/images", images);        // Temporarily commented
app.use("/api/token", refreshTokenRouter); // Added route for refreshing tokens

app.use(notFound);
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
    });
}