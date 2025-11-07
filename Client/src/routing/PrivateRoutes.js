import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoutes = ({ children }) => {
    const location = useLocation();
    const getTokenFromLocalStorage = JSON.parse(sessionStorage.getItem("customer"));
    const token = getTokenFromLocalStorage?.token;
    const isAuthenticated = typeof token === 'string' && token.length > 10;
    
    return isAuthenticated ? children : (
        <Navigate to="/login" replace={true} state={{ from: location }} />
    );
}
