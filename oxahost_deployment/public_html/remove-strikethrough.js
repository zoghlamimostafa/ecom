// Script pour supprimer TOUTES les barres de la wishlist de manière agressive
(function() {
    'use strict';
    
    function removeAllStrikethrough() {
        console.log('🔧 Suppression forcée des barres wishlist...');
        
        // Sélectionner TOUS les éléments de la wishlist
        const wishlistElements = document.querySelectorAll(
            '.wishlist-wrapper *, ' +
            '.wishlist-wrapper h5, ' + 
            '.wishlist-wrapper h6, ' +
            '.wishlist-product-title, ' +
            '.wishlist-product-price, ' +
            '.title, ' +
            '.price'
        );
        
        console.log(`Trouvé ${wishlistElements.length} éléments à corriger`);
        
        wishlistElements.forEach((element, index) => {
            // Suppression par style inline (le plus puissant)
            element.style.textDecoration = 'none';
            element.style.textDecorationLine = 'none';
            element.style.textDecorationStyle = 'none';
            element.style.textDecorationColor = 'transparent';
            element.style.textDecorationThickness = '0px';
            element.style.borderBottom = 'none';
            element.style.borderTop = 'none';
            element.style.backgroundImage = 'none';
            
            // Utiliser setProperty avec !important
            element.style.setProperty('text-decoration', 'none', 'important');
            element.style.setProperty('text-decoration-line', 'none', 'important');
            element.style.setProperty('text-decoration-style', 'none', 'important');
            element.style.setProperty('text-decoration-color', 'transparent', 'important');
            element.style.setProperty('border-bottom', 'none', 'important');
            element.style.setProperty('border-top', 'none', 'important');
            
            // Supprimer les classes problématiques
            const problematicClasses = [
                'strikethrough', 'line-through', 'text-line-through', 
                'crossed-out', 'strike', 'old-price', 'discontinued'
            ];
            
            problematicClasses.forEach(className => {
                element.classList.remove(className);
            });
            
            // Vérifier si l'élément a encore du strikethrough
            const computedStyle = window.getComputedStyle(element);
            const textDecoration = computedStyle.textDecoration;
            const textDecorationLine = computedStyle.textDecorationLine;
            
            if (textDecoration.includes('line-through') || textDecorationLine.includes('line-through')) {
                console.warn(`⚠️ PERSISTANT: Élément ${index + 1} a encore du strikethrough: ${textDecoration}`);
                
                // Solution extrême : recreer l'élément
                const parent = element.parentNode;
                const newElement = element.cloneNode(true);
                newElement.style.cssText = 'text-decoration: none !important; color: inherit;';
                parent.replaceChild(newElement, element);
                console.log(`✅ Élément ${index + 1} recréé sans strikethrough`);
            }
        });
        
        console.log('✅ Suppression des barres terminée');
    }
    
    // Exécuter immédiatement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAllStrikethrough);
    } else {
        removeAllStrikethrough();
    }
    
    // Exécuter aussi après un délai pour s'assurer que React a fini de rendre
    setTimeout(removeAllStrikethrough, 1000);
    setTimeout(removeAllStrikethrough, 2000);
    setTimeout(removeAllStrikethrough, 3000);
    
    // Observer les changements DOM pour réappliquer si nécessaire
    const observer = new MutationObserver(() => {
        if (window.location.pathname.includes('wishlist')) {
            setTimeout(removeAllStrikethrough, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('🔧 Script anti-strikethrough chargé et actif');
})();