import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contactService from "./contactService";
import { toast } from "react-toastify";

export const createQuery = createAsyncThunk(
  "contact/post",
  async (contactData, thunkAPI) => {
    try {
      return await contactService.postQuery(contactData);
    } catch (error) {
      // Utilisez thunkAPI.rejectWithValue pour renvoyer une valeur avec l'erreur
      return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// État initial
const contactState = {
  contact: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ""
};

// Création du slice pour gérer l'état des produits
export const contactSlice = createSlice({
  name: "contact",
  initialState: contactState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createQuery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contact = action.payload;
        if (state.isSuccess === true) {
          toast.success("Contact form submitted successfully");
        }
      })
      .addCase(createQuery.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Something went wrong";
        if (state.isError === true) {
          toast.error(state.message);
        }
      });
  }
});

export default contactSlice.reducer;
