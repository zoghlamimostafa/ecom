import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import productService from "./productService";

// Action asynchrone pour récupérer les produits
export const getProducts = createAsyncThunk(
  "product/get-products",
  async (_, thunkAPI) => {
    try {
      return await productService.getProducts();
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Erreur lors du chargement des produits';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Action asynchrone pour créer un produit
export const createProducts = createAsyncThunk(
  "product/create-products",
  async (productData, thunkAPI) => {
    try {
      return await productService.createProduct(productData);
    } catch (error) {
      // Extraire le message d'erreur de manière sécurisée
      const errorMessage = error.message || error.response?.data?.message || error.toString();
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Action asynchrone pour supprimer un produit
export const deleteProduct = createAsyncThunk(
  "product/delete-product",
  async (productId, thunkAPI) => {
    try {
      await productService.deleteProduct(productId);
      return productId; // Retourne l'ID du produit supprimé
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || error.toString();
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Action asynchrone pour récupérer un produit
export const getProduct = createAsyncThunk(
  "product/get-product",
  async (productId, thunkAPI) => {
    try {
      return await productService.getProduct(productId);
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || error.toString();
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Action asynchrone pour mettre à jour un produit
export const updateProduct = createAsyncThunk(
  "product/update-product",
  async (productData, thunkAPI) => {
    try {
      return await productService.updateProduct(productData);
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || error.toString();
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Action de réinitialisation de l'état
export const resetState = createAction("Reset_all");

// État initial du slice
const initialState = {
  products: [],
  product: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  createdProduct: null,
};

// Slice de réduction pour les produits
export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle resetState action
      .addCase(resetState, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
        state.createdProduct = null;
      })
      // Gestion des cas pour la récupération des produits
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        // Extraire le message d'erreur de manière sécurisée
        let errorMessage = 'Erreur lors du chargement des produits';
        if (action.payload) {
          if (typeof action.payload === 'string') {
            errorMessage = action.payload;
          } else if (typeof action.payload === 'object' && action.payload.message) {
            errorMessage = action.payload.message;
          }
        } else if (action.error?.message) {
          errorMessage = action.error.message;
        }
        state.message = errorMessage;
      })
      // Gestion des cas pour la création de produits
      .addCase(createProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdProduct = action.payload;
      })
      .addCase(createProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        // Extraire le message d'erreur de manière sécurisée
        let errorMessage = "Erreur lors de la création du produit";
        if (action.payload) {
          if (typeof action.payload === 'string') {
            errorMessage = action.payload;
          } else if (typeof action.payload === 'object' && action.payload.message) {
            errorMessage = action.payload.message;
          } else if (action.payload instanceof Error) {
            errorMessage = action.payload.message;
          }
        } else if (action.error?.message) {
          errorMessage = action.error.message;
        }
        state.message = errorMessage;
        console.error("Product creation error:", errorMessage, action.payload || action.error);
      })
      // Gestion des cas pour la suppression de produits
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // Supprimez le produit de la liste des produits en utilisant son ID
        // Compatibilité MongoDB (_id) et SQLite (id)
        state.products = state.products.filter(product => {
          const productId = product.id || product._id;
          return productId !== action.payload;
        });
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        // Extraire le message d'erreur de manière sécurisée
        let errorMessage = "Erreur lors de la suppression du produit";
        if (action.payload) {
          errorMessage = typeof action.payload === 'string' ? action.payload : 
                        (action.payload.message || errorMessage);
        } else if (action.error) {
          errorMessage = typeof action.error === 'string' ? action.error : 
                        (action.error.message || errorMessage);
        }
        state.message = errorMessage;
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        // Extraire le message d'erreur de manière sécurisée
        let errorMessage = "Erreur lors de la récupération du produit";
        if (action.payload) {
          errorMessage = typeof action.payload === 'string' ? action.payload : 
                        (action.payload.message || errorMessage);
        } else if (action.error) {
          errorMessage = typeof action.error === 'string' ? action.error : 
                        (action.error.message || errorMessage);
        }
        state.message = errorMessage;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.product = action.payload;
        // Update the product in the products array as well
        // Compatibilité MongoDB (_id) et SQLite (id)
        const updatedProductId = action.payload.id || action.payload._id;
        const index = state.products.findIndex(product => {
          const productId = product.id || product._id;
          return productId === updatedProductId;
        });
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        // Extraire le message d'erreur de manière sécurisée
        let errorMessage = "Erreur lors de la mise à jour du produit";
        if (action.payload) {
          errorMessage = typeof action.payload === 'string' ? action.payload : 
                        (action.payload.message || errorMessage);
        } else if (action.error) {
          errorMessage = typeof action.error === 'string' ? action.error : 
                        (action.error.message || errorMessage);
        }
        state.message = errorMessage;
      });
  },
});

export default productSlice.reducer;
