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
        return rejectWithValue("Invalid coordinates provided");
      }

      // Uses the mapApi service
      const response = await mapApi.getWeatherByCoords(lat, lon);

      const weather = response.data;

      return {
        lat,
        lng: lon,

        city: weather.location.city,
        country: weather.location.country,

        temp: weather.current.temp,
        feelsLike: weather.current.feelsLike,
        tempMin: weather.current.tempMin,
        tempMax: weather.current.tempMax,

        humidity: weather.current.humidity,
        pressure: weather.current.pressure,
        visibility: weather.current.visibility,

        windSpeed: weather.current.windSpeed,
        windDeg: weather.current.windDeg,

        condition: weather.current.condition,
        description: weather.current.description,
        icon: weather.current.icon,

        sunrise: weather.current.sunrise,
        sunset: weather.current.sunset,

        airQuality: weather.airQuality,
        hourlyForecast: weather.hourlyForecast,
        dailyForecast: weather.dailyForecast,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch location weather"
      );
    }
  }
);