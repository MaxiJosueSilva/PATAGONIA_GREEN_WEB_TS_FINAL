import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

export const fetchCpu = createAsyncThunk('utils/fetchCpu', async () => { 
    const response = await axios.get(`${API_CONFIG.baseUrl}/utils/cpu`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

const utilsSlice = createSlice({
    name: 'utils',
    initialState: {
        cpu: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCpu.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cpu = action.payload;
            })
            .addCase(fetchCpu.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCpu.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            
    },
});

export default utilsSlice.reducer;