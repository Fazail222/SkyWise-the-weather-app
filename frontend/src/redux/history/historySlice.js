import { createSlice } from '@reduxjs/toolkit';
import { fetchHistory, addHistory, clearHistory } from './historyThunk';

const historySlice = createSlice({
  name: 'history',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addHistory.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(clearHistory.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default historySlice.reducer;