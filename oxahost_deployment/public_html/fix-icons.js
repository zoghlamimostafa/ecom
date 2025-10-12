// Script pour corriger les icônes FontAwesome cassées
(function() {
    // Attendre que le DOM soit chargé
    function fixBrokenIcons() {
        const iconElements = document.querySelectorAll('.category-icon-circle i[data-fallback]');
        
        iconElements.forEach(icon => {
            // Vérifier si l'icône FontAwesome s'affiche correctement
            const computedStyle = window.getComputedStyle(icon, ':before');
            const content = computedStyle.getPropertyValue('content');
            
            // Si l'icône ne s'affiche pas (contenu vide ou quotes seulement)
            if (!content || content === '""' || content === "''" || content === 'none') {
                // Remplacer par l'emoji
                const fallbackEmoji = icon.getAttribute('data-fallback');
                if (fallbackEmoji) {
                    icon.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                    icon.innerHTML = fallbackEmoji;
                    icon.style.fontSize = '1.5rem';
                }
            }
        });
    }
    
    // Exécuter après le chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixBrokenIcons);
    } else {
        fixBrokenIcons();
    }
    
    // Exécuter aussi après un délai pour s'assurer que FontAwesome a eu le temps de se charger
    setTimeout(fixBrokenIcons, 1000);
    setTimeout(fixBrokenIcons, 3000);
})();