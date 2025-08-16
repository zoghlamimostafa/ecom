import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerService from "./customerService";

// Action asynchrone pour récupérer les utilisateurs
export const getUsers = createAsyncThunk(
  "customer/get-customers",
  async () => {
    try {
      return await customerService.getUsers();
    } catch (error) {
      throw error;
    }
  }
);

// Action asynchrone pour supprimer un utilisateur
export const deleteUser = createAsyncThunk(
  "customer/delete-user",
  async (userId, thunkAPI) => {
    try {
      await customerService.deleteUser(userId);
      // Retourne l'ID de l'utilisateur supprimé pour mise à jour ultérieure
      return userId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Action asynchrone pour bloquer un utilisateur
export const blockUser = createAsyncThunk(
  "customer/block-user",
  async (userId, thunkAPI) => {
    try {
      const response = await customerService.blockUser(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Action asynchrone pour débloquer un utilisateur
export const unblockUser = createAsyncThunk(
  "customer/unblock-user",
  async (userId, thunkAPI) => {
    try {
      const response = await customerService.unblockUser(userId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  customers: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.customers = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Supprimer l'utilisateur de la liste des clients
        state.customers = state.customers.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message;
      })
      .addCase(blockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message;
      })
      .addCase(unblockUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unblockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(unblockUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message;
      });
  },
});

export default customerSlice.reducer;
