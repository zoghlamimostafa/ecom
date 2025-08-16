import { Navigate } from "react-router-dom";

export const OpenRoutes = ({ children }) => {
    // Récupérer le token d'authentification depuis le stockage local
    const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("user"))

    // Si le token est présent, rediriger vers l'admin, sinon afficher les routes ouvertes
    return getTokenFromLocalStorage?.token === undefined ? children : <Navigate to="/admin" replace />;
}
