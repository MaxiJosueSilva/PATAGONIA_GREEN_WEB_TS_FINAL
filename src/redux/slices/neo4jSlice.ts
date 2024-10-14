import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Datos simulados para demostración
const simulatedData = {
  nodeData: [
    {"id":"OLT 2","group":1},
    {"id":"J7-C02","group":1},
    {"id":"Unnamed","group":1}
  ],
  nodeLinks: [
    {"source":"J7-C02","target":"OLT 2","value":1},
    {"source":"Unnamed","target":"OLT 2","value":1}
  ]
};

export const fetchNodes = createAsyncThunk(
  'neo4j/fetchNodes',
  async () => {
    // Simulando una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => resolve(simulatedData), 1000);
    });
  }
);

const neo4jSlice = createSlice({
  name: 'neo4j',
  initialState: {
    nodes: {
      nodeData: [],
      nodeLinks: []
    },
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNodes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nodes = action.payload;
      })
      .addCase(fetchNodes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default neo4jSlice.reducer;