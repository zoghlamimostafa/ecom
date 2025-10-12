import React from 'react';

// Composant spécialisé pour les titres de produits wishlist - SANS CLASSES CSS
const CleanProductTitle = ({ title, price }) => {
    return (
        <div style={{ padding: '15px 20px', textDecoration: 'none', backgroundColor: 'white' }}>
            {/* Titre du produit - DIV pur sans classes */}
            <div 
                data-testid="product-title"
                style={{
                    fontFamily: 'Poppins, Arial, sans-serif',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '10px',
                    lineHeight: '1.4',
                    textDecoration: 'none',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '40px'
                }}
                title={title}
            >
                {title}
            </div>

            {/* Prix du produit - DIV pur sans classes */}
            <div 
                data-testid="product-price"
                style={{
                    fontFamily: 'Poppins, Arial, sans-serif',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#e74c3c',
                    lineHeight: '1.4',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '12px'
                }}
            >
                {price} TND
            </div>
        </div>
    );
};

export default CleanProductTitle;