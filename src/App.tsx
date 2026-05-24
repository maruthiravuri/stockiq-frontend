import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { store, RootState } from './store';
import { darkTheme, lightTheme } from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import MarketBar from './components/layout/MarketBar';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './components/auth/LoginPage';
import Mag7Tab from './components/research/Mag7Tab';
import { SP100Tab, SP500ValueTab, BuffettTab, AITab, MetalsTab, CryptoTab } from './components/research/ResearchTabs';
import PortfolioTabV2 from './components/portfolio/PortfolioTabV2';
import WatchlistTabV2 from './components/portfolio/WatchlistTabV2';
import AllocationTab from './components/portfolio/AllocationTab';
import ScreenerTab from './components/screener/ScreenerTab';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const TAB_MAP: Record<string, React.ReactNode> = {
  mag7: <Mag7Tab />,
  sp100: <SP100Tab />,
  sp500value: <SP500ValueTab />,
  buffett: <BuffettTab />,
  ai: <AITab />,
  metals: <MetalsTab />,
  crypto: <CryptoTab />,
  screener: <ScreenerTab />,
  portfolio: <PortfolioTabV2 />,
  watchlist: <WatchlistTabV2 />,
  allocation: <AllocationTab />,
};

const AppShell: React.FC = () => {
  const uiTheme = useSelector((s: RootState) => s.ui.theme);
  const activeTab = useSelector((s: RootState) => s.ui.activeTab);
  const sidebarOpen = useSelector((s: RootState) => s.ui.sidebarOpen);
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={uiTheme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {!isAuthenticated ? (
        <LoginPage />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <Header />
          <MarketBar />
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <Sidebar open={sidebarOpen} />
            <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {TAB_MAP[activeTab] ?? <Mag7Tab />}
            </Box>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
