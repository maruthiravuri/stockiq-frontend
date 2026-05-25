import React from 'react';
import { Box, Paper, Typography, Chip, CircularProgress, Alert } from '@mui/material';
import { useMag7 } from '../../hooks/useApi';
import { MAG7_STOCKS } from '../../services/mockData';
import { fmtPrice, fmtPct, fmtChange, fmtLargeNum } from '../../utils/format';
import Sparkline from '../common/Sparkline';
import Grid from '@mui/material/Grid';
import AgStockTable from '../common/AgStockTable';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const StockCard: React.FC<{ stock: any }> = ({ stock }) => {
  const isUp = stock.change >= 0;
  const color = isUp ? 'success.main' : 'error.main';
  return (
    <Paper sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75, height: 140 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{stock.symbol}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {stock.name}
          </Typography>
        </Box>
        <Chip label={stock.sector || 'Tech'} size="small" sx={{ fontSize: '0.6rem', height: 18, bgcolor: 'rgba(0,212,170,0.1)', color: 'primary.main' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{fmtPrice(stock.price)}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isUp ? <ArrowDropUpIcon sx={{ color, fontSize: 18 }} /> : <ArrowDropDownIcon sx={{ color, fontSize: 18 }} />}
          <Typography variant="caption" sx={{ color, fontWeight: 600 }}>{fmtPct(stock.changePercent)}</Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Sparkline basePrice={stock.price} change={stock.change} height={32} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">{stock.marketCap ? fmtLargeNum(stock.marketCap) : ''}</Typography>
        <Typography variant="caption" sx={{ color }}>{fmtChange(stock.change)}</Typography>
      </Box>
    </Paper>
  );
};

const Mag7Tab: React.FC = () => {
  const { data: apiData, isLoading, isError } = useMag7();

  // Use real API data when available, fall back to mock
  const stocks = apiData && apiData.length > 0
    ? apiData.map(q => ({
        symbol: q.symbol, name: q.name, price: q.price,
        change: q.change, changePercent: q.changePercent,
        volume: q.volume, marketCap: q.marketCap || 0,
        high: q.high, low: q.low, open: q.open,
        previousClose: q.previousClose, sector: 'Technology',
        peRatio: q.peRatio || undefined,
        weekHigh52: q.weekHigh52 || undefined,
        beta: undefined, pbRatio: undefined, dividendYield: undefined, eps: undefined, weekLow52: undefined,
      }))
    : MAG7_STOCKS;

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <CircularProgress size={14} /> <Typography variant="caption">Loading live data...</Typography>
        </Box>
      )}
      {isError && (
        <Alert severity="info" sx={{ fontSize: '0.75rem', py: 0.5 }}>
          Using demo data — connect backend for live prices
        </Alert>
      )}
      <Grid container spacing={1.5}>
        {stocks.map(stock => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={stock.symbol}>
            <StockCard stock={stock} />
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ flex: 1, minHeight: 300 }}>
        <AgStockTable data={stocks as any} title="Magnificent 7 Detail"
          subtitle={apiData ? 'Live data via Alpha Vantage' : 'Demo data — start backend for live prices'}
          showExtra />
      </Paper>
    </Box>
  );
};

export default Mag7Tab;
