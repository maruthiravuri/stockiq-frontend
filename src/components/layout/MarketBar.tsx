import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { MARKET_SUMMARY } from '../../services/mockData';
import { fmtPct } from '../../utils/format';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const MarketBar: React.FC = () => {
  const [summary, setSummary] = useState(MARKET_SUMMARY);

  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(prev => prev.map(m => {
        const delta = (Math.random() - 0.49) * m.value * 0.0002;
        const newChange = parseFloat((m.change + delta).toFixed(2));
        return { ...m, change: newChange, changePercent: parseFloat(((newChange / m.value) * 100).toFixed(2)) };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 3, px: 2, py: 0.75,
      borderBottom: '1px solid', borderColor: 'divider',
      background: theme => theme.palette.mode === 'dark' ? '#070B14' : '#F5F7FA',
      overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' },
    }}>
      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: 1 }}>
        LIVE MARKETS
      </Typography>
      {summary.map(m => (
        <Box key={m.indexName} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, whiteSpace: 'nowrap' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{m.indexName}</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {m.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
          {m.changePercent >= 0
            ? <TrendingUpIcon sx={{ fontSize: 13, color: 'success.main' }} />
            : <TrendingDownIcon sx={{ fontSize: 13, color: 'error.main' }} />
          }
          <Typography variant="caption" sx={{ color: m.changePercent >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
            {fmtPct(m.changePercent)}
          </Typography>
        </Box>
      ))}
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite',
          '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Typography>
      </Box>
    </Box>
  );
};

export default MarketBar;
