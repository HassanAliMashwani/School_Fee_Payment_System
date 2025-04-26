// features/fees/feeSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createFeeStructure = createAsyncThunk(
  'fees/create',
  async (feeData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/fees', feeData, {
        headers: {
          'Content-Type': 'application/json',
          'Transaction-Lock': 'true' // Ensure atomic operation
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const feeSlice = createSlice({
  name: 'fees',
  initialState: {
    structures: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFeeStructure.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.structures.push(action.payload);
      })
      .addCase(createFeeStructure.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      });
  }
});

export default feeSlice.reducer;