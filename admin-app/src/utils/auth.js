// Utility functions for token validation and authentication
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        return false; // Token has expired
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("user");
};

export const isUserAuthenticated = () => {
  const user = getUserFromStorage();
  if (!user || !user.token) return false;
  
  const tokenValid = isTokenValid(user.token);
  
  // If token is invalid or expired, clear auth data
  if (!tokenValid) {
    clearAuthData();
    return false;
  }
  
  return true;
};
