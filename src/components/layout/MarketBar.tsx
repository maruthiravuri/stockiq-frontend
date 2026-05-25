import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { useBatchQuotes } from '../../hooks/useApi';
import { fmtPrice, fmtPct } from '../../utils/format';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Key market indices and ETFs to show in the top bar
const MARKET_SYMBOLS = ['SPY', 'QQQ', 'DIA', 'IWM', 'GLD', 'TLT', 'VIX'];

const LABELS: Record<string, string> = {
  SPY: 'S&P 500',
  QQQ: 'NASDAQ',
  DIA: 'DOW',
  IWM: 'Russell 2K',
  GLD: 'Gold',
  TLT: '20Y Bond',
  VIX: 'VIX',
};

const MarketBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { data: quotes, isLoading } = useBatchQuotes(MARKET_SYMBOLS);

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 3, px: 2, py: 0.75,
      borderBottom: '1px solid', borderColor: 'divider',
      background: theme => theme.palette.mode === 'dark' ? '#070B14' : '#F5F7FA',
      overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' },
      minHeight: 34,
    }}>
      {/* Live indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
        <Box sx={{
          width: 7, height: 7, borderRadius: '50%',
          bgcolor: quotes?.length ? 'success.main' : 'warning.main',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
        }} />
        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1 }}>
          {quotes?.length ? 'LIVE' : 'MARKETS'}
        </Typography>
      </Box>

      {/* Market items */}
      {isLoading
        ? MARKET_SYMBOLS.map(s => (
            <Skeleton key={s} width={90} height={16} sx={{ bgcolor: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
          ))
        : (quotes ?? []).map(q => (
            <Box key={q.symbol} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, whiteSpace: 'nowrap', flexShrink: 0 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {LABELS[q.symbol] ?? q.symbol}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {fmtPrice(Number(q.price))}
              </Typography>
              {Number(q.changePercent) >= 0
                ? <TrendingUpIcon sx={{ fontSize: 12, color: 'success.main' }} />
                : <TrendingDownIcon sx={{ fontSize: 12, color: 'error.main' }} />}
              <Typography variant="caption" sx={{
                color: Number(q.changePercent) >= 0 ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}>
                {fmtPct(Number(q.changePercent))}
              </Typography>
            </Box>
          ))}

      {/* Clock */}
      <Box sx={{ ml: 'auto', flexShrink: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Typography>
      </Box>
    </Box>
  );
};

export default MarketBar;
