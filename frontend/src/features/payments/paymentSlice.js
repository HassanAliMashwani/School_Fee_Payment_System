// features/payments/paymentSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const processPayment = createAsyncThunk(
  'payments/process',
  async (paymentData, { getState }) => {
    try {
      const response = await axios.post('/api/payments', paymentData, {
        headers: {
          'Transaction-ID': Date.now(), // Unique transaction ID
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  {
    condition: (_, { getState }) => {
      const { isLoading } = getState().payments;
      if (isLoading) {
        return false; // Prevent concurrent submissions
      }
    },
  }
);

export const fetchFeeDetails = createAsyncThunk(
  'payments/fetchFeeDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/payments/fee-details');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPaymentHistory = createAsyncThunk(
  'payments/history',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/payments/history');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState: {
    transactions: [],
    feeDetails: null,
    paymentHistory: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Process Payment Cases
      .addCase(processPayment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactions.push(action.payload);
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Fetch Fee Details Cases
      .addCase(fetchFeeDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeeDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feeDetails = action.payload;
      })
      .addCase(fetchFeeDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      
      // Payment History Cases
      .addCase(getPaymentHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paymentHistory = action.payload;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      });
  },
});

export default paymentSlice.reducer;