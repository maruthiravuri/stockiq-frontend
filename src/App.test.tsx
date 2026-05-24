import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from '@mui/material';
import { darkTheme } from './theme';

// Minimal wrapper for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>
    <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
  </Provider>
);

// Mock SockJS/STOMP to avoid WebSocket connection in tests
jest.mock('./hooks/useMarketWebSocket', () => ({
  useMarketWebSocket: () => ({ connected: false, subscribe: jest.fn(), quotes: {} }),
}));

jest.mock('@stomp/stompjs', () => ({
  Client: jest.fn().mockImplementation(() => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
    connected: false,
  })),
}));

jest.mock('sockjs-client', () => jest.fn());

// Mock AG Grid to avoid canvas/DOM issues in jsdom
jest.mock('ag-grid-react', () => ({
  AgGridReact: () => <div data-testid="ag-grid-mock">AG Grid</div>,
}));
jest.mock('ag-grid-community/styles/ag-grid.css', () => ({}));
jest.mock('ag-grid-community/styles/ag-theme-balham.css', () => ({}));

import Sidebar from './components/layout/Sidebar';
import MarketBar from './components/layout/MarketBar';
import { fmtPrice, fmtPct, fmtLargeNum, fmtVolume, fmtChange } from './utils/format';

// ── Utility function unit tests ───────────────────────────────────────────────
describe('format utilities', () => {
  test('fmtPrice formats USD correctly', () => {
    expect(fmtPrice(1234.56)).toBe('$1,234.56');
    expect(fmtPrice(0)).toBe('$0.00');
  });

  test('fmtPct formats with sign', () => {
    expect(fmtPct(2.5)).toBe('+2.50%');
    expect(fmtPct(-1.3)).toBe('-1.30%');
  });

  test('fmtLargeNum abbreviates correctly', () => {
    expect(fmtLargeNum(1_500_000_000_000)).toBe('$1.50T');
    expect(fmtLargeNum(2_400_000_000)).toBe('$2.40B');
    expect(fmtLargeNum(3_200_000)).toBe('$3.20M');
  });

  test('fmtVolume abbreviates correctly', () => {
    expect(fmtVolume(45_000_000)).toBe('45.0M');
    expect(fmtVolume(1_200_000)).toBe('1.2M');
    expect(fmtVolume(500_000)).toBe('500K');
  });

  test('fmtChange shows sign and currency', () => {
    expect(fmtChange(3.45)).toBe('+$3.45');
    expect(fmtChange(-2.10)).toBe('-$2.10');
  });
});

// ── Redux store tests ─────────────────────────────────────────────────────────
import { setActiveTab, toggleSidebar, toggleTheme } from './store';

describe('Redux store', () => {
  test('initial activeTab is mag7', () => {
    expect(store.getState().ui.activeTab).toBe('mag7');
  });

  test('setActiveTab updates correctly', () => {
    store.dispatch(setActiveTab('crypto'));
    expect(store.getState().ui.activeTab).toBe('crypto');
    store.dispatch(setActiveTab('mag7')); // reset
  });

  test('toggleTheme switches between dark and light', () => {
    const initial = store.getState().ui.theme;
    store.dispatch(toggleTheme());
    expect(store.getState().ui.theme).not.toBe(initial);
    store.dispatch(toggleTheme()); // reset
  });

  test('toggleSidebar flips open state', () => {
    const initial = store.getState().ui.sidebarOpen;
    store.dispatch(toggleSidebar());
    expect(store.getState().ui.sidebarOpen).toBe(!initial);
    store.dispatch(toggleSidebar()); // reset
  });
});

// ── Sidebar component test ────────────────────────────────────────────────────
describe('Sidebar', () => {
  test('renders nav items when open', () => {
    render(
      <TestWrapper>
        <Sidebar open={true} />
      </TestWrapper>
    );
    expect(screen.getByText('Magnificent 7')).toBeInTheDocument();
    expect(screen.getByText('Crypto Top 5')).toBeInTheDocument();
    expect(screen.getByText('My Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Screener')).toBeInTheDocument();
  });

  test('renders STOCKIQ brand when open', () => {
    render(
      <TestWrapper>
        <Sidebar open={true} />
      </TestWrapper>
    );
    expect(screen.getByText('STOCKIQ')).toBeInTheDocument();
  });
});
