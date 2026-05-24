import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setActiveTab } from '../../store';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DiamondIcon from '@mui/icons-material/Diamond';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PieChartIcon from '@mui/icons-material/PieChart';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const NAV_ITEMS = [
  { id: 'mag7', label: 'Magnificent 7', icon: <AutoGraphIcon fontSize="small" />, group: 'Research' },
  { id: 'sp100', label: 'S&P 100 Movers', icon: <BarChartIcon fontSize="small" />, group: 'Research' },
  { id: 'sp500value', label: 'S&P 500 Value', icon: <TrendingUpIcon fontSize="small" />, group: 'Research' },
  { id: 'buffett', label: 'Buffett Portfolio', icon: <WorkspacePremiumIcon fontSize="small" />, group: 'Research' },
  { id: 'ai', label: 'AI Stocks & ETFs', icon: <PsychologyIcon fontSize="small" />, group: 'Research' },
  { id: 'metals', label: 'Metals ETFs', icon: <DiamondIcon fontSize="small" />, group: 'Research' },
  { id: 'crypto', label: 'Crypto Top 5', icon: <CurrencyBitcoinIcon fontSize="small" />, group: 'Research' },
  { id: 'screener', label: 'Screener', icon: <FilterAltIcon fontSize="small" />, group: 'Research' },
  { id: 'portfolio', label: 'My Portfolio', icon: <AccountBalanceWalletIcon fontSize="small" />, group: 'Portfolio' },
  { id: 'watchlist', label: 'Watchlist', icon: <StarBorderIcon fontSize="small" />, group: 'Portfolio' },
  { id: 'allocation', label: 'Allocation', icon: <PieChartIcon fontSize="small" />, group: 'Portfolio' },
];

const Sidebar: React.FC<{ open: boolean }> = ({ open }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector((s: RootState) => s.ui.activeTab);
  const groups = Array.from(new Set(NAV_ITEMS.map(i => i.group)));

  return (
    <Box sx={{
      width: open ? 200 : 56, minWidth: open ? 200 : 56, transition: 'width 0.2s, min-width 0.2s',
      height: '100%', display: 'flex', flexDirection: 'column',
      borderRight: '1px solid', borderColor: 'divider',
      background: theme => theme.palette.mode === 'dark' ? '#080C17' : '#FFFFFF',
      overflow: 'hidden',
    }}>
      <Box sx={{ p: open ? 2 : 1, display: 'flex', alignItems: 'center', gap: 1, minHeight: 52 }}>
        <AutoGraphIcon sx={{ color: 'primary.main', fontSize: 22 }} />
        {open && <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>STOCKIQ</Typography>}
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        {groups.map(group => (
          <Box key={group}>
            {open && (
              <Typography variant="caption" sx={{ px: 2, py: 0.5, display: 'block', color: 'text.secondary', letterSpacing: 2, textTransform: 'uppercase' }}>
                {group}
              </Typography>
            )}
            <List dense disablePadding>
              {NAV_ITEMS.filter(i => i.group === group).map(item => (
                <Tooltip key={item.id} title={!open ? item.label : ''} placement="right">
                  <ListItemButton
                    selected={activeTab === item.id}
                    onClick={() => dispatch(setActiveTab(item.id))}
                    sx={{
                      minHeight: 38, px: open ? 2 : 1.5, justifyContent: open ? 'flex-start' : 'center',
                      borderRadius: '0 20px 20px 0', mx: 0.5, mb: 0.25,
                      '&.Mui-selected': {
                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(0,212,170,0.12)' : 'rgba(0,102,204,0.08)',
                        borderRight: '2px solid', borderColor: 'primary.main',
                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                      },
                      '&:hover': { bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: open ? 32 : 'auto', color: 'text.secondary', fontSize: 18 }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText primary={item.label} slotProps={{ primary: { variant: 'body2', noWrap: true } as any }} />
                    )}
                  </ListItemButton>
                </Tooltip>
              ))}
            </List>
            {open && <Box sx={{ my: 0.5 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
