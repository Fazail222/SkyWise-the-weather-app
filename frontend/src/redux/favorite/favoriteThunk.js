import { createAsyncThunk } from '@reduxjs/toolkit';
import { favoriteApi } from '../../api/favoriteApi';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoriteApi.getFavorites();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async (favoriteData, { rejectWithValue }) => {
    try {
      const response = await favoriteApi.addFavorite(favoriteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async (id, { rejectWithValue }) => {
    try {
      await favoriteApi.removeFavorite(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);