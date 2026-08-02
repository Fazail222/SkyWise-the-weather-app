import { createSlice } from '@reduxjs/toolkit';
import { selectLocationFromMap } from './mapThunk';

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    // Default location (e.g., Lahore coordinates)
    center: {
      lat: 31.5204,
      lng: 74.3587,
    },
    zoom: 6,
    // Active OpenWeather radar layer overlay
    activeLayer: 'precipitation_new', // Options: 'precipitation_new', 'temp_new', 'clouds_new', 'wind_new'
    layerOpacity: 0.6,
    selectedMarker: null,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveLayer: (state, action) => {
      state.activeLayer = action.payload;
    },
    setMapCenter: (state, action) => {
      state.center = action.payload;
    },
    setMapZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setLayerOpacity: (state, action) => {
      state.layerOpacity = action.payload;
    },
    clearSelectedMarker: (state) => {
      state.selectedMarker = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectLocationFromMap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectLocationFromMap.fulfilled, (state, action) => {
        state.loading = false;
        state.center = { lat: action.payload.lat, lng: action.payload.lon };
        state.selectedMarker = {
          lat: action.payload.lat,
          lng: action.payload.lon,
          city: action.payload.weatherData?.location?.city || 'Selected Location',
          temp: action.payload.weatherData?.current?.temp,
        };
      })
      .addCase(selectLocationFromMap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveLayer,
  setMapCenter,
  setMapZoom,
  setLayerOpacity,
  clearSelectedMarker,
} = mapSlice.actions;

export default mapSlice.reducer;