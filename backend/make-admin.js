const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModels');

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomerce_sanny'); // using 'test' database
    const email = 'zoghlamimustapha16@gmail.com';
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );
    if (user) {
      console.log(`✅ User ${email} is now an admin.`);
    } else {
      console.log(`⚠️ User ${email} not found. Creating as admin...`);
      const newUser = await User.create({
        firstname: 'Mustapha',
        lastname: 'Zoghlami',
        email,
        mobile: '0000000000',
        password: 'admin123', // default password, should be changed later
        role: 'admin'
      });
      console.log(`✅ Created new admin user: ${newUser.email}`);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error making user admin:', err);
    process.exit(1);
  }
})();
