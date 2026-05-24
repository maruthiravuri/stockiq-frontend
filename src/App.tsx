import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { store, RootState } from './store';
import { darkTheme, lightTheme } from './theme';
import Header from './components/layout/Header';
import MarketBar from './components/layout/MarketBar';
import Sidebar from './components/layout/Sidebar';
import Mag7Tab from './components/research/Mag7Tab';
import { SP100Tab, SP500ValueTab, BuffettTab, AITab, MetalsTab, CryptoTab } from './components/research/ResearchTabs';
import PortfolioTab from './components/portfolio/PortfolioTab';
import WatchlistTab from './components/portfolio/WatchlistTab';
import AllocationTab from './components/portfolio/AllocationTab';

const TAB_MAP: Record<string, React.ReactNode> = {
  mag7: <Mag7Tab />,
  sp100: <SP100Tab />,
  sp500value: <SP500ValueTab />,
  buffett: <BuffettTab />,
  ai: <AITab />,
  metals: <MetalsTab />,
  crypto: <CryptoTab />,
  portfolio: <PortfolioTab />,
  watchlist: <WatchlistTab />,
  allocation: <AllocationTab />,
};

const AppInner: React.FC = () => {
  const uiTheme = useSelector((s: RootState) => s.ui.theme);
  const activeTab = useSelector((s: RootState) => s.ui.activeTab);
  const sidebarOpen = useSelector((s: RootState) => s.ui.sidebarOpen);

  return (
    <ThemeProvider theme={uiTheme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <AppInner />
  </Provider>
);

export default App;
