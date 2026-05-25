import React from 'react';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setActiveTab } from '../../store';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { VISIBLE_TABS } from '../../config/tabs';

const Sidebar: React.FC<{ open: boolean }> = ({ open }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector((s: RootState) => s.ui.activeTab);
  const groups = Array.from(new Set(VISIBLE_TABS.map(i => i.group)));

  return (
    <Box sx={{
      width: open ? 200 : 56, minWidth: open ? 200 : 56,
      transition: 'width 0.2s, min-width 0.2s',
      height: '100%', display: 'flex', flexDirection: 'column',
      borderRight: '1px solid', borderColor: 'divider',
      background: theme => theme.palette.mode === 'dark' ? '#080C17' : '#FFFFFF',
      overflow: 'hidden',
    }}>
      {/* Brand */}
      <Box sx={{ p: open ? 2 : 1, display: 'flex', alignItems: 'center', gap: 1, minHeight: 52 }}>
        <AutoGraphIcon sx={{ color: 'primary.main', fontSize: 22 }} />
        {open && (
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>
            STOCKIQ
          </Typography>
        )}
      </Box>
      <Divider />

      {/* Nav items — driven by TAB_CONFIG in src/config/tabs.tsx */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        {groups.map(group => (
          <Box key={group}>
            {open && (
              <Typography variant="caption" sx={{
                px: 2, py: 0.5, display: 'block',
                color: 'text.secondary', letterSpacing: 2, textTransform: 'uppercase',
              }}>
                {group}
              </Typography>
            )}
            <List dense disablePadding>
              {VISIBLE_TABS.filter(t => t.group === group).map(tab => (
                <Tooltip
                  key={tab.id}
                  title={!open ? tab.label : tab.description}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    selected={activeTab === tab.id}
                    onClick={() => dispatch(setActiveTab(tab.id))}
                    sx={{
                      minHeight: 38, px: open ? 2 : 1.5,
                      justifyContent: open ? 'flex-start' : 'center',
                      borderRadius: '0 20px 20px 0', mx: 0.5, mb: 0.25,
                      '&.Mui-selected': {
                        bgcolor: t => t.palette.mode === 'dark'
                          ? 'rgba(0,212,170,0.12)' : 'rgba(0,102,204,0.08)',
                        borderRight: '2px solid', borderColor: 'primary.main',
                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                      },
                      '&:hover': {
                        bgcolor: t => t.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: open ? 32 : 'auto', color: 'text.secondary' }}>
                      {tab.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={tab.label}
                        slotProps={{ primary: { variant: 'body2', noWrap: true } as any }}
                      />
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
