import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Datos estáticos de ONUs
const initialOnus = [
  {
    serial_number: "UBNT29f5b57a",
    name: "ONU-001",
    olt: "OLT-1",
    mac_address: "18:e8:29:f6:b5:7a",
    firmware_version: "v3.1.2",
    connection_time: "279653",
    online: "true",
    optics: {
      tx_power_onu: "1.67dBm",
      rx_power_onu: "-15.75dBm"
    },
    distance: "3746",
    port: {
      "1": { speed: "1000-full-duplex" },
      "2": { speed: "100-full-duplex" },
      "3": { speed: "unknown" },
      "4": { speed: "unknown" }
    }
  },
  {
    serial_number: "UBNT29f5b58b",
    name: "ONU-002",
    olt: "OLT-2",
    mac_address: "18:e8:29:f6:b5:8b",
    firmware_version: "v3.1.3",
    connection_time: "180000",
    online: "true",
    optics: {
      tx_power_onu: "1.55dBm",
      rx_power_onu: "-16.20dBm"
    },
    distance: "3500",
    port: {
      "1": { speed: "1000-full-duplex" },
      "2": { speed: "unknown" },
      "3": { speed: "unknown" },
      "4": { speed: "unknown" }
    }
  }
];

export const fetchOnus = createAsyncThunk(
  'onus/fetchOnus',
  async () => {
    // Simulamos una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => resolve(initialOnus), 1000);
    });
  }
);

export const rebootOnu = createAsyncThunk(
  'onus/rebootOnu',
  async ({ onu, username }) => {
    // Simulamos un reinicio de ONU
    console.log(`Reiniciando la ONU ${onu.serial_number} por el usuario ${username}`);
    return onu.serial_number;
  }
);

const onuSlice = createSlice({
  name: 'onus',
  initialState: {
    onus: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOnus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.onus = action.payload;
      })
      .addCase(fetchOnus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(rebootOnu.fulfilled, (state, action) => {
        const index = state.onus.findIndex(onu => onu.serial_number === action.payload);
        if (index !== -1) {
          state.onus[index].connection_time = "0";
        }
      });
  }
});

export default onuSlice.reducer;