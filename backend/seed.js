const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const ConnectDatabase = require('./config/dbConnect');
const User = require('./models/userModels');
const Product = require('./models/productModel');

(async () => {
  try {
    await ConnectDatabase();

    // Create fake users
    const users = Array.from({ length: 5 }).map(() => ({
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      mobile: faker.phone.number(),
      password: 'password123',
      role: 'user'
    }));
    await User.insertMany(users);

    // Create fake products
    const products = Array.from({ length: 10 }).map(() => ({
      title: faker.commerce.productName(),
      slug: faker.lorem.slug(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      category: faker.commerce.department(),
      brand: faker.company.name(),
      quantity: faker.number.int({ min: 1, max: 100 }),
      images: [{ url: faker.image.url() }],
      tags: [faker.commerce.productAdjective()]
    }));
    await Product.insertMany(products);

    console.log('✅ Fake data inserted successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error inserting fake data:', err);
    process.exit(1);
  }
})();
