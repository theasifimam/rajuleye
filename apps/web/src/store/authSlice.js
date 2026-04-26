'use client';
import { createSlice } from '@reduxjs/toolkit';
// Rehydrate from localStorage on load
function loadState() {
    if (typeof window === 'undefined') {
        return { user: null, accessToken: null, isAuthenticated: false, isAuthDialogOpen: false };
    }
    try {
        const raw = localStorage.getItem('auth');
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                user: parsed.user ?? null,
                accessToken: parsed.accessToken ?? null,
                isAuthenticated: !!parsed.user,
                isAuthDialogOpen: false,
            };
        }
    }
    catch { /* ignore */ }
    return { user: null, accessToken: null, isAuthenticated: false, isAuthDialogOpen: false };
}
const authSlice = createSlice({
    name: 'auth',
    initialState: loadState(),
    reducers: {
        setCredentials(state, action) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            state.isAuthDialogOpen = false;
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth', JSON.stringify({ user: action.payload.user, accessToken: action.payload.accessToken }));
            }
        },
        clearCredentials(state) {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth');
            }
        },
        updateUser(state, action) {
            state.user = action.payload;
            if (typeof window !== 'undefined') {
                const raw = localStorage.getItem('auth');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    localStorage.setItem('auth', JSON.stringify({ ...parsed, user: action.payload }));
                }
            }
        },
        openAuthDialog(state) {
            state.isAuthDialogOpen = true;
        },
        closeAuthDialog(state) {
            state.isAuthDialogOpen = false;
        },
    },
});
export const { setCredentials, clearCredentials, updateUser, openAuthDialog, closeAuthDialog } = authSlice.actions;
// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthDialogOpen = (state) => state.auth.isAuthDialogOpen;
export default authSlice.reducer;
