import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const selectLocationFromMap = createAsyncThunk(
  'map/selectLocationFromMap',
  async ({ lat, lon }, { rejectWithValue }) => {
    if (lat === undefined || lon === undefined || isNaN(lat) || isNaN(lon)) {
      return rejectWithValue('Invalid coordinates provided');
    }

    try {
      const response = await axios.get(`/api/v1/weather/coords?lat=${lat}&lon=${lon}`);
      return {
        lat,
        lng: lon,
        ...response.data.data, // Assumes your backend returns structured weather payload
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch location weather');
    }
  }
);