// Cypress E2E Tests for E-commerce Sanny

describe('E-commerce Sanny E2E Tests', () => {
  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Visit the homepage
    cy.visit('http://localhost:3000');
  });

  // ========== AUTHENTICATION FLOW ==========
  describe('Authentication Flow', () => {
    describe('User Registration', () => {
      it('should register a new user successfully', () => {
        cy.get('[data-testid="register-link"]', { timeout: 10000 }).click();
        
        // Fill registration form
        cy.get('[data-testid="firstname-input"]').type('John');
        cy.get('[data-testid="lastname-input"]').type('Doe');
        cy.get('[data-testid="email-input"]').type('john.doe@test.com');
        cy.get('[data-testid="mobile-input"]').type('+1234567890');
        cy.get('[data-testid="password-input"]').type('password123');
        cy.get('[data-testid="confirm-password-input"]').type('password123');
        
        // Submit form
        cy.get('[data-testid="register-button"]').click();
        
        // Verify successful registration
        cy.url().should('include', '/');
        cy.contains('Registration successful').should('be.visible');
      });

      it('should show validation errors for invalid data', () => {
        cy.get('[data-testid="register-link"]').click();
        
        // Try to submit empty form
        cy.get('[data-testid="register-button"]').click();
        
        // Check validation messages
        cy.contains('First name is required').should('be.visible');
        cy.contains('Last name is required').should('be.visible');
        cy.contains('Email is required').should('be.visible');
        cy.contains('Mobile is required').should('be.visible');
        cy.contains('Password is required').should('be.visible');
      });

      it('should prevent registration with existing email', () => {
        // First, register a user
        cy.registerUser('existing@test.com', 'password123');
        
        // Try to register with same email
        cy.get('[data-testid="register-link"]').click();
        cy.fillRegistrationForm('Jane', 'Smith', 'existing@test.com', '+9876543210', 'password123');
        cy.get('[data-testid="register-button"]').click();
        
        // Check error message
        cy.contains('User already exists').should('be.visible');
      });
    });

    describe('User Login', () => {
      beforeEach(() => {
        // Register a test user
        cy.registerUser('test@test.com', 'password123');
      });

      it('should login user with valid credentials', () => {
        cy.get('[data-testid="login-link"]').click();
        
        // Fill login form
        cy.get('[data-testid="email-input"]').type('test@test.com');
        cy.get('[data-testid="password-input"]').type('password123');
        
        // Submit form
        cy.get('[data-testid="login-button"]').click();
        
        // Verify successful login
        cy.url().should('include', '/');
        cy.get('[data-testid="user-menu"]').should('be.visible');
        cy.contains('Welcome back').should('be.visible');
      });

      it('should reject invalid credentials', () => {
        cy.get('[data-testid="login-link"]').click();
        
        // Fill with wrong credentials
        cy.get('[data-testid="email-input"]').type('test@test.com');
        cy.get('[data-testid="password-input"]').type('wrongpassword');
        
        // Submit form
        cy.get('[data-testid="login-button"]').click();
        
        // Check error message
        cy.contains('Invalid email or password').should('be.visible');
      });

      it('should show validation errors for empty fields', () => {
        cy.get('[data-testid="login-link"]').click();
        
        // Try to submit empty form
        cy.get('[data-testid="login-button"]').click();
        
        // Check validation messages
        cy.contains('Email is required').should('be.visible');
        cy.contains('Password is required').should('be.visible');
      });
    });

    describe('User Logout', () => {
      beforeEach(() => {
        cy.loginUser('test@test.com', 'password123');
      });

      it('should logout user successfully', () => {
        cy.get('[data-testid="user-menu"]').click();
        cy.get('[data-testid="logout-button"]').click();
        
        // Verify logout
        cy.get('[data-testid="login-link"]').should('be.visible');
        cy.contains('Logged out successfully').should('be.visible');
      });
    });

    describe('Admin Login', () => {
      beforeEach(() => {
        cy.createAdminUser('admin@test.com', 'admin123');
      });

      it('should login admin user', () => {
        cy.visit('http://localhost:3001'); // Admin panel URL
        
        cy.get('[data-testid="email-input"]').type('admin@test.com');
        cy.get('[data-testid="password-input"]').type('admin123');
        cy.get('[data-testid="login-button"]').click();
        
        // Verify admin dashboard access
        cy.url().should('include', '/admin/dashboard');
        cy.contains('Admin Dashboard').should('be.visible');
      });

      it('should reject non-admin user', () => {
        cy.registerUser('regular@test.com', 'password123');
        
        cy.visit('http://localhost:3001');
        
        cy.get('[data-testid="email-input"]').type('regular@test.com');
        cy.get('[data-testid="password-input"]').type('password123');
        cy.get('[data-testid="login-button"]').click();
        
        // Check error message
        cy.contains('Not authorized').should('be.visible');
      });
    });
  });

  // ========== PRODUCT BROWSING ==========
  describe('Product Browsing', () => {
    beforeEach(() => {
      cy.createTestProducts();
    });

    it('should display products on homepage', () => {
      cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
      cy.get('[data-testid="product-title"]').should('be.visible');
      cy.get('[data-testid="product-price"]').should('be.visible');
      cy.get('[data-testid="product-image"]').should('be.visible');
    });

    it('should navigate to product details', () => {
      cy.get('[data-testid="product-card"]').first().click();
      
      cy.url().should('include', '/product/');
      cy.get('[data-testid="product-details"]').should('be.visible');
      cy.get('[data-testid="add-to-cart-button"]').should('be.visible');
      cy.get('[data-testid="add-to-wishlist-button"]').should('be.visible');
    });

    it('should filter products by category', () => {
      cy.get('[data-testid="category-filter"]').select('Electronics');
      
      cy.get('[data-testid="product-card"]').should('be.visible');
      cy.get('[data-testid="product-category"]').should('contain', 'Electronics');
    });

    it('should sort products by price', () => {
      cy.get('[data-testid="sort-select"]').select('Price: Low to High');
      
      cy.get('[data-testid="product-price"]').then($prices => {
        const prices = Array.from($prices).map(el => parseFloat(el.textContent.replace('$', '')));
        expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
      });
    });

    it('should search products', () => {
      cy.get('[data-testid="search-input"]').type('smartphone');
      cy.get('[data-testid="search-button"]').click();
      
      cy.get('[data-testid="product-title"]').should('contain', 'smartphone');
    });
  });

  // ========== CART FUNCTIONALITY ==========
  describe('Cart Functionality', () => {
    beforeEach(() => {
      cy.loginUser('test@test.com', 'password123');
      cy.createTestProducts();
    });

    it('should add product to cart', () => {
      cy.get('[data-testid="product-card"]').first().click();
      
      // Add to cart from product details
      cy.get('[data-testid="quantity-input"]').clear().type('2');
      cy.get('[data-testid="add-to-cart-button"]').click();
      
      // Verify success message
      cy.contains('Product added to cart').should('be.visible');
      
      // Check cart icon shows quantity
      cy.get('[data-testid="cart-badge"]').should('contain', '2');
    });

    it('should view cart items', () => {
      // Add items to cart first
      cy.addProductToCart('product-1', 2);
      cy.addProductToCart('product-2', 1);
      
      // Navigate to cart
      cy.get('[data-testid="cart-link"]').click();
      
      // Verify cart contents
      cy.get('[data-testid="cart-item"]').should('have.length', 2);
      cy.get('[data-testid="total-price"]').should('be.visible');
    });

    it('should update cart item quantity', () => {
      cy.addProductToCart('product-1', 1);
      cy.get('[data-testid="cart-link"]').click();
      
      // Increase quantity
      cy.get('[data-testid="increase-quantity"]').click();
      
      // Verify quantity updated
      cy.get('[data-testid="item-quantity"]').should('contain', '2');
      
      // Verify total price updated
      cy.get('[data-testid="total-price"]').should('not.contain', '$0.00');
    });

    it('should remove item from cart', () => {
      cy.addProductToCart('product-1', 1);
      cy.get('[data-testid="cart-link"]').click();
      
      // Remove item
      cy.get('[data-testid="remove-item"]').click();
      
      // Verify item removed
      cy.contains('Your cart is empty').should('be.visible');
    });

    it('should show empty cart message', () => {
      cy.get('[data-testid="cart-link"]').click();
      
      cy.contains('Your cart is empty').should('be.visible');
      cy.get('[data-testid="continue-shopping"]').should('be.visible');
    });
  });

  // ========== WISHLIST FUNCTIONALITY ==========
  describe('Wishlist Functionality', () => {
    beforeEach(() => {
      cy.loginUser('test@test.com', 'password123');
      cy.createTestProducts();
    });

    it('should add product to wishlist', () => {
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="add-to-wishlist"]').click();
      });
      
      cy.contains('Added to wishlist').should('be.visible');
    });

    it('should view wishlist items', () => {
      // Add items to wishlist
      cy.addProductToWishlist('product-1');
      cy.addProductToWishlist('product-2');
      
      // Navigate to wishlist
      cy.get('[data-testid="wishlist-link"]').click();
      
      // Verify wishlist contents
      cy.get('[data-testid="wishlist-item"]').should('have.length', 2);
    });

    it('should remove item from wishlist', () => {
      cy.addProductToWishlist('product-1');
      cy.get('[data-testid="wishlist-link"]').click();
      
      // Remove item
      cy.get('[data-testid="remove-from-wishlist"]').click();
      
      // Verify item removed
      cy.contains('Your wishlist is empty').should('be.visible');
    });

    it('should move item from wishlist to cart', () => {
      cy.addProductToWishlist('product-1');
      cy.get('[data-testid="wishlist-link"]').click();
      
      // Move to cart
      cy.get('[data-testid="move-to-cart"]').click();
      
      // Verify moved to cart
      cy.contains('Moved to cart').should('be.visible');
      cy.get('[data-testid="cart-badge"]').should('contain', '1');
    });
  });

  // ========== ORDER FLOW ==========
  describe('Order Flow', () => {
    beforeEach(() => {
      cy.loginUser('test@test.com', 'password123');
      cy.createTestProducts();
      cy.addProductToCart('product-1', 2);
      cy.addProductToCart('product-2', 1);
    });

    it('should proceed to checkout', () => {
      cy.get('[data-testid="cart-link"]').click();
      cy.get('[data-testid="checkout-button"]').click();
      
      // Verify checkout page
      cy.url().should('include', '/checkout');
      cy.get('[data-testid="checkout-form"]').should('be.visible');
    });

    it('should complete order with COD', () => {
      cy.get('[data-testid="cart-link"]').click();
      cy.get('[data-testid="checkout-button"]').click();
      
      // Fill shipping information
      cy.fillShippingInfo();
      
      // Select payment method
      cy.get('[data-testid="cod-payment"]').click();
      
      // Place order
      cy.get('[data-testid="place-order"]').click();
      
      // Verify order success
      cy.contains('Order placed successfully').should('be.visible');
      cy.url().should('include', '/order-confirmation');
    });

    it('should view order history', () => {
      // Place an order first
      cy.placeOrder();
      
      // Navigate to order history
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="order-history"]').click();
      
      // Verify order appears
      cy.get('[data-testid="order-item"]').should('have.length.at.least', 1);
      cy.get('[data-testid="order-status"]').should('be.visible');
    });
  });

  // ========== ADMIN FUNCTIONALITY ==========
  describe('Admin Functionality', () => {
    beforeEach(() => {
      cy.loginAdmin('admin@test.com', 'admin123');
    });

    describe('Order Management', () => {
      it('should view all orders', () => {
        cy.visit('http://localhost:3001/admin/orders');
        
        cy.get('[data-testid="orders-table"]').should('be.visible');
        cy.get('[data-testid="order-row"]').should('have.length.at.least', 1);
      });

      it('should update order status', () => {
        cy.visit('http://localhost:3001/admin/orders');
        
        cy.get('[data-testid="order-row"]').first().within(() => {
          cy.get('[data-testid="status-select"]').select('Shipped');
          cy.get('[data-testid="update-status"]').click();
        });
        
        cy.contains('Status updated').should('be.visible');
      });

      it('should view order details', () => {
        cy.visit('http://localhost:3001/admin/orders');
        
        cy.get('[data-testid="view-order"]').first().click();
        
        cy.get('[data-testid="order-details"]').should('be.visible');
        cy.get('[data-testid="order-items"]').should('be.visible');
      });

      it('should delete order', () => {
        cy.visit('http://localhost:3001/admin/orders');
        
        cy.get('[data-testid="delete-order"]').first().click();
        cy.get('[data-testid="confirm-delete"]').click();
        
        cy.contains('Order deleted').should('be.visible');
      });
    });

    describe('User Management', () => {
      it('should view all users', () => {
        cy.visit('http://localhost:3001/admin/users');
        
        cy.get('[data-testid="users-table"]').should('be.visible');
        cy.get('[data-testid="user-row"]').should('have.length.at.least', 1);
      });

      it('should block user', () => {
        cy.visit('http://localhost:3001/admin/users');
        
        cy.get('[data-testid="user-row"]').first().within(() => {
          cy.get('[data-testid="block-user"]').click();
        });
        
        cy.contains('User blocked').should('be.visible');
      });

      it('should unblock user', () => {
        cy.visit('http://localhost:3001/admin/users');
        
        cy.get('[data-testid="user-row"]').first().within(() => {
          cy.get('[data-testid="unblock-user"]').click();
        });
        
        cy.contains('User unblocked').should('be.visible');
      });

      it('should delete user', () => {
        cy.visit('http://localhost:3001/admin/users');
        
        cy.get('[data-testid="user-row"]').first().within(() => {
          cy.get('[data-testid="delete-user"]').click();
        });
        cy.get('[data-testid="confirm-delete"]').click();
        
        cy.contains('User deleted').should('be.visible');
      });
    });

    describe('Dashboard', () => {
      it('should display dashboard statistics', () => {
        cy.visit('http://localhost:3001/admin/dashboard');
        
        cy.get('[data-testid="total-users"]').should('be.visible');
        cy.get('[data-testid="total-orders"]').should('be.visible');
        cy.get('[data-testid="total-revenue"]').should('be.visible');
        cy.get('[data-testid="pending-orders"]').should('be.visible');
      });

      it('should show recent orders', () => {
        cy.visit('http://localhost:3001/admin/dashboard');
        
        cy.get('[data-testid="recent-orders"]').should('be.visible');
        cy.get('[data-testid="recent-order-item"]').should('have.length.at.least', 1);
      });
    });
  });

  // ========== RESPONSIVE DESIGN ==========
  describe('Responsive Design', () => {
    it('should work on mobile devices', () => {
      cy.viewport('iphone-x');
      
      // Test navigation menu
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
      
      // Test product cards
      cy.get('[data-testid="product-card"]').should('be.visible');
    });

    it('should work on tablets', () => {
      cy.viewport('ipad-2');
      
      // Test tablet layout
      cy.get('[data-testid="product-grid"]').should('be.visible');
      cy.get('[data-testid="sidebar"]').should('be.visible');
    });

    it('should work on desktop', () => {
      cy.viewport(1920, 1080);
      
      // Test desktop layout
      cy.get('[data-testid="header"]').should('be.visible');
      cy.get('[data-testid="main-navigation"]').should('be.visible');
    });
  });

  // ========== PERFORMANCE TESTS ==========
  describe('Performance', () => {
    it('should load homepage within 3 seconds', () => {
      cy.visit('/', { timeout: 3000 });
      cy.get('[data-testid="homepage"]').should('be.visible');
    });

    it('should load product listing efficiently', () => {
      const start = Date.now();
      cy.visit('/products');
      cy.get('[data-testid="product-card"]').should('be.visible');
      
      cy.then(() => {
        const loadTime = Date.now() - start;
        expect(loadTime).to.be.lessThan(2000);
      });
    });
  });

  // ========== ERROR HANDLING ==========
  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Simulate offline
      cy.visit('/', {
        onBeforeLoad: (win) => {
          cy.stub(win, 'fetch').rejects(new Error('Network error'));
        }
      });
      
      cy.contains('Connection error').should('be.visible');
    });

    it('should show 404 page for invalid routes', () => {
      cy.visit('/invalid-route', { failOnStatusCode: false });
      
      cy.contains('Page not found').should('be.visible');
      cy.get('[data-testid="home-link"]').should('be.visible');
    });
  });

  // ========== ACCESSIBILITY ==========
  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.visit('/');
      
      // Tab through navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'home-link');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-testid', 'products-link');
    });

    it('should have proper ARIA labels', () => {
      cy.visit('/');
      
      cy.get('[data-testid="main-navigation"]').should('have.attr', 'aria-label', 'Main navigation');
      cy.get('[data-testid="search-input"]').should('have.attr', 'aria-label', 'Search products');
    });

    it('should work with screen readers', () => {
      cy.visit('/');
      
      // Check for semantic HTML
      cy.get('main').should('exist');
      cy.get('nav').should('exist');
      cy.get('h1').should('exist');
    });
  });
});
