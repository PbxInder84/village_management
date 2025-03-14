import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching panchayat members
export const fetchPanchayatMembers = createAsyncThunk(
  'panchayatMembers/fetchPanchayatMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/panchayat/members');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  members: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const panchayatMembersSlice = createSlice({
  name: 'panchayatMembers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPanchayatMembers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPanchayatMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.members = action.payload;
      })
      .addCase(fetchPanchayatMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Selector to get all members
export const selectAllMembers = (state) => state.panchayatMembers.members;

// Selector to get active members
export const selectActiveMembers = (state) => 
  state.panchayatMembers.members.filter(member => member.isActive);

export default panchayatMembersSlice.reducer; 