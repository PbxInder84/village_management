import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceTypeService from './serviceTypeService';

const initialState = {
  serviceTypes: [],
  serviceType: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get all service types (admin)
export const getAllServiceTypes = createAsyncThunk(
  'serviceTypes/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await serviceTypeService.getAllServiceTypes(token);
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

// Get active service types
export const getActiveServiceTypes = createAsyncThunk(
  'serviceTypes/getActive',
  async (_, thunkAPI) => {
    try {
      return await serviceTypeService.getActiveServiceTypes();
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

// Get service type by ID
export const getServiceTypeById = createAsyncThunk(
  'serviceTypes/getById',
  async (id, thunkAPI) => {
    try {
      return await serviceTypeService.getServiceTypeById(id);
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

// Create new service type
export const createServiceType = createAsyncThunk(
  'serviceTypes/create',
  async (serviceTypeData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await serviceTypeService.createServiceType(serviceTypeData, token);
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

// Update service type
export const updateServiceType = createAsyncThunk(
  'serviceTypes/update',
  async ({ id, serviceTypeData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await serviceTypeService.updateServiceType(id, serviceTypeData, token);
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

// Delete service type
export const deleteServiceType = createAsyncThunk(
  'serviceTypes/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await serviceTypeService.deleteServiceType(id, token);
      return { id };
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

export const serviceTypeSlice = createSlice({
  name: 'serviceTypes',
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
      .addCase(getAllServiceTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllServiceTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.serviceTypes = action.payload;
      })
      .addCase(getAllServiceTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getActiveServiceTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveServiceTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.serviceTypes = action.payload;
      })
      .addCase(getActiveServiceTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getServiceTypeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getServiceTypeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.serviceType = action.payload;
      })
      .addCase(getServiceTypeById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createServiceType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createServiceType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.serviceTypes.push(action.payload);
      })
      .addCase(createServiceType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateServiceType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateServiceType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.serviceTypes = state.serviceTypes.map(type => 
          type._id === action.payload._id ? action.payload : type
        );
      })
      .addCase(updateServiceType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteServiceType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteServiceType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.serviceTypes = state.serviceTypes.filter(type => type._id !== action.payload.id);
      })
      .addCase(deleteServiceType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = serviceTypeSlice.actions;
export default serviceTypeSlice.reducer; 