// Fonction pour récupérer la configuration d'authentification dynamique
export const getAuthConfig = () => {
  const customer = localStorage.getItem("customer");
  const token = customer ? JSON.parse(customer).token : "";
  
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
};

// Configuration statique (pour compatibilité, mais préférer getAuthConfig())
export const config = {
  headers: {
    Accept: "application/json",
  },
};