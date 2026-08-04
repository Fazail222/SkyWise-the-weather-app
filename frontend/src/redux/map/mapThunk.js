import { createAsyncThunk } from "@reduxjs/toolkit";
import { mapApi } from "../../api/mapApi";

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

      const weather = response.data;

      return {
        lat,
        lng: lon,

        city: weather.location.city,
        country: weather.location.country,

        temp: weather.current.temp,
        feelsLike: weather.current.feelsLike,
        humidity: weather.current.humidity,
        pressure: weather.current.pressure,
        windSpeed: weather.current.windSpeed,
        windDeg: weather.current.windDeg,

        description: weather.current.description,
        condition: weather.current.condition,
        icon: weather.current.icon,

        visibility: weather.current.visibility,

        hourlyForecast: weather.hourlyForecast,
        dailyForecast: weather.dailyForecast,
        airQuality: weather.airQuality,
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