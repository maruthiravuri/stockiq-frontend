import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

interface Props { connected: boolean; }

const WebSocketStatus: React.FC<Props> = ({ connected }) => (
  <Tooltip title={connected ? 'Live market feed connected' : 'Connecting to live feed...'}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {connected
        ? <WifiIcon sx={{ fontSize: 14, color: 'success.main' }} />
        : <WifiOffIcon sx={{ fontSize: 14, color: 'warning.main' }} />}
      <Typography variant="caption" sx={{ color: connected ? 'success.main' : 'warning.main', fontSize: '0.68rem' }}>
        {connected ? 'LIVE' : 'CONNECTING'}
      </Typography>
    </Box>
  </Tooltip>
);

export default WebSocketStatus;
