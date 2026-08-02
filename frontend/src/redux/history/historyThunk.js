import { createAsyncThunk } from '@reduxjs/toolkit';
import { historyApi } from '../../api/historyApi';

export const fetchHistory = createAsyncThunk(
  'history/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await historyApi.getSearchHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addHistory = createAsyncThunk(
  'history/add',
  async (city, { rejectWithValue }) => {
    try {
      const response = await historyApi.addSearchHistory(city);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearHistory = createAsyncThunk(
  'history/clear',
  async (_, { rejectWithValue }) => {
    try {
      await historyApi.clearSearchHistory();
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);