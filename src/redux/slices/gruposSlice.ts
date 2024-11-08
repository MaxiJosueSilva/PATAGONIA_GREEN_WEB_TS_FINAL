import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Configuración unificada para la IP, usuario y contraseña
const ipUnificada = 'http://172.40.20.114:2880';
const usuario = '911';
const contraseña = '911-System';

// Thunks asíncronos para las consultas
export const fetchSBS1 = createAsyncThunk('grupos/fetchSBS1', async () => {
    const response = await axios.get(`${ipUnificada}/grupos/historial_sbs_1`, {
        auth: {
            username: usuario,
            password: contraseña
        }
    });
    return response.data;
});

export const fetchSBS2 = createAsyncThunk('grupos/fetchSBS2', async () => {
    const response = await axios.get(`${ipUnificada}/grupos/historial_sbs_2`, {
        auth: {
            username: usuario,
            password: contraseña
        }
    });
    return response.data;
});

export const fetchSBS3 = createAsyncThunk('grupos/fetchSBS3', async () => {
    const response = await axios.get(`${ipUnificada}/grupos/historial_sbs_3`, {
        auth: {
            username: usuario,
            password: contraseña
        }
    });
    return response.data;
});

export const fetchSBS911 = createAsyncThunk('grupos/fetchSBS911', async () => {
    const response = await axios.get(`${ipUnificada}/grupos/historial_sbs_911`, {
        auth: {
            username: usuario,
            password: contraseña
        }
    });
    return response.data;
});

export const fetchLocations = createAsyncThunk('grupos/fetchLocations', async () => {
    const response = await axios.get(`${ipUnificada}/grupos/locations`, {
        auth: {
            username: usuario,
            password: contraseña
        }
    });
    return response.data;
});

export const getHistorial = createAsyncThunk('grupos/getHistorial', async (id) => {
    const response = await axios.get(`${ipUnificada}/grupos/gethistorial/${id}`, {
        auth: {
            username: usuario,
            password: contraseña
        }
    });
    return response.data[0];
});



const gruposSlice = createSlice({
    name: 'grupos',
    initialState: {
        sbs1: [],
        sbs2: [],
        sbs3: [],
        sbs911: [],
        locations: [],
        historial: [],
        historicalData: {},
        realTimeData: {},
        status: 'idle',
        error: null,
    },
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
            .addCase(fetchSBS1.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sbs1 = action.payload;
            })
            .addCase(fetchSBS1.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSBS1.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchSBS2.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sbs2 = action.payload;
            })
            .addCase(fetchSBS2.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSBS2.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchSBS3.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sbs3 = action.payload;
            })
            .addCase(fetchSBS3.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSBS3.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchSBS911.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sbs911 = action.payload;
            })
            .addCase(fetchSBS911.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSBS911.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchLocations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.locations = action.payload;
            })
            .addCase(fetchLocations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLocations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getHistorial.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.historial = action.payload;
            })
            .addCase(getHistorial.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getHistorial.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});
export const { updateRealTimeData } = gruposSlice.actions;

export default gruposSlice.reducer;