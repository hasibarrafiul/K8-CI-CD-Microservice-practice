import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// These types are CRUCIAL for TypeScript to stop complaining
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;