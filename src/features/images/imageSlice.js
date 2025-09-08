import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for processing uploaded image
export const processImage = createAsyncThunk(
  'images/processImage',
  async (file, { dispatch, getState }) => {
    const imageUrl = URL.createObjectURL(file);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        resolve({
          id: Date.now(),
          file,
          url: imageUrl,
          canvas,
          dimensions: {
            width: img.width,
            height: img.height
          }
        });
      };
      img.src = imageUrl;
    });
  }
);

const imageSlice = createSlice({
  name: 'images',
  initialState: {
    images: [],
    currentImage: null,
    isProcessing: false,
    error: null
  },
  reducers: {
    setCurrentImage: (state, action) => {
      state.currentImage = action.payload;
    },
    removeImage: (state, action) => {
      state.images = state.images.filter(img => img.id !== action.payload);
      if (state.currentImage?.id === action.payload) {
        state.currentImage = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processImage.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(processImage.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.images.push(action.payload);
        state.currentImage = action.payload;
      })
      .addCase(processImage.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.error.message;
      });
  }
});

export const { setCurrentImage, removeImage } = imageSlice.actions;
export default imageSlice.reducer;
