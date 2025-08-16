# E-Commerce Platform

A full-stack e-commerce platform built with React, Node.js, Express, and MongoDB.

## Project Structure

```
ecom/
├── backend/           # Node.js/Express API server
├── admin-app/         # React admin panel
├── Client/           # React customer frontend
└── README.md
```

## Features

### Backend (Node.js/Express/MongoDB)
- User authentication and authorization
- Product management (CRUD operations)
- Order management system
- Shopping cart and wishlist functionality
- Payment integration
- Admin dashboard APIs
- Image upload and management
- Email notifications

### Admin Panel (React)
- Dashboard with sales analytics
- Product management interface
- Order management system
- Customer management
- Category and brand management
- Coupon management
- Blog management
- Inventory tracking

### Client Application (React)
- Product catalog with search and filters
- Shopping cart and checkout
- User account management
- Wishlist functionality
- Order history
- Responsive design
- Blog section

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Redux Toolkit, Ant Design
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **Email**: Nodemailer
- **Payment**: Stripe integration
- **Styling**: Bootstrap, CSS3

## Prerequisites

Before running this application, make sure you have:
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/zoghlamimostafa/ecom.git
cd ecom
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with:
```
MONGODB_URI=mongodb://localhost:27017/ecomerce_sanny
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. Admin Panel Setup
```bash
cd admin-app
npm install
```

### 4. Client Application Setup
```bash
cd Client
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:4000
```

### Start Admin Panel
```bash
cd admin-app
npm start
# Admin panel runs on http://localhost:3001
```

### Start Client Application
```bash
cd Client
npm start
# Client app runs on http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/admin-login` - Admin login
- `POST /api/user/forgot-password` - Password reset

### Products
- `GET /api/product/` - Get all products
- `POST /api/product/` - Create product (admin)
- `PUT /api/product/:id` - Update product (admin)
- `DELETE /api/product/:id` - Delete product (admin)

### Orders
- `GET /api/user/getallorders` - Get all orders (admin)
- `POST /api/user/getorderbyuser/:id` - Get order details
- `PUT /api/user/order/update-order/:id` - Update order status
- `DELETE /api/user/delete-order/:id` - Delete order

### Cart & Wishlist
- `PUT /api/user/cart` - Add to cart
- `GET /api/user/cart` - Get cart items
- `PUT /api/user/wishlist/:prodId` - Add to wishlist
- `GET /api/user/wishlist` - Get wishlist items

## Default Admin Credentials

```
Email: zoghlamimustapha16@gmail.com
Password: admin123456
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Mustapha Zoghlami - zoghlamimustapha16@gmail.com

Project Link: [https://github.com/zoghlamimostafa/ecom](https://github.com/zoghlamimostafa/ecom)
