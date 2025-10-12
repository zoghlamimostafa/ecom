import React from 'react';

const WishlistTestComponent = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
            <h2>Test Wishlist - Pas de Strikethrough</h2>
            
            {/* Test 1: Style inline pur */}
            <div style={{ 
                border: '1px solid #dee2e6', 
                padding: '15px', 
                margin: '10px 0',
                backgroundColor: 'white',
                borderRadius: '8px'
            }}>
                <h5 style={{ 
                    textDecoration: 'none',
                    color: '#333',
                    fontWeight: '600',
                    margin: 0
                }}>
                    Test Produit 1 - Style Inline Pur
                </h5>
                <h6 style={{
                    textDecoration: 'none',
                    color: '#28a745',
                    fontWeight: 'bold',
                    margin: '5px 0 0 0'
                }}>
                    99.99 TND
                </h6>
            </div>

            {/* Test 2: Classes CSS comme wishlist actuelle */}
            <div className="wishlist-wrapper">
                <div className="wishlist-card">
                    <div className="py-3 px-3">
                        <h5 
                            className="title wishlist-product-title" 
                            style={{
                                textDecoration: 'none', 
                                textDecorationLine: 'none',
                                WebkitTextDecoration: 'none',
                                MozTextDecoration: 'none',
                                color: '#333',
                                fontWeight: '600'
                            }}
                        >
                            Test Produit 2 - Classes CSS Wishlist
                        </h5>
                        <h6 
                            className="price wishlist-product-price" 
                            style={{
                                textDecoration: 'none', 
                                textDecorationLine: 'none',
                                WebkitTextDecoration: 'none',
                                MozTextDecoration: 'none',
                                color: '#28a745', 
                                fontWeight: 'bold'
                            }}
                        >
                            149.99 TND
                        </h6>
                    </div>
                </div>
            </div>

            {/* Test 3: Bootstrap classes */}
            <div className="card" style={{ margin: '10px 0' }}>
                <div className="card-body">
                    <h5 className="card-title" style={{ textDecoration: 'none', color: '#333' }}>
                        Test Produit 3 - Bootstrap Card
                    </h5>
                    <h6 className="card-subtitle text-success" style={{ textDecoration: 'none' }}>
                        199.99 TND
                    </h6>
                </div>
            </div>

            <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                Si l'un de ces éléments apparaît barré, cela nous aidera à identifier la source du problème.
            </p>
        </div>
    );
};

export default WishlistTestComponent;