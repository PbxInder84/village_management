import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import galleryService from './galleryService';

const initialState = {
  galleryItems: [],
  galleryItem: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get all published gallery items
export const getGalleryItems = createAsyncThunk(
  'gallery/getAll',
  async (_, thunkAPI) => {
    try {
      return await galleryService.getGalleryItems();
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all gallery items (admin)
export const getAllGalleryItems = createAsyncThunk(
  'gallery/getAllAdmin',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await galleryService.getAllGalleryItems(token);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get gallery items by category
export const getGalleryByCategory = createAsyncThunk(
  'gallery/getByCategory',
  async (category, thunkAPI) => {
    try {
      return await galleryService.getGalleryByCategory(category);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get gallery item by ID
export const getGalleryById = createAsyncThunk(
  'gallery/getById',
  async (id, thunkAPI) => {
    try {
      return await galleryService.getGalleryById(id);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new gallery item
export const createGalleryItem = createAsyncThunk(
  'gallery/create',
  async (galleryData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await galleryService.createGalleryItem(galleryData, token);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update gallery item
export const updateGalleryItem = createAsyncThunk(
  'gallery/update',
  async ({ id, galleryData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await galleryService.updateGalleryItem(id, galleryData, token);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete gallery item
export const deleteGalleryItem = createAsyncThunk(
  'gallery/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await galleryService.deleteGalleryItem(id, token);
      return id;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGalleryItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGalleryItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.galleryItems = action.payload;
      })
      .addCase(getGalleryItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllGalleryItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllGalleryItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.galleryItems = action.payload;
      })
      .addCase(getAllGalleryItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGalleryByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGalleryByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.galleryItems = action.payload;
      })
      .addCase(getGalleryByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGalleryById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGalleryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.galleryItem = action.payload;
      })
      .addCase(getGalleryById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createGalleryItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGalleryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.galleryItems.push(action.payload);
      })
      .addCase(createGalleryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateGalleryItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateGalleryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.galleryItems = state.galleryItems.map(item => 
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateGalleryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteGalleryItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.galleryItems = state.galleryItems.filter(item => item._id !== action.payload);
      })
      .addCase(deleteGalleryItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = gallerySlice.actions;
export default gallerySlice.reducer; 