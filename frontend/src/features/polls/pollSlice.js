import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pollService from './pollService';

const initialState = {
  polls: [],
  poll: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get all active polls
export const getActivePolls = createAsyncThunk(
  'polls/getActive',
  async (_, thunkAPI) => {
    try {
      return await pollService.getActivePolls();
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

// Get all polls (admin)
export const getAllPolls = createAsyncThunk(
  'polls/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await pollService.getAllPolls(token);
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

// Get poll by ID
export const getPollById = createAsyncThunk(
  'polls/getById',
  async (id, thunkAPI) => {
    try {
      return await pollService.getPollById(id);
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

// Create poll
export const createPoll = createAsyncThunk(
  'polls/create',
  async (pollData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await pollService.createPoll(pollData, token);
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

// Update poll
export const updatePoll = createAsyncThunk(
  'polls/update',
  async ({ id, pollData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await pollService.updatePoll(id, pollData, token);
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

// Vote on poll
export const votePoll = createAsyncThunk(
  'polls/vote',
  async ({ id, optionIndex }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await pollService.votePoll(id, optionIndex, token);
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

// Delete poll
export const deletePoll = createAsyncThunk(
  'polls/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await pollService.deletePoll(id, token);
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

export const pollSlice = createSlice({
  name: 'polls',
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
      .addCase(getActivePolls.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActivePolls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.polls = action.payload;
      })
      .addCase(getActivePolls.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllPolls.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPolls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.polls = action.payload;
      })
      .addCase(getAllPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPollById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPollById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.poll = action.payload;
      })
      .addCase(getPollById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPoll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.polls.push(action.payload);
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updatePoll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePoll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.polls = state.polls.map(poll => 
          poll._id === action.payload._id ? action.payload : poll
        );
        state.poll = action.payload;
      })
      .addCase(updatePoll.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(votePoll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(votePoll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.polls = state.polls.map(poll => 
          poll._id === action.payload._id ? action.payload : poll
        );
        state.poll = action.payload;
      })
      .addCase(votePoll.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePoll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePoll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.polls = state.polls.filter(poll => poll._id !== action.payload);
      })
      .addCase(deletePoll.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = pollSlice.actions;
export default pollSlice.reducer; 