import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

export const fetchSBS = createAsyncThunk('sbs/fetchSBS', async () => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/sbs/historial_sbs`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const fetchSIP = createAsyncThunk('sbs/fetchSIP', async () => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/sbs/historial_sip`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const fetchBAL = createAsyncThunk('sbs/fetchBAL', async () => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/sbs/historial_bal`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

const sbsSlice = createSlice({
    name: 'sbs',
    initialState: {
        sbs: [],
        sip: [],
        bal: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSBS.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sbs = action.payload;
            })
            .addCase(fetchSBS.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSBS.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchSIP.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sip = action.payload;
            })
            .addCase(fetchSIP.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSIP.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchBAL.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bal = action.payload;
            })
            .addCase(fetchBAL.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBAL.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default sbsSlice.reducer;