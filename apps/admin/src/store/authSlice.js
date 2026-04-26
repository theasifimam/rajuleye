'use client';
import { createSlice } from '@reduxjs/toolkit';
function loadState() {
    if (typeof window === 'undefined') {
        return {
            user: null, accessToken: null, isAuthenticated: false,
        };
    }
    try {
        const raw = localStorage.getItem('admin_auth');
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                user: parsed.user ?? null,
                accessToken: parsed.accessToken ?? null,
                isAuthenticated: !!parsed.user,
            };
        }
    }
    catch { /* ignore */ }
    return {
        user: null, accessToken: null, isAuthenticated: false,
    };
}
const authSlice = createSlice({
    name: 'auth',
    initialState: loadState(),
    reducers: {
        setCredentials(state, action) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            if (typeof window !== 'undefined') {
                localStorage.setItem('admin_auth', JSON.stringify({
                    user: action.payload.user,
                    accessToken: action.payload.accessToken
                }));
            }
        },
        clearCredentials(state) {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('admin_auth');
            }
        },
    },
});
export const { setCredentials, clearCredentials } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export default authSlice.reducer;
