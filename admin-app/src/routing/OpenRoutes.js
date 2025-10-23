import { Navigate } from "react-router-dom";

const OpenRoutes = ({ children }) => {
    // Récupérer le token d'authentification depuis le stockage local
    try {
        const userString = localStorage.getItem("user");
        const getTokenFromLocalStorage = userString ? JSON.parse(userString) : null;
        
        // Si le token est présent, rediriger vers l'admin, sinon afficher les routes ouvertes
        return getTokenFromLocalStorage?.token === undefined ? children : <Navigate to="/admin" replace />;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
        return children;
    }
}

export default OpenRoutes;
