import React from 'react';
import { Box, Paper, Typography, Chip, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMag7 } from '../../hooks/useApi';
import { fmtPrice, fmtPct, fmtChange, fmtLargeNum } from '../../utils/format';
import Sparkline from '../common/Sparkline';
import AgStockTable from '../common/AgStockTable';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const StockCard: React.FC<{ stock: any }> = ({ stock }) => {
  const pct = Number(stock.changePercent) || 0;
  const chg = Number(stock.change) || 0;
  const isUp = chg >= 0;
  const color = isUp ? 'success.main' : 'error.main';
  return (
    <Paper sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75, height: 140 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{stock.symbol}</Typography>
          <Typography variant="caption" color="text.secondary"
            sx={{ display: 'block', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {stock.name}
          </Typography>
        </Box>
        <Chip label={stock.sector || 'Technology'} size="small"
          sx={{ fontSize: '0.6rem', height: 18, bgcolor: 'rgba(0,212,170,0.1)', color: 'primary.main' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{fmtPrice(stock.price)}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isUp ? <ArrowDropUpIcon sx={{ color, fontSize: 18 }} /> : <ArrowDropDownIcon sx={{ color, fontSize: 18 }} />}
          <Typography variant="caption" sx={{ color, fontWeight: 600 }}>{fmtPct(pct)}</Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Sparkline basePrice={Number(stock.price) || 0} change={chg} height={32} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          {stock.marketCap ? fmtLargeNum(Number(stock.marketCap)) : ''}
        </Typography>
        <Typography variant="caption" sx={{ color }}>{fmtChange(chg)}</Typography>
      </Box>
    </Paper>
  );
};

const Mag7Tab: React.FC = () => {
  const { data, isLoading, isError } = useMag7();

  if (isLoading) return (
    <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <CircularProgress size={18} />
      <Typography color="text.secondary">Loading live data...</Typography>
    </Box>
  );

  if (isError || !data?.length) return (
    <Box sx={{ p: 4 }}>
      <Alert severity="warning" sx={{ maxWidth: 480 }}>
        Could not load Magnificent 7 data. Make sure the backend is running at{' '}
        <strong>localhost:8080</strong> and you are signed in.
      </Alert>
    </Box>
  );

  const stocks = data.map(q => ({
    symbol: q.symbol, name: q.name,
    price: Number(q.price) || 0,
    change: Number(q.change) || 0,
    changePercent: Number(q.changePercent) || 0,
    volume: Number(q.volume) || 0,
    marketCap: Number(q.marketCap) || 0,
    high: Number(q.high) || 0,
    low: Number(q.low) || 0,
    open: Number(q.open) || 0,
    previousClose: Number(q.previousClose) || 0,
    sector: 'Technology',
  }));

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={1.5}>
        {stocks.map(stock => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={stock.symbol}>
            <StockCard stock={stock} />
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ flex: 1, minHeight: 300 }}>
        <AgStockTable data={stocks as any} title="Magnificent 7 Detail"
          subtitle="Live data · updates every 30s" showExtra />
      </Paper>
    </Box>
  );
};

export default Mag7Tab;
