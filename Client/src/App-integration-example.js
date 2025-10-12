import React from 'react';

// Import du nouveau composant (styles maintenant dans App.css)
import SingleProductModern from './pages/SingleProduct-Modern';

// Import de l'ancien composant pour comparaison
import SingleProduct from './pages/SingleProduct';

const App = () => {
  // Vous pouvez utiliser une variable d'environnement ou un state pour basculer entre les versions
  const useModernDesign = true; // Changez à false pour utiliser l'ancien design

  return (
    <div className="App">
      {/* ... autres composants de votre App ... */}
      
      {/* Route pour la page produit */}
      <Routes>
        {/* ... autres routes ... */}
        <Route 
          path="/product/:slug" 
          element={useModernDesign ? <SingleProductModern /> : <SingleProduct />} 
        />
        {/* ... autres routes ... */}
      </Routes>
      
      {/* ... autres composants de votre App ... */}
    </div>
  );
};

export default App;