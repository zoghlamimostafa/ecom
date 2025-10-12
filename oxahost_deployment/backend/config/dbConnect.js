const { sequelize, defineAssociations } = require('../models');

const ConnectDatabase = async () => {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('✅ SQLite Database connection established successfully.');
        console.log(`Connected to SQLite database: ${sequelize.options.storage || 'in-memory'}`);
        
        // Define model associations
        defineAssociations();
        
        // Sync database (create tables if they don't exist)
        // Use force: false to preserve existing data
        await sequelize.sync({ force: false });
        console.log('✅ Database tables synchronized successfully.');
        
    } catch (error) {
        console.error('❌ Unable to connect to SQLite database:', error);
        console.error('Error details:', error.message);
        // Don't exit in development, just log the error
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = ConnectDatabase;