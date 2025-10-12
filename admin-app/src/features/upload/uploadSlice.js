import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uploadService from "./uploadService";

export const uploadImg = createAsyncThunk(
  "upload/images",
  async (data, thunkAPI) => {
    try {
      console.log("📸 UploadSlice: Début upload", data);
      // Ne pas créer de FormData ici car uploadService le fait déjà
      return await uploadService.uploadImg(data);
    } catch (error) {
      console.error("❌ UploadSlice: Erreur upload", error);
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);
export const delImg = createAsyncThunk(
  "delete/images",
  async (id, thunkAPI) => {
    try {
      return await uploadService.deleteImg(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
const initialState = {
  images: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const uploadSlice = createSlice({
  name: "imaegs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadImg.fulfilled, (state, action) => {
        console.log("🎉 UploadSlice.fulfilled - Upload réussi !");
        console.log("📊 Payload reçu:", action.payload);
        console.log("📊 Type de payload:", typeof action.payload);
        console.log("📊 Est un array:", Array.isArray(action.payload));
        
        if (Array.isArray(action.payload)) {
          console.log("📊 Nombre d'images:", action.payload.length);
          action.payload.forEach((img, index) => {
            console.log(`📸 Image ${index}:`, {
              url: img.url,
              public_id: img.public_id,
              asset_id: img.asset_id
            });
          });
        } else {
          console.warn("⚠️ Payload n'est pas un array:", action.payload);
        }
        
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.images = action.payload;
        
        console.log("✅ État Redux mis à jour - images:", state.images);
      })
      .addCase(uploadImg.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error;
      })
      .addCase(delImg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delImg.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.images = state.images.filter(img => img.public_id !== action.meta.arg);
      })
      .addCase(delImg.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});
export default uploadSlice.reducer;