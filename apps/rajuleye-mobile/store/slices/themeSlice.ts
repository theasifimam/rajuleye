import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  preference: 'light' | 'dark' | 'system';
}

const initialState: ThemeState = {
  preference: 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemePreference: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.preference = action.payload;
    },
  },
});

export const { setThemePreference } = themeSlice.actions;
export default themeSlice.reducer;
