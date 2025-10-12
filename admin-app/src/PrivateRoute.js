import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  // Votre logique d'authentification ici

  // Exemple de redirection si l'utilisateur n'est pas authentifié
  const isAuthenticated = true; // Mettez votre logique d'authentification ici
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Sinon, affichez le composant demandé
  return <Element {...rest} />;
};

export default PrivateRoute;
