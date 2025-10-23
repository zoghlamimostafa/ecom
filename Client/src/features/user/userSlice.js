import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import userService from './userService';

export const setAuthError = createAction("auth/setAuthError");

// Action asynchrone pour l'enregistrement de l'utilisateur
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
  const response = await userService.register(userData);
  return response;
    } catch (error) {
  // ...existing code...
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// Action asynchrone pour enregistrer l'adresse de l'utilisateur
export const saveUserAddress = createAsyncThunk(
  "user/address/save",
  async (addressData, thunkAPI) => {
    try {
      // Enregistrer l'adresse via le service
      const response = await userService.saveAddress(addressData);
  // ...existing code...
      return response;
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Échec de l'enregistrement de l'adresse";
      if (error.response && error.response.status === 401) {
        thunkAPI.dispatch(setAuthError("Non autorisé : jeton expiré ou invalide"));
      }
  // ...existing code...
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Action asynchrone pour la connexion de l'utilisateur
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await userService.login(userData);
  // ...existing code...
      return response;
    } catch (error) {
  // ...existing code...
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Action asynchrone pour récupérer la liste de souhaits de l'utilisateur
export const getUserProductWishlist = createAsyncThunk(
  "user/wishlist",
  async (thunkAPI) => {
    try {
      return await userService.getUserWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Action asynchrone pour ajouter/supprimer un produit de la liste de souhaits
export const toggleProductWishlist = createAsyncThunk(
  "user/wishlist/toggle",
  async (prodId, thunkAPI) => {
    try {
      const response = await userService.toggleWishlist(prodId);
      // Après la modification, récupérer la liste mise à jour
      const updatedWishlist = await userService.getUserWishlist();
      return updatedWishlist;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Échec de la modification de la wishlist");
    }
  }
);

// Action asynchrone pour ajouter un produit au panier de l'utilisateur
export const addProdToCart = createAsyncThunk(
  "user/cart/add",
  async (cartData, thunkAPI) => {
    try {
      // Assurez-vous que le prix est un nombre décimal
      const price = parseFloat(cartData.price);
      
      // Vérifiez si le prix est valide
      if (isNaN(price) || price <= 0) {
        throw new Error("Invalid price format");
      }

      // Ajoutez le produit au panier
      const response = await userService.addToCart(cartData);
      toast.success("Produit ajouté au panier avec succès");
      return response.data;
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : "Échec d'ajout du produit au panier";
      if (error.response && error.response.status === 401) {
        thunkAPI.dispatch(setAuthError("Non autorisé : jeton expiré ou invalide"));
      }
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Action asynchrone pour récupérer le panier de l'utilisateur
export const getUserCart = createAsyncThunk(
  "user/cart/get",
  async (thunkAPI) => {
    try {
      return await userService.getCart();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getOrders = createAsyncThunk(
  "user/order/get",
  async (_, thunkAPI) => {
    try {
      const orders = await userService.getOrders();
      toast.success("Orders retrieved successfully");
      return orders;
    } catch (error) {
      toast.error("Failed to retrieve orders: " + error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// Action asynchrone pour supprimer un produit du panier de l'utilisateur
export const deleteCartProduct = createAsyncThunk(
  "user/cart/product/delete",
  async (id, thunkAPI) => {
    try {
      const response = await userService.removeProductFromCart(id);
      return response; 
    } catch (error) {
      let errorMessage = "Échec de suppression du produit du panier";
      if (error.response && error.response.status === 401) {
        errorMessage = "Non autorisé : jeton expiré ou invalide";
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Action asynchrone pour mettre à jour un produit dans le panier de l'utilisateur
export const updateCartProduct = createAsyncThunk(
  "user/cart/product/update",
  async (cartDetail, thunkAPI) => {
    try {
      const response = await userService.updateProductFromCart(cartDetail);
      return response; 
    } catch (error) {
      let errorMessage = "Échec de la mise à jour du produit dans le panier";
      if (error.response && error.response.status === 401) {
        errorMessage = "Non autorisé : jeton expiré ou invalide";
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const createOrder = createAsyncThunk(
  "user/order/create",
  async (orderData, thunkAPI) => {
    try {
      const response = await userService.createOrder(orderData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to create order");
    }
  }
);

// Action asynchrone pour mettre à jour le profil de l'utilisateur
export const updateProfile = createAsyncThunk(
  'user/profile/update',
  async (data, thunkAPI) => {
    try {
      const response = await userService.updateUser(data); // Assurez-vous que la méthode updateUser est définie dans votre service
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Erreur lors de la mise à jour du profil');
    }
  }
);

// Action asynchrone pour demander une réinitialisation de mot de passe
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const response = await userService.forgotPassword(email);
      toast.success(response.message || "Demande de réinitialisation du mot de passe envoyée avec succès");
      return response;
    } catch (error) {
      toast.error(error.message || "Échec de la demande de réinitialisation du mot de passe");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Action asynchrone pour réinitialiser le mot de passe
export const resetPassword = createAsyncThunk(
  "auth/password/reset",
  async (data, thunkAPI) => {
    try {
      const response = await userService.resetPassword(data);
      toast.success(response.message || "Réinitialisation du mot de passe réussie");
      return response;
    } catch (error) {
      toast.error(error.message || "Échec de la réinitialisation du mot de passe");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const result = await userService.logout(); 
      
      // Clear all storage - service already does this but ensure it's done
      localStorage.clear();
      sessionStorage.clear();
      
      return result; 
    } catch (error) {
      // Even if there's an error, clear all storage to ensure complete logout
      localStorage.clear();
      sessionStorage.clear();
      console.warn("Logout completed with warnings:", error.message);
      return { success: true, message: "Déconnexion forcée" };
    }
  }
);

// État initial
const getCustomerfromLocalStorage = localStorage.getItem("customer")
  ? JSON.parse(localStorage.getItem("customer"))
  : null;

// Extract user object from customer data if it exists
const getUserFromCustomer = (customerData) => {
  if (!customerData) return null;
  // If customer has a nested user object, use it
  if (customerData.user) return customerData.user;
  // Otherwise, return the whole customer object (backward compatibility)
  return customerData;
};

const initialState = {
  auth: getCustomerfromLocalStorage,
  user: getUserFromCustomer(getCustomerfromLocalStorage), // Extract user from customer
  isError: false,
  isSuccess: false,
  isLoading: false,
  errorMessage: "",
  wishlist: "",
  resetPasswordStatus: "",
  authError: "",
  orders: [],
  loading: false,
  error: null,
  buyNowItem: null // Pour stocker l'article acheté directement
};

// Création du slice
export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setBuyNowItem: (state, action) => {
      state.buyNowItem = action.payload;
    },
    clearBuyNowItem: (state) => {
      state.buyNowItem = null;
    },
    resetUpdateState: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    }
  },
  extraReducers: (builder) => {
    builder
    // Ajout de la logique pour `saveUserAddress`
    .addCase(saveUserAddress.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.errorMessage = "";
    })
    .addCase(saveUserAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.address = action.payload; // On met l'adresse dans l'état
      // Si l'adresse a bien été enregistrée, on peut mettre à jour le localStorage
      const currentUser = JSON.parse(localStorage.getItem("customer"));
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          address: action.payload, // On ajoute l'adresse à l'utilisateur
        };
        localStorage.setItem("customer", JSON.stringify(updatedUser)); // Mise à jour dans localStorage
      }
      toast.success("Adresse enregistrée avec succès");
    })
    .addCase(saveUserAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload || "Échec de l'enregistrement de l'adresse";
      toast.error(state.errorMessage);
    })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.auth = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Échec de l'enregistrement de l'utilisateur";
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.auth = action.payload;
        // Extract user object from payload: { success, message, user, token }
        state.user = action.payload?.user || action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Échec de la connexion de l'utilisateur";
      })
      .addCase(addProdToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProdToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.wishlist = action.payload;
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProdToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error;
      })
      .addCase(getUserProductWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProductWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.wishlist = action.payload;
        if (state.isSuccess === true) {
          toast.success("Produit ajouté à la liste de souhaits");
        }
      })
      .addCase(getUserProductWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error;
        if (state.isError === true) {
          toast.error(state.message);
        }
      })
      .addCase(toggleProductWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleProductWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.wishlist = action.payload;
        toast.success("Liste de souhaits mise à jour");
      })
      .addCase(toggleProductWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error(action.payload || "Échec de la modification de la wishlist");
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.pass = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getUserCart.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartProducts = action.payload;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Échec de l'obtention du panier utilisateur";
      })
      .addCase(deleteCartProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deleteCartProduct = action.payload;
        if (state.isSuccess === true) {
          toast.success("Produit supprimé");
        }
      })
      .addCase(deleteCartProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        if (state.isSuccess === false) {
          toast.success("Quelque chose s'est mal passé");
        }
      })
      .addCase(updateCartProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedCartItem = action.payload;
        if (state.isSuccess === true) {
          toast.success("Produit mis à jour dans le panier");
        }
      })
      .addCase(updateCartProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        if (state.isError === true) {
          toast.error("Échec de la mise à jour du produit dans le panier");
        }
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.createdOrder = action.payload;
        toast.success("Commande passée avec succès !");
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        toast.error("Un problème est survenu lors de la commande.");
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.auth = null; // Also clear auth field
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        // Clear user data even on error to ensure complete logout
        state.user = null;
        state.auth = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        
        // Extract user from backend response: { success: true, message: "...", user: {...} }
        const updatedUser = action.payload?.user || action.payload;
        
        console.log('✅ Profile update success - Updated user:', updatedUser);
        
        // Update Redux state with the new user data
        state.user = updatedUser;
        state.auth = { ...state.auth, user: updatedUser };
        
        // Update localStorage "customer" with complete structure
        const currentCustomerData = JSON.parse(localStorage.getItem("customer"));
        if (currentCustomerData) {
          const updatedCustomerData = {
            ...currentCustomerData,
            user: updatedUser // Replace the nested user object
          };
          localStorage.setItem("customer", JSON.stringify(updatedCustomerData));
          console.log('💾 localStorage updated with new user data');
        }
        
        toast.success(action.payload?.message || 'Profil mis à jour avec succès');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || action.error.message;
        
        // Check if error is related to authentication (expired token)
        if (action.error.message?.includes('401') || action.error.message?.includes('Token') || action.error.message?.includes('expired')) {
          toast.error('🔒 Session expirée. Veuillez vous reconnecter.');
          // Clear user data and redirect to login
          state.user = null;
          state.auth = null;
          localStorage.clear();
          sessionStorage.clear();
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          toast.error(action.payload || 'Erreur lors de la mise à jour du profil');
        }
      });
      
  }    
});

export const { setBuyNowItem, clearBuyNowItem, resetUpdateState } = authSlice.actions;
export default authSlice.reducer;
