import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
    try {
        const userString = localStorage.getItem("user");
        const getTokenFromLocalStorage = userString ? JSON.parse(userString) : null;
        console.log(getTokenFromLocalStorage?.token);
        return getTokenFromLocalStorage?.token !== undefined ? children : (<Navigate to="/" replace={true} />);
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
        return <Navigate to="/" replace={true} />;
    }
}

export default PrivateRoutes;
