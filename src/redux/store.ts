import { configureStore } from '@reduxjs/toolkit';
import camarasReducer from './slices/camarasSlice';
import oltReducer from './slices/oltSlice';
import userReducer from './slices/userSlice';
import gruposReducer from './slices/gruposSlice';
import sbsReducer from './slices/sbsSlice';
import onuReducer from './slices/onuSlice';
import neo4jReducer from './slices/neo4jSlice';
import datacenterSlice from './slices/datacenterSlice';

export const store = configureStore({
  reducer: {
    camaras: camarasReducer,
    olt: oltReducer,
    users: userReducer,
    grupos: gruposReducer,
    sbs: sbsReducer,
    onus: onuReducer,
    neo4j: neo4jReducer,
    datacenter: datacenterSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;