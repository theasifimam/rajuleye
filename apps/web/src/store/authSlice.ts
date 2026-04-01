'use client';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IAddress {
  _id?: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  mobile: string;
  isDefault: boolean;
}

export interface IEyePower {
  left: {
    sphere?: number;
    cylinder?: number;
    axis?: number;
    addition?: number;
    pd?: number;
  };
  right: {
    sphere?: number;
    cylinder?: number;
    axis?: number;
    addition?: number;
    pd?: number;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  mobile?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  addresses?: IAddress[];
  eyePower?: IEyePower;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthDialogOpen: boolean;
}

// Rehydrate from localStorage on load
function loadState(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, accessToken: null, isAuthenticated: false, isAuthDialogOpen: false };
  }
  try {
    const raw = localStorage.getItem('auth');
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AuthState>;
      return {
        user: parsed.user ?? null,
        accessToken: parsed.accessToken ?? null,
        isAuthenticated: !!parsed.user,
        isAuthDialogOpen: false,
      };
    }
  } catch { /* ignore */ }
  return { user: null, accessToken: null, isAuthenticated: false, isAuthDialogOpen: false };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadState(),
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: AuthUser; accessToken: string }>) {
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
    updateUser(state, action: PayloadAction<AuthUser>) {
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
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectIsAuthDialogOpen = (state: { auth: AuthState }) => state.auth.isAuthDialogOpen;

export default authSlice.reducer;
