import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeAlerts: [], // Changed from Set to array
  notifications: [],
};

export const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action) => {
      const { id, message, type } = action.payload;
      state.notifications.push({ id, message, type });
    },
    removeAlert: (state, action) => {
      state.notifications = state.notifications.filter(
        alert => alert.id !== action.payload
      );
    },
    setActiveAlert: (state, action) => {
      if (!state.activeAlerts.includes(action.payload)) {
        state.activeAlerts.push(action.payload);
      }
    },
    removeActiveAlert: (state, action) => {
      state.activeAlerts = state.activeAlerts.filter(
        alertId => alertId !== action.payload
      );
    },
  },
});

export const { addAlert, removeAlert, setActiveAlert, removeActiveAlert } = alertSlice.actions;

export default alertSlice.reducer;
