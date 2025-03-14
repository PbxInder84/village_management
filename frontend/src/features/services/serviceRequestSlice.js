import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceRequestService from './serviceRequestService';

const initialState = {
  requests: [],
  request: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get user's service requests
export const getUserRequests = createAsyncThunk(
  'serviceRequests/getUserRequests',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await serviceRequestService.getUserRequests(token);
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

// Get all service requests (admin)
export const getAllRequests = createAsyncThunk(
  'serviceRequests/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await serviceRequestService.getAllRequests(token);
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

// Get service request by ID
export const getRequestById = createAsyncThunk(
  'serviceRequests/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await serviceRequestService.getRequestById(id, token);
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

// Create new service request
export const createRequest = createAsyncThunk(
  'serviceRequests/create',
  async (requestData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await serviceRequestService.createRequest(requestData, token);
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

// Update service request status
export const updateRequestStatus = createAsyncThunk(
  'serviceRequests/updateStatus',
  async ({ id, statusData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await serviceRequestService.updateRequestStatus(id, statusData, token);
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

// Add comment to service request
export const addComment = createAsyncThunk(
  'serviceRequests/addComment',
  async ({ id, commentData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await serviceRequestService.addComment(id, commentData, token);
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

export const serviceRequestSlice = createSlice({
  name: 'serviceRequests',
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
      .addCase(getUserRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.requests = action.payload;
      })
      .addCase(getUserRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.requests = action.payload;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRequestById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRequestById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.request = action.payload;
      })
      .addCase(getRequestById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.requests.push(action.payload);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateRequestStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.request = action.payload;
        state.requests = state.requests.map(request => 
          request._id === action.payload._id ? action.payload : request
        );
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.request) {
          state.request.comments = action.payload;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = serviceRequestSlice.actions;
export default serviceRequestSlice.reducer; 