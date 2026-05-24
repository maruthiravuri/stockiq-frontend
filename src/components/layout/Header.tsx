import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, toggleSidebar, toggleTheme } from '../../store';
import SearchPanel from '../search/SearchPanel';
import WebSocketStatus from '../common/WebSocketStatus';
import { useMarketWebSocket } from '../../hooks/useMarketWebSocket';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((s: RootState) => s.ui.theme);
  const { connected } = useMarketWebSocket();

  return (
    <AppBar position="static" elevation={0} sx={{
      bgcolor: theme === 'dark' ? '#080C17' : '#FFFFFF',
      borderBottom: '1px solid', borderColor: 'divider', zIndex: 10,
    }}>
      <Toolbar variant="dense" sx={{ minHeight: 48, gap: 1 }}>
        <IconButton size="small" onClick={() => dispatch(toggleSidebar())} sx={{ color: 'text.secondary' }}>
          <MenuIcon fontSize="small" />
        </IconButton>

        <SearchPanel />

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <WebSocketStatus connected={connected} />
          <IconButton size="small" onClick={() => dispatch(toggleTheme())} sx={{ color: 'text.secondary' }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
          <IconButton size="small" sx={{ color: 'text.secondary' }} aria-label="notifications">
            <NotificationsNoneIcon fontSize="small" />
          </IconButton>
          <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.7rem', color: '#000', fontWeight: 700 }}>M</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
