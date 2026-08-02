import { createSlice } from '@reduxjs/toolkit';
import { askSkyWiseAI } from './aiThunk';

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    messages: [
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Hello! I am SkyWise AI. Ask me anything about current weather conditions, outfit suggestions, or travel advice!',
        timestamp: new Date().toISOString(),
      },
    ],
    loading: false,
    error: null,
  },
  reducers: {
    clearChatHistory: (state) => {
      state.messages = [state.messages[0]];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askSkyWiseAI.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Optimistically push user prompt
        state.messages.push({
          id: Date.now().toString(),
          sender: 'user',
          text: action.meta.arg.message,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(askSkyWiseAI.fulfilled, (state, action) => {
        state.loading = false;
        // Push AI response
        state.messages.push({
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: action.payload.aiResponse,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(askSkyWiseAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearChatHistory } = aiSlice.actions;
export default aiSlice.reducer;