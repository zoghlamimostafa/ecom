import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import paymentService from './paymentService';

export const processPayment = createAsyncThunk(
  "payment/process",
  async (paymentData, thunkAPI) => {
    try {
      const response = await paymentService.processPayment(paymentData);
      // Traitez la réponse comme vous le souhaitez, peut-être en la retournant
      return response;
    } catch (error) {
      // Gérez les erreurs ici
      return thunkAPI.rejectWithValue(error.message || "Échec du processus de paiement");
    }
  }
);

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMessage: "",
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(processPayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(processPayment.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success("Paiement effectué avec succès");
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Échec du processus de paiement";
        toast.error(state.errorMessage);
      });
  },
});

export const selectPaymentLoading = (state) => state.payment.isLoading;
export const selectPaymentError = (state) => state.payment.isError;
export const selectPaymentSuccess = (state) => state.payment.isSuccess;

export default paymentSlice.reducer;
