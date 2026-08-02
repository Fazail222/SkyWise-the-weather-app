import { createSlice } from '@reduxjs/toolkit';
import { fetchFavorites, addFavorite, removeFavorite } from './favoriteThunk';

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Remove
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default favoriteSlice.reducer;