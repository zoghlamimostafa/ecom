import { Navigate } from "react-router-dom";

export const OpenRoutes = ({ children }) => {
    const getTokenFromLocalStorage = JSON.parse(sessionStorage.getItem("customer"));
    const token = getTokenFromLocalStorage?.token;
    const isAuthenticated = typeof token === 'string' && token.length > 10;
    return !isAuthenticated ? children : <Navigate to="/" replace />;
}
