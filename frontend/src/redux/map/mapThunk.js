import { createAsyncThunk } from "@reduxjs/toolkit";
import { mapApi } from "../../services/mapApi";

export const selectLocationFromMap = createAsyncThunk(
  "map/selectLocationFromMap",
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      if (
        lat === undefined ||
        lon === undefined ||
        isNaN(lat) ||
        isNaN(lon)
      ) {
        return rejectWithValue("Invalid coordinates");
      }

      const response = await mapApi.getWeatherByCoords(lat, lon);

      return {
        lat,
        lng: lon,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch weather"
      );
    }
  }
);