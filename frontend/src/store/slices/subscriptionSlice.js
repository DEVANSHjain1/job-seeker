import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Async thunks
export const createOrder = createAsyncThunk(
  'subscription/createOrder',
  async (plan, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/subscriptions/orders`,
        { plan },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'subscription/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/subscriptions/verify-payment`,
        paymentData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSubscriptionDetails = createAsyncThunk(
  'subscription/getDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/subscriptions/details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPaymentHistory = createAsyncThunk(
  'subscription/getPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/subscriptions/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/subscriptions/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  subscription: null,
  payments: [],
  currentOrder: null,
  loading: false,
  error: null
};

// Slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create order';
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.user.subscription;
        state.payments.unshift(action.payload.payment);
        state.currentOrder = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to verify payment';
      })
      // Get Subscription Details
      .addCase(getSubscriptionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.subscription;
      })
      .addCase(getSubscriptionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch subscription details';
      })
      // Get Payment History
      .addCase(getPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch payment history';
      })
      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.subscription;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to cancel subscription';
      });
  }
});

export const { clearError, clearCurrentOrder } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 