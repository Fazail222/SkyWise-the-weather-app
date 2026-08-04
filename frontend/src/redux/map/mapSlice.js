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
    // add this reducer alongside your existing ones
setPendingMarker: (state, action) => {
  const { lat, lng } = action.payload;
  state.center = { lat, lng };
  state.selectedMarker = {
    lat,
    lng,
    city: null,     // null = "still loading" flag for the popup
    temp: undefined,
    description: undefined,
  };
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
  state.selectedMarker = action.payload;
  state.center = {
    lat: action.payload.lat,
    lng: action.payload.lng,
  };
})
      .addCase(selectLocationFromMap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// update your exports line
export const {
  setActiveLayer,
  setMapCenter,
  setMapZoom,
  setLayerOpacity,
  clearSelectedMarker,
  setPendingMarker, // 👈 add this
} = mapSlice.actions;

export default mapSlice.reducer;