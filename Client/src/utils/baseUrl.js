// Dynamically determine the backend URL based on the current host
const getBaseUrl = () => {
  // If running on external IP, use that same IP for backend
  const hostname = window.location.hostname;
  
  // If accessing via external IP, use the same IP for backend
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:4000/api/`;
  }
  
  // Default to localhost for local development
  return "http://localhost:4000/api/";
};

export const base_url = getBaseUrl();

const getTokenFromLocalStorage = localStorage.getItem("customer")
  ? JSON.parse(localStorage.getItem("customer"))
  : null;

export const config = {
  headers: {
    Authorization: `Bearer ${
      getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
    }`,
    Accept: "application/json",
  },
};