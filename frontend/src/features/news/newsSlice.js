import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import newsService from './newsService';

const initialState = {
  news: [],
  singleNews: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get all news (admin)
export const getAllNews = createAsyncThunk(
  'news/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await newsService.getAllNews(token);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.msg) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get published news
export const getPublishedNews = createAsyncThunk(
  'news/getPublished',
  async (_, thunkAPI) => {
    try {
      return await newsService.getPublishedNews();
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.msg) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get news by ID
export const getNewsById = createAsyncThunk(
  'news/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await newsService.getNewsById(id, token);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.msg) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create news
export const createNews = createAsyncThunk(
  'news/create',
  async (newsData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await newsService.createNews(newsData, token);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.msg) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update news
export const updateNews = createAsyncThunk(
  'news/update',
  async ({ id, newsData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await newsService.updateNews(id, newsData, token);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.msg) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete news
export const deleteNews = createAsyncThunk(
  'news/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await newsService.deleteNews(id, token);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.msg) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllNews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.news = action.payload;
      })
      .addCase(getAllNews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPublishedNews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPublishedNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.news = action.payload;
      })
      .addCase(getPublishedNews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getNewsById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNewsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.singleNews = action.payload;
      })
      .addCase(getNewsById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createNews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.news.unshift(action.payload);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateNews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.news = state.news.map(item => 
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteNews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.news = state.news.filter(item => item._id !== action.payload.id);
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = newsSlice.actions;
export default newsSlice.reducer; 