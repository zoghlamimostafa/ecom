// Cypress Custom Commands for E-commerce Sanny

// ========== AUTHENTICATION COMMANDS ==========

/**
 * Register a new user
 */
Cypress.Commands.add('registerUser', (email, password, userData = {}) => {
  const defaultUserData = {
    firstname: 'Test',
    lastname: 'User',
    mobile: '+1234567890',
    ...userData
  };

  cy.request({
    method: 'POST',
    url: 'http://localhost:4000/api/user/register',
    body: {
      ...defaultUserData,
      email,
      password
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200) {
      cy.log(`User registered successfully: ${email}`);
    }
  });
});

/**
 * Login user via API and set token
 */
Cypress.Commands.add('loginUser', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:4000/api/user/login',
    body: {
      email,
      password
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    
    // Store user data in localStorage
    window.localStorage.setItem('customer', JSON.stringify(response.body));
    
    // Set authorization header for subsequent requests
    cy.window().then((win) => {
      win.localStorage.setItem('token', response.body.token);
    });
    
    cy.log(`User logged in successfully: ${email}`);
  });
});

/**
 * Create admin user
 */
Cypress.Commands.add('createAdminUser', (email, password, userData = {}) => {
  const defaultAdminData = {
    firstname: 'Admin',
    lastname: 'User',
    mobile: '+1234567890',
    role: 'admin',
    ...userData
  };

  cy.request({
    method: 'POST',
    url: 'http://localhost:4000/api/user/create-admin',
    body: {
      ...defaultAdminData,
      email,
      password
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200) {
      cy.log(`Admin user created successfully: ${email}`);
    }
  });
});

/**
 * Login admin user
 */
Cypress.Commands.add('loginAdmin', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:4000/api/user/admin-login',
    body: {
      email,
      password
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    expect(response.body.role).to.eq('admin');
    
    // Store admin data in localStorage
    window.localStorage.setItem('user', JSON.stringify(response.body));
    
    cy.log(`Admin logged in successfully: ${email}`);
  });
});

// ========== FORM FILLING COMMANDS ==========

/**
 * Fill registration form
 */
Cypress.Commands.add('fillRegistrationForm', (firstname, lastname, email, mobile, password) => {
  cy.get('[data-testid="firstname-input"]').type(firstname);
  cy.get('[data-testid="lastname-input"]').type(lastname);
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="mobile-input"]').type(mobile);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="confirm-password-input"]').type(password);
});

/**
 * Fill shipping information
 */
Cypress.Commands.add('fillShippingInfo', () => {
  cy.get('[data-testid="address-input"]').type('123 Test Street');
  cy.get('[data-testid="city-input"]').type('Test City');
  cy.get('[data-testid="postal-code-input"]').type('12345');
  cy.get('[data-testid="country-select"]').select('United States');
});

// ========== PRODUCT COMMANDS ==========

/**
 * Create test products
 */
Cypress.Commands.add('createTestProducts', () => {
  const products = [
    {
      title: 'Test Smartphone',
      description: 'A great test smartphone',
      price: 299.99,
      category: 'Electronics',
      brand: 'TestBrand',
      quantity: 50,
      images: ['smartphone.jpg'],
      slug: 'test-smartphone'
    },
    {
      title: 'Test Laptop',
      description: 'A powerful test laptop',
      price: 899.99,
      category: 'Electronics',
      brand: 'TestBrand',
      quantity: 25,
      images: ['laptop.jpg'],
      slug: 'test-laptop'
    },
    {
      title: 'Test Headphones',
      description: 'Quality test headphones',
      price: 79.99,
      category: 'Electronics',
      brand: 'TestBrand',
      quantity: 100,
      images: ['headphones.jpg'],
      slug: 'test-headphones'
    }
  ];

  // First, create an admin user and login
  cy.createAdminUser('admin@test.com', 'admin123');
  
  cy.request({
    method: 'POST',
    url: 'http://localhost:4000/api/user/admin-login',
    body: {
      email: 'admin@test.com',
      password: 'admin123'
    }
  }).then((response) => {
    const token = response.body.token;
    
    products.forEach((product, index) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:4000/api/product',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: product,
        failOnStatusCode: false
      }).then((productResponse) => {
        if (productResponse.status === 200) {
          cy.log(`Product created: ${product.title}`);
          // Store product ID for later use
          cy.wrap(productResponse.body._id).as(`product-${index + 1}-id`);
        }
      });
    });
  });
});

/**
 * Add product to cart via API
 */
Cypress.Commands.add('addProductToCart', (productId, quantity = 1) => {
  cy.window().then((win) => {
    const customer = JSON.parse(win.localStorage.getItem('customer') || '{}');
    const token = customer.token;
    
    if (!token) {
      throw new Error('User must be logged in to add products to cart');
    }

    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/api/user/cart',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        productId,
        quantity,
        price: 99.99 // Default price for testing
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(`Product added to cart: ${productId}, quantity: ${quantity}`);
    });
  });
});

/**
 * Add product to wishlist via API
 */
Cypress.Commands.add('addProductToWishlist', (productId) => {
  cy.window().then((win) => {
    const customer = JSON.parse(win.localStorage.getItem('customer') || '{}');
    const token = customer.token;
    
    if (!token) {
      throw new Error('User must be logged in to add products to wishlist');
    }

    cy.request({
      method: 'PUT',
      url: 'http://localhost:4000/api/product/wishlist',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        prodId: productId
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(`Product added to wishlist: ${productId}`);
    });
  });
});

// ========== ORDER COMMANDS ==========

/**
 * Place an order
 */
Cypress.Commands.add('placeOrder', () => {
  cy.window().then((win) => {
    const customer = JSON.parse(win.localStorage.getItem('customer') || '{}');
    const token = customer.token;
    
    if (!token) {
      throw new Error('User must be logged in to place an order');
    }

    cy.request({
      method: 'POST',
      url: 'http://localhost:4000/api/user/cart/create-order',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        COD: true,
        couponApplied: false
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      cy.log('Order placed successfully');
      cy.wrap(response.body.data._id).as('orderId');
    });
  });
});

// ========== DATABASE COMMANDS ==========

/**
 * Clear database collections
 */
Cypress.Commands.add('clearDatabase', () => {
  cy.task('clearDatabase');
});

/**
 * Seed database with test data
 */
Cypress.Commands.add('seedDatabase', () => {
  cy.task('seedDatabase');
});

// ========== UTILITY COMMANDS ==========

/**
 * Wait for loading to finish
 */
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loading-spinner"]').should('not.exist');
});

/**
 * Check if user is authenticated
 */
Cypress.Commands.add('checkAuthenticated', () => {
  cy.window().then((win) => {
    const customer = win.localStorage.getItem('customer');
    expect(customer).to.not.be.null;
    const parsedCustomer = JSON.parse(customer);
    expect(parsedCustomer).to.have.property('token');
  });
});

/**
 * Custom assertion for toast messages
 */
Cypress.Commands.add('shouldShowToast', (message, type = 'success') => {
  cy.get(`[data-testid="toast-${type}"]`).should('be.visible');
  cy.get(`[data-testid="toast-${type}"]`).should('contain', message);
});

/**
 * Take screenshot for failed tests
 */
Cypress.Commands.add('takeScreenshotOnFailure', () => {
  cy.screenshot('failure', { overwrite: true });
});

/**
 * Mock API responses
 */
Cypress.Commands.add('mockApiResponse', (method, url, response, statusCode = 200) => {
  cy.intercept(method, url, {
    statusCode,
    body: response
  });
});

/**
 * Test responsive design
 */
Cypress.Commands.add('testResponsive', (callback) => {
  const viewports = [
    { width: 375, height: 667, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1920, height: 1080, name: 'desktop' }
  ];

  viewports.forEach(viewport => {
    cy.viewport(viewport.width, viewport.height);
    cy.log(`Testing on ${viewport.name}: ${viewport.width}x${viewport.height}`);
    callback(viewport);
  });
});

/**
 * Test accessibility
 */
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y(null, null, (violations) => {
    violations.forEach(violation => {
      cy.log(`A11y violation: ${violation.description}`);
    });
  });
});

/**
 * Simulate slow network
 */
Cypress.Commands.add('simulateSlowNetwork', () => {
  cy.intercept('**', (req) => {
    req.reply((res) => {
      // Add 2 second delay to simulate slow network
      return new Promise(resolve => {
        setTimeout(() => resolve(res), 2000);
      });
    });
  });
});

// ========== KEYBOARD COMMANDS ==========

/**
 * Tab to next element
 */
Cypress.Commands.add('tab', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).trigger('keydown', { key: 'Tab' });
});

/**
 * Press Enter key
 */
Cypress.Commands.add('pressEnter', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).trigger('keydown', { key: 'Enter' });
});

/**
 * Press Escape key
 */
Cypress.Commands.add('pressEscape', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).trigger('keydown', { key: 'Escape' });
});

// ========== CART SPECIFIC COMMANDS ==========

/**
 * Get cart item count
 */
Cypress.Commands.add('getCartCount', () => {
  return cy.get('[data-testid="cart-badge"]').invoke('text').then(text => {
    return parseInt(text) || 0;
  });
});

/**
 * Clear cart
 */
Cypress.Commands.add('clearCart', () => {
  cy.window().then((win) => {
    const customer = JSON.parse(win.localStorage.getItem('customer') || '{}');
    const token = customer.token;
    
    if (token) {
      cy.request({
        method: 'DELETE',
        url: 'http://localhost:4000/api/user/empty-cart',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        failOnStatusCode: false
      });
    }
  });
});

// ========== ERROR HANDLING COMMANDS ==========

/**
 * Handle uncaught exceptions
 */
Cypress.Commands.add('handleUncaughtException', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Return false to prevent the test from failing
    return false;
  });
});

/**
 * Retry command with exponential backoff
 */
Cypress.Commands.add('retryRequest', (requestFn, maxRetries = 3) => {
  const attempt = (retryCount = 0) => {
    return requestFn().catch(error => {
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        cy.wait(delay);
        return attempt(retryCount + 1);
      }
      throw error;
    });
  };
  
  return attempt();
});

// ========== PERFORMANCE COMMANDS ==========

/**
 * Measure page load time
 */
Cypress.Commands.add('measurePageLoad', (url) => {
  const start = Date.now();
  cy.visit(url);
  cy.window().then(() => {
    const loadTime = Date.now() - start;
    cy.log(`Page load time: ${loadTime}ms`);
    cy.wrap(loadTime).as('pageLoadTime');
  });
});

/**
 * Check for memory leaks
 */
Cypress.Commands.add('checkMemoryUsage', () => {
  cy.window().then((win) => {
    if (win.performance && win.performance.memory) {
      const memory = win.performance.memory;
      cy.log(`Memory usage - Used: ${memory.usedJSHeapSize}, Total: ${memory.totalJSHeapSize}, Limit: ${memory.jsHeapSizeLimit}`);
      
      // Check if memory usage is reasonable (less than 50% of limit)
      const memoryUsagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      expect(memoryUsagePercentage).to.be.lessThan(50);
    }
  });
});

// ========== SECURITY COMMANDS ==========

/**
 * Check for XSS vulnerabilities
 */
Cypress.Commands.add('checkXSSProtection', (inputSelector, maliciousScript = '<script>alert("XSS")</script>') => {
  cy.get(inputSelector).type(maliciousScript);
  cy.get(inputSelector).should('not.contain.html', '<script>');
});

/**
 * Check CSRF protection
 */
Cypress.Commands.add('checkCSRFProtection', (formSelector) => {
  cy.get(formSelector).should('have.attr', 'data-csrf-token');
});

// Type definitions for TypeScript support
declare global {
  namespace Cypress {
    interface Chainable {
      registerUser(email: string, password: string, userData?: object): Chainable<Element>;
      loginUser(email: string, password: string): Chainable<Element>;
      createAdminUser(email: string, password: string, userData?: object): Chainable<Element>;
      loginAdmin(email: string, password: string): Chainable<Element>;
      fillRegistrationForm(firstname: string, lastname: string, email: string, mobile: string, password: string): Chainable<Element>;
      fillShippingInfo(): Chainable<Element>;
      createTestProducts(): Chainable<Element>;
      addProductToCart(productId: string, quantity?: number): Chainable<Element>;
      addProductToWishlist(productId: string): Chainable<Element>;
      placeOrder(): Chainable<Element>;
      clearDatabase(): Chainable<Element>;
      seedDatabase(): Chainable<Element>;
      waitForLoading(): Chainable<Element>;
      checkAuthenticated(): Chainable<Element>;
      shouldShowToast(message: string, type?: string): Chainable<Element>;
      takeScreenshotOnFailure(): Chainable<Element>;
      mockApiResponse(method: string, url: string, response: any, statusCode?: number): Chainable<Element>;
      testResponsive(callback: (viewport: any) => void): Chainable<Element>;
      checkA11y(): Chainable<Element>;
      simulateSlowNetwork(): Chainable<Element>;
      tab(): Chainable<Element>;
      pressEnter(): Chainable<Element>;
      pressEscape(): Chainable<Element>;
      getCartCount(): Chainable<number>;
      clearCart(): Chainable<Element>;
      handleUncaughtException(): Chainable<Element>;
      retryRequest(requestFn: () => any, maxRetries?: number): Chainable<Element>;
      measurePageLoad(url: string): Chainable<Element>;
      checkMemoryUsage(): Chainable<Element>;
      checkXSSProtection(inputSelector: string, maliciousScript?: string): Chainable<Element>;
      checkCSRFProtection(formSelector: string): Chainable<Element>;
    }
  }
}
