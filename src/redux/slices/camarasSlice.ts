import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

// Thunks asíncronos para las consultas
export const fetchCamaras = createAsyncThunk('camaras/fetchCamaras', async () => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/camara/camarasall`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const fetchFormCamaras = createAsyncThunk('camaras/fetchFormCamaras', async () => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/camara/get_form_camaras`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const fetchHistorialCamara = createAsyncThunk('camaras/fetchHistorialCamara', async (camaraId) => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/camara/get_historial_camaras/${camaraId}`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const fetchCamaraById = createAsyncThunk('camaras/fetchCamaraById', async (camaraId) => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/camara/getcamara/${camaraId}`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const addCamara = createAsyncThunk('camaras/addCamara', async (newCamara) => {
    const response = await axios.post(`${API_CONFIG.baseUrl}/camara/add_camara`, newCamara, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const updateCamara = createAsyncThunk('camaras/updateCamara', async (updatedCamara) => {
    const response = await axios.put(`${API_CONFIG.baseUrl}/camara/update_camara/${updatedCamara.id}`, updatedCamara, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const deleteCamara = createAsyncThunk('camaras/deleteCamara', async (camaraId) => {
    await axios.delete(`${API_CONFIG.baseUrl}/camara/delete_camara/${camaraId}`, {
        auth: API_CONFIG.auth
    });
    return camaraId;
});

// Slice de cámaras
const camarasSlice = createSlice({
    name: 'camaras',
    initialState: {
        camaras: [],
        formCamaras: [],
        historialCamara: [],
        camaraSeleccionada: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCamaras.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCamaras.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.camaras = action.payload;
            })
            .addCase(fetchCamaras.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchFormCamaras.fulfilled, (state, action) => {
                state.formCamaras = action.payload;
            })
            .addCase(fetchHistorialCamara.fulfilled, (state, action) => {
                state.historialCamara = action.payload;
            })
            .addCase(fetchCamaraById.fulfilled, (state, action) => {
                state.camaraSeleccionada = action.payload;
            })
            .addCase(addCamara.fulfilled, (state, action) => {
                state.camaras.push(action.payload);
            })
            .addCase(updateCamara.fulfilled, (state, action) => {
                const index = state.camaras.findIndex(camara => camara.id === action.payload.id);
                if (index !== -1) {
                    state.camaras[index] = action.payload;
                }
            })
            .addCase(deleteCamara.fulfilled, (state, action) => {
                state.camaras = state.camaras.filter(camara => camara.id !== action.payload);
            });
    },
});

export default camarasSlice.reducer;