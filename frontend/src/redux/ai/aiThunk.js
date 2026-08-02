import { createAsyncThunk } from '@reduxjs/toolkit';
import { aiApi } from '../../api/aiApi';

export const askSkyWiseAI = createAsyncThunk(
  'ai/ask',
  async ({ city, message }, { rejectWithValue }) => {
    try {
      const response = await aiApi.askAI(city, message);
      // Handles ApiResponse structure: res.data.data.aiReply
      const aiReply = response.data?.data?.aiReply || response.data?.aiReply || response.data;
      return {
        userMessage: message,
        aiResponse: aiReply,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to connect to AI';
      return rejectWithValue(errorMessage);
    }
  }
);