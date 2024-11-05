import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

export const fetchTemperatura = createAsyncThunk('datacenter/tempertaruta', async () => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/datacenter/temperatura911`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

const datacenterSlice = createSlice({
    name: 'datacenter',
    initialState: {
        temp: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTemperatura.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.temp = action.payload;
            })
            .addCase(fetchTemperatura.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTemperatura.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export default datacenterSlice.reducer;