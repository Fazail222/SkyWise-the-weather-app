import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import weatherReducer from './weather/weatherSlice';
import favoriteReducer from './favorite/favoriteSlice';
import historyReducer from './history/historySlice';
import aiReducer from './ai/aiSlice';
import mapReducer from './map/mapSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    favorites: favoriteReducer,
    history: historyReducer,
    ai: aiReducer,
    map: mapReducer, // 👈 Registered map slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;