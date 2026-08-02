import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi'; // ensure correct relative path to your authApi

// Helper to save token to localStorage
const setTokenInStorage = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  }
};

// Helper to clear token from localStorage
const removeTokenFromStorage = () => {
  localStorage.removeItem('token');
};

// Register Thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      const data = response.message;
      if (data.token) {
        setTokenInStorage(data.token);
      }
      return data; // Expected shape: { user, token }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

// Login Thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const data = response.message;
      if (data.token) {
        setTokenInStorage(data.token);
      }
      return data; // Expected shape: { user, token }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Invalid email or password.';
      return rejectWithValue(message);
    }
  }
);

// Fetch Profile Thunk
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      return response.message.user || response.message; // Expected shape: user profile object
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Session expired. Please log in again.';
      return rejectWithValue(message);
    }
  }
);

// Logout Thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error) {
      // Proceed with clearing local state even if backend API fails
      console.warn('Logout endpoint failed:', error);
    } finally {
      removeTokenFromStorage();
    }
  }
);