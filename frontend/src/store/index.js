import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import applicationReducer from './slices/applicationSlice';
import subscriptionReducer from './slices/subscriptionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    applications: applicationReducer,
    subscription: subscriptionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values
    }),
});

export default store; 