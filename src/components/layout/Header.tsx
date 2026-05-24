import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, InputBase, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, toggleSidebar, toggleTheme } from '../../store';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((s: RootState) => s.ui.theme);

  return (
    <AppBar position="static" elevation={0} sx={{
      bgcolor: theme === 'dark' ? '#080C17' : '#FFFFFF',
      borderBottom: '1px solid', borderColor: 'divider', zIndex: 10,
    }}>
      <Toolbar variant="dense" sx={{ minHeight: 48, gap: 1 }}>
        <IconButton size="small" onClick={() => dispatch(toggleSidebar())} sx={{ color: 'text.secondary' }}>
          <MenuIcon fontSize="small" />
        </IconButton>

        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          bgcolor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          borderRadius: 1.5, px: 1.5, py: 0.5, flex: 1, maxWidth: 360,
        }}>
          <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <InputBase placeholder="Search symbol, name..." sx={{ fontSize: '0.8rem', color: 'text.primary', flex: 1 }} />
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={() => dispatch(toggleTheme())} sx={{ color: 'text.secondary' }}>
            {theme === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <NotificationsNoneIcon fontSize="small" />
          </IconButton>
          <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.7rem', color: '#000', fontWeight: 700 }}>M</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
