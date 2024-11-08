import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodeId: 'SBS-1',
};

export const selectedNodeSlice = createSlice({
  name: 'selectedNode',
  initialState,
  reducers: {
    setSelectedNode: (state, action) => {
      state.nodeId = action.payload;
    },
  },
});

export const { setSelectedNode } = selectedNodeSlice.actions;

export default selectedNodeSlice.reducer;
