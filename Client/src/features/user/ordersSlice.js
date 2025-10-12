import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService'; // Assurez-vous que le chemin d'importation correspond à l'emplacement de votre service.

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};

// Actions asynchrones pour récupérer les commandes et gérer les erreurs.
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getOrders();
      // Vérifiez que la réponse contient un tableau d'ordres
      if (Array.isArray(response)) {
        return response; // Retourne les données sous forme de tableau
      } else {
        throw new Error('Les données des commandes sont invalides.');
      }
    } catch (error) {
      return rejectWithValue(error.message); // En cas d'erreur, retourne l'erreur.
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await userService.getOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewOrder = createAsyncThunk(
  'orders/createNewOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await userService.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await userService.updateOrderStatus(orderId, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.orders = [];
      state.order = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        // Assurez-vous que l'API renvoie un tableau d'ordres et que l'on met bien à jour cet état
        state.orders = action.payload; 
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload); // Ajouter la nouvelle commande à l'état.
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload; // Mettre à jour l'ordre avec le statut modifié.
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = ordersSlice.actions;

export default ordersSlice.reducer;
