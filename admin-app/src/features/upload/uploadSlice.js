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
  reducers: {
    resetUploadState: (state) => {
      console.log("🔄 Reset upload state");
      state.images = [];
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadImg.fulfilled, (state, action) => {
        console.log("🎉 UploadSlice.fulfilled - Upload réussi !");
        console.log("📊 Payload brut reçu:", action.payload);
        console.log("📊 Type de payload:", typeof action.payload);
        console.log("📊 Est un array:", Array.isArray(action.payload));
        
        let normalizedImages = [];
        
        if (Array.isArray(action.payload)) {
          console.log("📊 Nombre d'images:", action.payload.length);
          
          // Normaliser chaque image pour être sûr d'avoir le bon format
          normalizedImages = action.payload.map((img, index) => {
            console.log(`📸 Image ${index} brute:`, img);
            
            // Extraire url et public_id de façon sûre
            const url = img?.url || img;
            const public_id = img?.public_id || `image-${Date.now()}-${index}`;
            
            const normalized = {
              url: typeof url === 'string' ? url : String(url),
              public_id: typeof public_id === 'string' ? public_id : String(public_id)
            };
            
            console.log(`📸 Image ${index} normalisée:`, normalized);
            return normalized;
          });
        } else {
          console.warn("⚠️ Payload n'est pas un array:", action.payload);
          // Si ce n'est pas un array, essayer de le convertir
          if (action.payload) {
            normalizedImages = [{
              url: String(action.payload.url || action.payload),
              public_id: String(action.payload.public_id || `image-${Date.now()}`)
            }];
          }
        }
        
        console.log("✅ Images normalisées:", normalizedImages);
        
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.images = normalizedImages;
        
        console.log("✅ État Redux final - images:", state.images);
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

export const { resetUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;