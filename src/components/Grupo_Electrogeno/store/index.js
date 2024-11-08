import { configureStore } from '@reduxjs/toolkit';
import generatorReducer from './generatorSlice';
import alertReducer from './alertSlice';
import selectedNodeReducer from './selectedNodeSlice';

export const store = configureStore({
  reducer: {
    generators: generatorReducer,
    alerts: alertReducer,
    selectedNode: selectedNodeReducer,
  },
});
