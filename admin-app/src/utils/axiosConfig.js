const getTokenFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).token : null;
};

export const config = {
  headers: {
    Authorization: `Bearer ${getTokenFromLocalStorage() || ""}`,
    Accept: "application/json",
  },
};

// Alternative: Create a function that returns fresh config
export const getConfig = () => {
  const token = getTokenFromLocalStorage();
  return {
    headers: {
      Authorization: `Bearer ${token || ""}`,
      Accept: "application/json",
    },
  };
};
