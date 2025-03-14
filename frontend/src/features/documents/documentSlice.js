import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import documentService from './documentService';

const initialState = {
  documents: [],
  document: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get all public documents
export const getPublicDocuments = createAsyncThunk(
  'documents/getPublic',
  async (_, thunkAPI) => {
    try {
      return await documentService.getPublicDocuments();
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

// Get all documents (admin)
export const getAllDocuments = createAsyncThunk(
  'documents/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await documentService.getAllDocuments(token);
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

// Get documents by category
export const getDocumentsByCategory = createAsyncThunk(
  'documents/getByCategory',
  async (category, thunkAPI) => {
    try {
      return await documentService.getDocumentsByCategory(category);
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

// Get document by ID
export const getDocumentById = createAsyncThunk(
  'documents/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await documentService.getDocumentById(id, token);
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

// Upload document
export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (documentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await documentService.uploadDocument(documentData, token);
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

// Update document
export const updateDocument = createAsyncThunk(
  'documents/update',
  async ({ id, documentData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await documentService.updateDocument(id, documentData, token);
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

// Delete document
export const deleteDocument = createAsyncThunk(
  'documents/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await documentService.deleteDocument(id, token);
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

export const documentSlice = createSlice({
  name: 'documents',
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
      .addCase(getPublicDocuments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPublicDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents = action.payload;
      })
      .addCase(getPublicDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllDocuments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents = action.payload;
      })
      .addCase(getAllDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getDocumentsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDocumentsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents = action.payload;
      })
      .addCase(getDocumentsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getDocumentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDocumentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.document = action.payload;
      })
      .addCase(getDocumentById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents.push(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents = state.documents.map(doc => 
          doc._id === action.payload._id ? action.payload : doc
        );
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.documents = state.documents.filter(doc => doc._id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = documentSlice.actions;
export default documentSlice.reducer; 