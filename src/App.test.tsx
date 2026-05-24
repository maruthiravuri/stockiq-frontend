import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from '@mui/material';
import { darkTheme } from './theme';
import React from 'react';

vi.mock('./hooks/useMarketWebSocket', () => ({
  useMarketWebSocket: () => ({ connected: false, subscribe: vi.fn(), quotes: {} }),
}));

vi.mock('@stomp/stompjs', () => ({
  Client: vi.fn().mockImplementation(() => ({
    activate: vi.fn(),
    deactivate: vi.fn(),
    connected: false,
  })),
}));

vi.mock('sockjs-client', () => ({ default: vi.fn() }));

vi.mock('ag-grid-react', () => ({
  AgGridReact: () => React.createElement('div', { 'data-testid': 'ag-grid-mock' }, 'AG Grid'),
}));

vi.mock('ag-grid-community/styles/ag-grid.css', () => ({}));
vi.mock('ag-grid-community/styles/ag-theme-balham.css', () => ({}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  React.createElement(Provider, { store },
    React.createElement(ThemeProvider, { theme: darkTheme }, children)
  )
);

import Sidebar from './components/layout/Sidebar';
import { fmtPrice, fmtPct, fmtLargeNum, fmtVolume, fmtChange } from './utils/format';
import { setActiveTab, toggleSidebar, toggleTheme } from './store';

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
    expect(fmtVolume(500_000)).toBe('500K');
  });

  test('fmtChange shows sign and currency', () => {
    expect(fmtChange(3.45)).toBe('+$3.45');
    expect(fmtChange(-2.10)).toBe('-$2.10');
  });
});

describe('Redux store', () => {
  test('initial activeTab is mag7', () => {
    expect(store.getState().ui.activeTab).toBe('mag7');
  });

  test('setActiveTab updates correctly', () => {
    store.dispatch(setActiveTab('crypto'));
    expect(store.getState().ui.activeTab).toBe('crypto');
    store.dispatch(setActiveTab('mag7'));
  });

  test('toggleTheme switches modes', () => {
    const initial = store.getState().ui.theme;
    store.dispatch(toggleTheme());
    expect(store.getState().ui.theme).not.toBe(initial);
    store.dispatch(toggleTheme());
  });

  test('toggleSidebar flips state', () => {
    const initial = store.getState().ui.sidebarOpen;
    store.dispatch(toggleSidebar());
    expect(store.getState().ui.sidebarOpen).toBe(!initial);
    store.dispatch(toggleSidebar());
  });
});

describe('Sidebar', () => {
  test('renders nav items when open', () => {
    render(React.createElement(TestWrapper, null,
      React.createElement(Sidebar, { open: true })
    ));
    expect(screen.getByText('Magnificent 7')).toBeDefined();
    expect(screen.getByText('Crypto Top 5')).toBeDefined();
    expect(screen.getByText('My Portfolio')).toBeDefined();
  });

  test('renders brand when open', () => {
    render(React.createElement(TestWrapper, null,
      React.createElement(Sidebar, { open: true })
    ));
    expect(screen.getByText('STOCKIQ')).toBeDefined();
  });
});
