import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchGenerators = createAsyncThunk(
  'generators/fetchGenerators',
  async () => {
    const response = await fetch('/api/generators');
    return response.json();
  }
);

export const fetchHistoricalData = createAsyncThunk(
  'generators/fetchHistoricalData',
  async (nodeId) => {
    const response = await fetch(`/api/historical/${nodeId}`);
    return response.json();
  }
);

const initialState = {
  list: [],
  historicalData: {},
  realTimeData: {},
  status: 'idle',
  error: null
};

export const generatorSlice = createSlice({
  name: 'generators',
  initialState,
  reducers: {
    updateRealTimeData: (state, action) => {
      const { node_id, ...data } = action.payload;
      state.realTimeData[node_id] = {
        ...state.realTimeData[node_id],
        ...data,
        timestamp: Date.now(),
      };

      // Update historical data with real-time data
      if (state.historicalData[node_id]) {
        const energiaData = state.historicalData[node_id].data.map((dataset, index) => {
          const newData = [...dataset];
          if (newData.length > 30) newData.shift();
          
          const value = index === 0 ? data.energia?.entrada :
                       index === 1 ? data.energia?.salida :
                       data.energia?.nebula;

          if (typeof value === 'number') {
            newData.push({ x: data.timestamp, y: value });
          }
          return newData;
        });

        state.historicalData[node_id] = {
          ...state.historicalData[node_id],
          data: energiaData
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenerators.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGenerators.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchGenerators.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchHistoricalData.fulfilled, (state, action) => {
        const nodeId = action.meta.arg;
        state.historicalData[nodeId] = action.payload;
      });
  },
});

export const { updateRealTimeData } = generatorSlice.actions;

export default generatorSlice.reducer;
