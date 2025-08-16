import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import productService from './productService';

// Action asynchrone pour récupérer tous les produits
export const getAllProducts = createAsyncThunk(
  "product/get",
  async (filters = {}, thunkAPI) => {
    try {
      return await productService.getProducts(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch products'); // Utilisation de rejectWithValue pour capturer l'erreur
    }
  }
);

// Action asynchrone pour récupérer un produit spécifique
export const getAProduct = createAsyncThunk(
  "product/getAProduct",
  async (id, thunkAPI) => {
    try {
      return await productService.getSingleProduct(id);
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch the product');
    }
  }
);

// Action asynchrone pour ajouter un produit à la liste de souhaits
export const addToWishlist = createAsyncThunk(
  "product/wishlist",
  async (prodId, thunkAPI) => {
    try {
      return await productService.addToWishlist(prodId);
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to add product to wishlist');
    }
  }
);

// Action asynchrone pour ajouter un avis
export const addRating = createAsyncThunk(
  "product/rating",
  async (data, thunkAPI) => {
    try {
      return await productService.rateProduct(data);
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to add rating');
    }
  }
);

// État initial
const productState = {
  product: [], // Changed from "" to [] to ensure it's always an array
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  singleproduct: null,
  rating: null,
};

// Création du slice pour gérer l'état des produits
export const productSlice = createSlice({
  name: "product",
  initialState: productState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || action.error.message; // Utilisation de `payload` pour l'erreur personnalisée
      })
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Product Added to Wishlist";
        toast.success("Product Added to Wishlist");
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || action.error.message;
        toast.error(state.message);
      })
      .addCase(getAProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleproduct = action.payload;
        state.message = "Product Fetched Successfully";
      })
      .addCase(getAProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || action.error.message;
      })
      .addCase(addRating.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.rating = action.payload;
        state.message = "Rating Added Successfully";
        toast.success("Rating added successfully");
      })
      .addCase(addRating.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
        toast.error(state.message);
      });
  }
});

export default productSlice.reducer;
