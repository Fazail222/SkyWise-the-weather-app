import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
} from "./weatherThunk";

const initialState = {
  weather: null,
  activeCity: "Lahore",

  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",

  initialState,

  reducers: {
    setActiveCity: (state, action) => {
      state.activeCity = action.payload;
    },

    clearWeather: (state) => {
      state.weather = null;
      state.error = null;
    },

    clearWeatherError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // Fetch by City
      // =========================

      .addCase(fetchWeatherByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
        state.loading = false;

        state.weather = action.payload;

        state.activeCity = action.payload.location.city;
      })

      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      // =========================
      // Fetch by Coordinates
      // =========================

      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

    .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
    console.log(action.payload);

    state.loading = false;
    state.weather = action.payload;

    state.activeCity = action.payload.location.city;
})
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      });
  },
});

export const {
  setActiveCity,
  clearWeather,
  clearWeatherError,
} = weatherSlice.actions;

export default weatherSlice.reducer;