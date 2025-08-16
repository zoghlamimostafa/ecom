import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthChecker = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAuthentication = () => {
            try {
                const userToken = JSON.parse(localStorage.getItem("user"));
                const isLoggedIn = userToken?.token !== undefined;
                const isOnPublicPage = ["/", "/login", "/forgot-password", "/reset-password", "/create-admin"].includes(location.pathname);

                // If user has valid token and is on a public page, redirect to admin
                if (isLoggedIn && isOnPublicPage) {
                    navigate("/admin", { replace: true });
                }
                // If user doesn't have token and is not on a public page, redirect to login
                else if (!isLoggedIn && !isOnPublicPage) {
                    navigate("/", { replace: true });
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                // If there's an error parsing localStorage, clear it and redirect to login
                localStorage.removeItem("user");
                navigate("/", { replace: true });
            }
        };

        // Check authentication on mount and when location changes
        checkAuthentication();
    }, [navigate, location.pathname]);

    return children;
};

export default AuthChecker;
