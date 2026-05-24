import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Chip } from '@mui/material';
import { MAG7_STOCKS } from '../../services/mockData';
import { Stock } from '../../types';
import { fmtPrice, fmtPct, fmtChange, fmtLargeNum } from '../../utils/format';
import Sparkline from '../common/Sparkline';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StockTable from '../common/StockTable';

const StockCard: React.FC<{ stock: Stock }> = ({ stock }) => {
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
        <Chip label={stock.sector} size="small" sx={{ fontSize: '0.6rem', height: 18, bgcolor: 'rgba(0,212,170,0.1)', color: 'primary.main', border: '1px solid rgba(0,212,170,0.2)' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{fmtPrice(stock.price)}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isUp ? <ArrowDropUpIcon sx={{ color, fontSize: 18 }} /> : <ArrowDropDownIcon sx={{ color, fontSize: 18 }} />}
          <Typography variant="caption" sx={{ color, fontWeight: 600 }}>{fmtPct(stock.changePercent)}</Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Sparkline basePrice={stock.price} change={stock.change} height={32} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">Mkt Cap: <span style={{ color: 'inherit' }}>{fmtLargeNum(stock.marketCap)}</span></Typography>
        <Typography variant="caption" sx={{ color }}>
          {fmtChange(stock.change)}
        </Typography>
      </Box>
    </Paper>
  );
};

const Mag7Tab: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>(MAG7_STOCKS);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const delta = (Math.random() - 0.49) * s.price * 0.001;
        const newPrice = parseFloat((s.price + delta).toFixed(2));
        const newChange = parseFloat((s.change + delta).toFixed(2));
        return { ...s, price: newPrice, change: newChange, changePercent: parseFloat(((newChange / s.previousClose) * 100).toFixed(2)) };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={1.5}>
        {stocks.map(stock => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 1.714 }} key={stock.symbol}>
            <StockCard stock={stock} />
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ flex: 1, minHeight: 300 }}>
        <StockTable data={stocks} title="Magnificent 7 Detail" subtitle="Real-time prices · refreshes every 4s" showExtra />
      </Paper>
    </Box>
  );
};

export default Mag7Tab;
