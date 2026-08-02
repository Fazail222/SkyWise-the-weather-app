import { createAsyncThunk } from "@reduxjs/toolkit";
import { weatherApi } from "../../api/weatherApi";

export const fetchWeatherByCity = createAsyncThunk(
  "weather/fetchWeatherByCity",
  async (city, { rejectWithValue }) => {
    try {
      const response = await weatherApi.getWeatherByCity(city);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch weather."
      );
    }
  }
);

export const fetchWeatherByCoords = createAsyncThunk(
  "weather/fetchWeatherByCoords",
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const response = await weatherApi.getWeatherByCoords({ lat, lon });

      console.log("API Response:", response.data);

      return response.data;
    } catch (error) {
      console.log(error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);