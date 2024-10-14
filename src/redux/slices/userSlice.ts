import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../config/apiConfig';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/user/usersall`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
    const response = await axios.post(`${API_CONFIG.baseUrl}/user/users`, newUser, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async (updatedUser) => {
    const response = await axios.put(`${API_CONFIG.baseUrl}/user/users/${updatedUser.id}`, updatedUser, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
    await axios.delete(`${API_CONFIG.baseUrl}/user/users/${userId}`, {
        auth: API_CONFIG.auth
    });
    return userId;
});

export const fetchActiveSessions = createAsyncThunk('users/fetchActiveSessions', async () => {
    const response = await axios.get(`${API_CONFIG.baseUrl}/user/active_sessions`, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const createSession = createAsyncThunk('users/createSession', async (sessionData) => {
    const response = await axios.post(`${API_CONFIG.baseUrl}/user/active_sessions`, sessionData, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

export const deleteSession = createAsyncThunk('users/deleteSession', async (token) => {
    await axios.delete(`${API_CONFIG.baseUrl}/user/active_sessions/${token}`, {
        auth: API_CONFIG.auth
    });
    return token;
});

export const logLogin = createAsyncThunk('users/logLogin', async (logData) => {
    const response = await axios.post(`${API_CONFIG.baseUrl}/user/login_logs`, logData, {
        auth: API_CONFIG.auth
    });
    return response.data;
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        activeSessions: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload);
            })
            .addCase(fetchActiveSessions.fulfilled, (state, action) => {
                state.activeSessions = action.payload;
            })
            .addCase(createSession.fulfilled, (state, action) => {
                state.activeSessions.push(action.payload);
            })
            .addCase(deleteSession.fulfilled, (state, action) => {
                state.activeSessions = state.activeSessions.filter(session => session.token !== action.payload);
            })
            .addCase(logLogin.fulfilled, (state, action) => {
                // Manejar el registro de inicio de sesión si es necesario
            });
    },
});

export default userSlice.reducer;