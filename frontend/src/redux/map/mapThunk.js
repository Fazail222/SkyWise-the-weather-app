import { createAsyncThunk } from '@reduxjs/toolkit';
import { weatherApi } from '../../api/weatherApi';

export const selectLocationFromMap = createAsyncThunk(
  'map/selectLocation',
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const response = await weatherApi.getWeatherByCoords(lat, lon);
      return {
        lat,
        lon,
        weatherData: response.data,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);