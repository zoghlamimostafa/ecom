import { Navigate } from "react-router-dom";

export const OpenRoutes = ({ children }) => {
    // Récupérer le token d'authentification depuis le stockage local
    const getTokenFromLocalStorage = JSON.parse(localStorage.getItem("customer"))

    // Si le token est présent, afficher les routes protégées, sinon rediriger vers la page de connexion
    return getTokenFromLocalStorage ?.token===undefined ? children : <Navigate to="/" replace />;
}
