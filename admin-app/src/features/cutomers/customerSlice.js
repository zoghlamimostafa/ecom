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
      const response = await customerService.deleteUser(userId);
      // Vérifier si la suppression a réussi
      if (response.success) {
        // Retourne l'ID de l'utilisateur supprimé pour mise à jour ultérieure
        return userId;
      } else {
        return thunkAPI.rejectWithValue(response);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response || error);
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

// Action asynchrone pour modifier un utilisateur
export const updateUser = createAsyncThunk(
  "customer/update-user",
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await customerService.updateUser(userId, userData);
      if (response.success) {
        return { userId, updatedData: response.user };
      } else {
        return thunkAPI.rejectWithValue(response);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response || error);
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
        state.isError = false;
        // Supprimer l'utilisateur de la liste des clients
        // Convertir en string pour être sûr de la comparaison
        const userIdToDelete = String(action.payload);
        state.customers = state.customers.filter(user => String(user.id) !== userIdToDelete);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.response?.data?.message || action.error?.message || "Erreur lors de la suppression";
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
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        // Mettre à jour l'utilisateur dans la liste
        const { userId, updatedData } = action.payload;
        const userIndex = state.customers.findIndex(user => String(user.id) === String(userId));
        if (userIndex !== -1) {
          state.customers[userIndex] = { ...state.customers[userIndex], ...updatedData };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.response?.data?.message || action.error?.message || "Erreur lors de la modification";
      });
  },
});

export default customerSlice.reducer;
