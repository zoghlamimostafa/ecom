const mongoose = require('mongoose');

const ConnectDatabase = async () => {
    try {
        // If already connected, don't connect again (important for tests)
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected, skipping connection');
            return;
        }
        
        const mongoUrl = 'mongodb://localhost:27017/ecomerce_sanny';
        await mongoose.connect(mongoUrl);
        console.log(`MongoDB Database connected with HOST: ${mongoose.connection.host}`);
    } catch (err) {
        console.error('Erreur de connexion à la base de données :', err.message);
        process.exit(1);
    }
};

module.exports = ConnectDatabase;

module.exports = ConnectDatabase;