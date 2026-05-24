import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Portfolio, PortfolioHolding, Watchlist, WatchlistItem } from '../types';

// ── Portfolio Slice ──────────────────────────────────────────────────────────
const defaultPortfolio: Portfolio = {
  id: 'p1',
  name: 'My Portfolio',
  description: 'Main investment portfolio',
  createdAt: new Date().toISOString(),
  holdings: [
    { id: 'h1', symbol: 'VOO', name: 'Vanguard S&P 500 ETF', quantity: 25, avgCostBasis: 398.50, currentPrice: 468.23, sector: 'Blend', assetType: 'etf', purchaseDate: '2023-01-15' },
    { id: 'h2', symbol: 'NVDA', name: 'NVIDIA Corp.', quantity: 15, avgCostBasis: 312.40, currentPrice: 495.22, sector: 'Technology', assetType: 'stock', purchaseDate: '2023-03-10' },
    { id: 'h3', symbol: 'GLD', name: 'SPDR Gold Shares', quantity: 40, avgCostBasis: 168.20, currentPrice: 187.34, sector: 'Commodities', assetType: 'etf', purchaseDate: '2023-06-01' },
    { id: 'h4', symbol: 'AAPL', name: 'Apple Inc.', quantity: 30, avgCostBasis: 152.30, currentPrice: 189.84, sector: 'Technology', assetType: 'stock', purchaseDate: '2022-11-20' },
    { id: 'h5', symbol: 'SCHD', name: 'Schwab US Dividend ETF', quantity: 50, avgCostBasis: 72.40, currentPrice: 78.54, sector: 'Dividend', assetType: 'etf', purchaseDate: '2023-02-14' },
    { id: 'h6', symbol: 'XLE', name: 'Energy Select SPDR', quantity: 35, avgCostBasis: 83.20, currentPrice: 91.47, sector: 'Energy', assetType: 'etf', purchaseDate: '2023-07-08' },
  ],
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    portfolios: [defaultPortfolio] as Portfolio[],
    activePortfolioId: 'p1',
  },
  reducers: {
    addPortfolio: (state, action: PayloadAction<Portfolio>) => {
      state.portfolios.push(action.payload);
    },
    setActivePortfolio: (state, action: PayloadAction<string>) => {
      state.activePortfolioId = action.payload;
    },
    addHolding: (state, action: PayloadAction<{ portfolioId: string; holding: PortfolioHolding }>) => {
      const p = state.portfolios.find(p => p.id === action.payload.portfolioId);
      if (p) p.holdings.push(action.payload.holding);
    },
    removeHolding: (state, action: PayloadAction<{ portfolioId: string; holdingId: string }>) => {
      const p = state.portfolios.find(p => p.id === action.payload.portfolioId);
      if (p) p.holdings = p.holdings.filter(h => h.id !== action.payload.holdingId);
    },
    updateHoldingPrice: (state, action: PayloadAction<{ symbol: string; price: number }>) => {
      state.portfolios.forEach(p => {
        p.holdings.forEach(h => {
          if (h.symbol === action.payload.symbol) h.currentPrice = action.payload.price;
        });
      });
    },
  },
});

// ── Watchlist Slice ──────────────────────────────────────────────────────────
const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    watchlists: [
      {
        id: 'w1', name: 'Tech Watchlist', createdAt: new Date().toISOString(),
        items: [
          { symbol: 'MSFT', name: 'Microsoft Corp.', addedAt: new Date().toISOString() },
          { symbol: 'AMD', name: 'Advanced Micro Devices', addedAt: new Date().toISOString() },
          { symbol: 'PLTR', name: 'Palantir Technologies', addedAt: new Date().toISOString() },
        ],
      },
    ] as Watchlist[],
  },
  reducers: {
    addToWatchlist: (state, action: PayloadAction<{ watchlistId: string; item: WatchlistItem }>) => {
      const wl = state.watchlists.find(w => w.id === action.payload.watchlistId);
      if (wl && !wl.items.find(i => i.symbol === action.payload.item.symbol)) {
        wl.items.push(action.payload.item);
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<{ watchlistId: string; symbol: string }>) => {
      const wl = state.watchlists.find(w => w.id === action.payload.watchlistId);
      if (wl) wl.items = wl.items.filter(i => i.symbol !== action.payload.symbol);
    },
    createWatchlist: (state, action: PayloadAction<Watchlist>) => {
      state.watchlists.push(action.payload);
    },
  },
});

// ── UI Slice ─────────────────────────────────────────────────────────────────
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    activeTab: 'mag7',
    theme: 'dark' as 'dark' | 'light',
    selectedSymbol: null as string | null,
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setActiveTab: (state, action: PayloadAction<string>) => { state.activeTab = action.payload; },
    toggleTheme: (state) => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; },
    setSelectedSymbol: (state, action: PayloadAction<string | null>) => { state.selectedSymbol = action.payload; },
  },
});

export const store = configureStore({
  reducer: {
    portfolio: portfolioSlice.reducer,
    watchlist: watchlistSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export const { addPortfolio, setActivePortfolio, addHolding, removeHolding, updateHoldingPrice } = portfolioSlice.actions;
export const { addToWatchlist, removeFromWatchlist, createWatchlist } = watchlistSlice.actions;
export const { toggleSidebar, setActiveTab, toggleTheme, setSelectedSymbol } = uiSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
