const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModels');

// MongoDB connection using the same config as the main app
const connectDB = async () => {
    try {
        const mongoUrl = 'mongodb://localhost:27017/ecomerce_sanny';
        await mongoose.connect(mongoUrl);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Create new admin user
const createAdmin = async () => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: 'admin@admin.com' });
        
        if (existingUser) {
            console.log('✅ Admin user already exists!');
            console.log('Admin details:', {
                id: existingUser._id,
                email: existingUser.email,
                firstname: existingUser.firstname,
                lastname: existingUser.lastname,
                role: existingUser.role,
                createdAt: existingUser.createdAt
            });
            return existingUser;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin user
        const adminData = {
            firstname: 'Admin',
            lastname: 'User', 
            email: 'admin@admin.com',
            mobile: '1234567890',
            password: hashedPassword,
            role: 'admin',
            isBlocked: false,
            cart: [],
            wishlist: [],
            orders: []
        };

        const newAdmin = new User(adminData);
        const savedAdmin = await newAdmin.save();
        
        console.log('✅ Admin user created successfully!');
        console.log('Admin details:', {
            id: savedAdmin._id,
            email: savedAdmin.email,
            firstname: savedAdmin.firstname,
            lastname: savedAdmin.lastname,
            role: savedAdmin.role
        });
        console.log('Default password: admin123');
        
        return savedAdmin;
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        throw error;
    }
};

// Main execution
const main = async () => {
    console.log('🚀 Setting up admin user...');
    try {
        await connectDB();
        await createAdmin();
        console.log('🎉 Admin setup completed!');
    } catch (error) {
        console.error('💥 Setup failed:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run the script
main();
