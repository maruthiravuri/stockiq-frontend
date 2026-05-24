import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// ── UI Slice (theme, sidebar, active tab) ─────────────────────────────────────
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    activeTab: 'mag7',
    theme: 'dark' as 'dark' | 'light',
    selectedSymbol: null as string | null,
  },
  reducers: {
    toggleSidebar: state => { state.sidebarOpen = !state.sidebarOpen; },
    setActiveTab: (state, action: PayloadAction<string>) => { state.activeTab = action.payload; },
    toggleTheme: state => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; },
    setSelectedSymbol: (state, action: PayloadAction<string | null>) => { state.selectedSymbol = action.payload; },
  },
});

export const store = configureStore({
  reducer: { ui: uiSlice.reducer },
});

export const { toggleSidebar, setActiveTab, toggleTheme, setSelectedSymbol } = uiSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
