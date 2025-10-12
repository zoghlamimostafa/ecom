const axios = require('axios');

const createTestAdmin = async () => {
    try {
        console.log('🔧 Creating test admin user...');
        
        // Try to register the admin user first
        const registerData = {
            firstname: 'Test',
            lastname: 'Admin',
            email: 'newadmin@test.com',
            mobile: '+1234567890',
            password: 'admin123'
        };

        try {
            console.log('📝 Registering admin user...');
            const registerResponse = await axios.post('http://localhost:4000/api/user/register', registerData);
            console.log('✅ User registered successfully');
        } catch (error) {
            if (error.response?.status === 400 && error.response.data?.message?.includes('already exists')) {
                console.log('👤 User already exists, that\'s fine');
            } else {
                console.log('⚠️  Registration response:', error.response?.data?.message || error.message);
            }
        }

        // Now try to promote to admin by logging in and checking if we can access admin endpoints
        console.log('🔐 Testing admin login...');
        const loginResponse = await axios.post('http://localhost:4000/api/user/admin-login', {
            email: 'newadmin@test.com',
            password: 'admin123'
        });

        if (loginResponse.data.token) {
            console.log('✅ Admin login successful!');
            console.log('🎯 Admin user is ready for testing');
            console.log(`   Email: newadmin@test.com`);
            console.log(`   Password: admin123`);
            return true;
        }

    } catch (error) {
        console.log('❌ Admin creation/login failed:', error.response?.data?.message || error.message);
        console.log('\n🔧 Manual steps to create admin:');
        console.log('1. Start the backend server: npm run server');
        console.log('2. Register a user through the API or frontend');
        console.log('3. Manually update the user role to "admin" in the database');
        console.log('4. Or check existing admin creation scripts');
        return false;
    }
};

// Additional check for existing admin
const checkExistingAdmins = async () => {
    try {
        console.log('🔍 Checking for existing admin accounts...');
        
        const commonAdminEmails = [
            'admin@example.com',
            'admin@test.com',
            'test@admin.com',
            'zoghlamimustapha16@gmail.com',
            'newadmin@test.com'
        ];

        for (const email of commonAdminEmails) {
            try {
                const response = await axios.post('http://localhost:4000/api/user/admin-login', {
                    email,
                    password: 'admin123'
                });
                
                if (response.data.token) {
                    console.log(`✅ Found working admin: ${email}`);
                    return { email, password: 'admin123' };
                }
            } catch (error) {
                // Continue checking other emails
            }
        }
        
        console.log('❌ No existing admin accounts found with common credentials');
        return null;
    } catch (error) {
        console.log('Error checking admins:', error.message);
        return null;
    }
};

const main = async () => {
    console.log('🎯 Setting up admin user for testing...\n');
    
    // First check if any admin already exists
    const existingAdmin = await checkExistingAdmins();
    
    if (existingAdmin) {
        console.log('\n✅ Admin account is ready!');
        console.log(`Use: ${existingAdmin.email} / ${existingAdmin.password}`);
        return;
    }
    
    // Try to create new admin
    const adminCreated = await createTestAdmin();
    
    if (!adminCreated) {
        console.log('\n📋 Next steps:');
        console.log('1. Make sure backend server is running: npm run server');
        console.log('2. Try running: npm run quick-test again');
        console.log('3. Or manually create admin through the application');
    }
};

main().catch(console.error);
