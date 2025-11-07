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
// DÉSACTIVÉ - Utiliser toggleProductWishlist dans userSlice à la place
// export const addToWishlist = createAsyncThunk(
//   "product/wishlist",
//   async (prodId, thunkAPI) => {
//     try {
//       return await productService.addToWishlist(prodId);
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Failed to add product to wishlist');
//     }
//   }
// );

// Action asynchrone pour récupérer la wishlist
export const getWishlist = createAsyncThunk(
  "product/get-wishlist",
  async (_, thunkAPI) => {
    try {
      return await productService.getWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch wishlist');
    }
  }
);

// Action asynchrone pour ajouter un avis
export const addRating = createAsyncThunk(
  'product/rating',
  async (data, thunkAPI) => {
    try {
      return await productService.rateProduct(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllRatings = createAsyncThunk(
  'product/getAllRatings',
  async (_, thunkAPI) => {
    try {
      return await productService.getAllRatings();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// État initial
const productState = {
  product: [], // Changed from "" to [] to ensure it's always an array
  featured: [],
  popular: [],
  special: [],
  supermarket: [],
  wishlist: [],
  allRatings: [], // Tous les avis de tous les produits
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
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getFeaturedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.featured = action.payload;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getPopularProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPopularProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.popular = action.payload;
      })
      .addCase(getPopularProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getSpecialProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSpecialProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.special = action.payload;
      })
      .addCase(getSpecialProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(getSupermarketProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSupermarketProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.supermarket = action.payload;
      })
      .addCase(getSupermarketProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
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
        // Update the current product with the new ratings if available
        if (action.payload?.product) {
          state.product = action.payload.product;
        }
        toast.success("Avis ajouté avec succès");
      })
      .addCase(addRating.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
        toast.error(state.message);
      })
      .addCase(getAllRatings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRatings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.allRatings = action.payload?.ratings || [];
      })
      .addCase(getAllRatings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || action.error.message;
      })
      // DÉSACTIVÉ - Utiliser toggleProductWishlist dans userSlice à la place
      // .addCase(addToWishlist.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(addToWishlist.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      //   state.message = "Product Added to Wishlist";
      //   // Refresh wishlist after adding
      //   if (action.payload && action.payload.wishlist) {
      //     state.wishlist = action.payload.wishlist;
      //   }
      //   toast.success("Product Added to Wishlist");
      // })
      // .addCase(addToWishlist.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.message = action.payload || action.error.message;
      //   toast.error(state.message);
      // })
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.wishlist = action.payload || [];
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || action.error.message;
      });
  }
});

export const getFeaturedProducts = createAsyncThunk(
  "product/get-featured",
  async (thunkAPI) => {
    try {
      return await productService.getProducts({ tags: "featured" });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getPopularProducts = createAsyncThunk(
  "product/get-popular",
  async (thunkAPI) => {
    try {
      return await productService.getProducts({ tags: "popular" });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSpecialProducts = createAsyncThunk(
  "product/get-special",
  async (thunkAPI) => {
    try {
      return await productService.getProducts({ tags: "special" });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSupermarketProducts = createAsyncThunk(
  "product/get-supermarket",
  async (thunkAPI) => {
    try {
      return await productService.getProducts({ tags: "supermarcher" });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export default productSlice.reducer;
