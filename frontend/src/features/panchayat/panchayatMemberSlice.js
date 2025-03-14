import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import panchayatMemberService from './panchayatMemberService';

const initialState = {
  members: [],
  member: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get all panchayat members (admin)
export const getAllMembers = createAsyncThunk(
  'panchayatMembers/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await panchayatMemberService.getAllMembers(token);
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

// Get active panchayat members
export const getActiveMembers = createAsyncThunk(
  'panchayatMembers/getActive',
  async (_, thunkAPI) => {
    try {
      return await panchayatMemberService.getActiveMembers();
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

// Get panchayat member by ID
export const getMemberById = createAsyncThunk(
  'panchayatMembers/getById',
  async (id, thunkAPI) => {
    try {
      return await panchayatMemberService.getMemberById(id);
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

// Create new panchayat member
export const createMember = createAsyncThunk(
  'panchayatMembers/create',
  async (memberData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await panchayatMemberService.createMember(memberData, token);
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

// Update panchayat member
export const updateMember = createAsyncThunk(
  'panchayatMembers/update',
  async ({ id, memberData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await panchayatMemberService.updateMember(id, memberData, token);
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

// Delete panchayat member
export const deleteMember = createAsyncThunk(
  'panchayatMembers/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await panchayatMemberService.deleteMember(id, token);
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

export const panchayatMemberSlice = createSlice({
  name: 'panchayatMembers',
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
      .addCase(getAllMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.members = action.payload;
      })
      .addCase(getAllMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getActiveMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.members = action.payload;
      })
      .addCase(getActiveMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMemberById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMemberById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.member = action.payload;
      })
      .addCase(getMemberById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.members.push(action.payload);
      })
      .addCase(createMember.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.members = state.members.map(member => 
          member._id === action.payload._id ? action.payload : member
        );
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.members = state.members.filter(member => member._id !== action.payload.id);
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = panchayatMemberSlice.actions;
export default panchayatMemberSlice.reducer; 