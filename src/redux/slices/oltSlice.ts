import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

export const fetchOnus = createAsyncThunk('olt/fetchOnus', async () => { 
    const response = await axios.get(`${API_CONFIG.baseUrl}/olt/onus`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const fetch_Cliente_Onus = createAsyncThunk('olt/fetch_Cliente_onus', async () => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/olt/get_all_onus`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const rebootOnu = createAsyncThunk('olt/reboot_onu', async ({ onu, username }) => {
    const response = await axios.post(`${API_CONFIG.baseUrl}/olt/reboot_onu`, { 
        onu: onu,
        username: username
    }, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

const oltSlice = createSlice({
    name: 'olt',
    initialState: {
        onus: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOnus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.onus = action.payload;
            })
            .addCase(fetchOnus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOnus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetch_Cliente_Onus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.onus = action.payload;
            })
            .addCase(fetch_Cliente_Onus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetch_Cliente_Onus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export default oltSlice.reducer;