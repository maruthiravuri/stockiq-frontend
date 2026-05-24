import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Avatar, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, toggleSidebar, toggleTheme } from '../../store';
import SearchPanel from '../search/SearchPanel';
import WebSocketStatus from '../common/WebSocketStatus';
import { useMarketWebSocket } from '../../hooks/useMarketWebSocket';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((s: RootState) => s.ui.theme);
  const { connected } = useMarketWebSocket();
  const { user, logout } = useAuth();

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'U';

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
          {user && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
              {user.username}
            </Typography>
          )}
          <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.65rem', color: '#000', fontWeight: 700, cursor: 'pointer' }}>
            {initials}
          </Avatar>
          <Tooltip title="Sign out">
            <IconButton size="small" onClick={logout} sx={{ color: 'text.secondary' }} aria-label="sign out">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
