import React, { useMemo, useState } from 'react';
import { Box, Paper, Grid, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addHolding, removeHolding } from '../../store';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { fmtPrice, fmtPct, fmtChange, fmtLargeNum, genId } from '../../utils/format';
import { PortfolioHolding } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const SECTOR_COLORS = ['#00D4AA', '#6C8EEF', '#FFB84D', '#FF4D6A', '#9B59B6', '#1ABC9C', '#E67E22'];

const MetricCard: React.FC<{ label: string; value: string; sub?: string; color?: string }> = ({ label, value, sub, color }) => (
  <Paper sx={{ p: 1.5, textAlign: 'center' }}>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{label}</Typography>
    <Typography variant="h3" sx={{ fontWeight: 700, color: color || 'text.primary' }}>{value}</Typography>
    {sub && <Typography variant="caption" sx={{ color: color || 'text.secondary' }}>{sub}</Typography>}
  </Paper>
);

const PortfolioTab: React.FC = () => {
  const dispatch = useDispatch();
  const { portfolios, activePortfolioId } = useSelector((s: RootState) => s.portfolio);
  const portfolio = portfolios.find(p => p.id === activePortfolioId)!;
  const [addOpen, setAddOpen] = useState(false);
  const [newHolding, setNewHolding] = useState({ symbol: '', name: '', quantity: '', avgCostBasis: '', currentPrice: '', sector: 'Technology', assetType: 'stock' as const });

  const metrics = useMemo(() => {
    if (!portfolio) return { totalValue: 0, totalCost: 0, totalPL: 0, totalPLPct: 0, dayPL: 0 };
    const totalValue = portfolio.holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0);
    const totalCost = portfolio.holdings.reduce((s, h) => s + h.quantity * h.avgCostBasis, 0);
    const totalPL = totalValue - totalCost;
    return { totalValue, totalCost, totalPL, totalPLPct: (totalPL / totalCost) * 100, dayPL: totalValue * 0.0034 };
  }, [portfolio]);

  const allocationData = useMemo(() => {
    if (!portfolio) return [];
    const bySector: Record<string, number> = {};
    portfolio.holdings.forEach(h => { bySector[h.sector] = (bySector[h.sector] || 0) + h.quantity * h.currentPrice; });
    return Object.entries(bySector).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [portfolio]);

  const perfHistory = useMemo(() => {
    const base = metrics.totalValue * 0.88;
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i],
      value: parseFloat((base + (metrics.totalValue - base) * (i / 11) + (Math.random() - 0.4) * base * 0.02).toFixed(2)),
    }));
  }, [metrics.totalValue]);

  const handleAdd = () => {
    const h: PortfolioHolding = {
      id: genId(), symbol: newHolding.symbol.toUpperCase(), name: newHolding.name,
      quantity: Number(newHolding.quantity), avgCostBasis: Number(newHolding.avgCostBasis),
      currentPrice: Number(newHolding.currentPrice), sector: newHolding.sector,
      assetType: newHolding.assetType, purchaseDate: new Date().toISOString().slice(0, 10),
    };
    dispatch(addHolding({ portfolioId: activePortfolioId, holding: h }));
    setAddOpen(false);
    setNewHolding({ symbol: '', name: '', quantity: '', avgCostBasis: '', currentPrice: '', sector: 'Technology', assetType: 'stock' });
  };

  if (!portfolio) return null;

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={1.5}>
        {[
          { label: 'Total Value', value: fmtPrice(metrics.totalValue) },
          { label: 'Total P&L', value: fmtChange(metrics.totalPL), sub: fmtPct(metrics.totalPLPct), color: metrics.totalPL >= 0 ? '#00D4AA' : '#FF4D6A' },
          { label: "Today's P&L", value: fmtChange(metrics.dayPL), color: metrics.dayPL >= 0 ? '#00D4AA' : '#FF4D6A' },
          { label: 'Cost Basis', value: fmtPrice(metrics.totalCost) },
          { label: 'Holdings', value: String(portfolio.holdings.length) },
        ].map(m => (
          <Grid key={m.label} size={{ xs: 6, sm: 4, md: 'grow' }}>
            <MetricCard {...m} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 1.5, height: 240 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Sector Allocation</Typography>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={allocationData} cx="50%" cy="45%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {allocationData.map((_, i) => <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [fmtPrice(v), 'Value']} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '0.7rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 1.5, height: 240 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Portfolio Performance (12 months)</Typography>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={perfHistory}>
                <defs>
                  <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: any) => [fmtPrice(v), 'Value']} />
                <Area type="monotone" dataKey="value" stroke="#00D4AA" strokeWidth={2} fill="url(#pfGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper>
        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Holdings</Typography>
          <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ height: 28, fontSize: '0.75rem' }}>Add</Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead><TableRow>
              <TableCell>Symbol</TableCell><TableCell align="right">Qty</TableCell>
              <TableCell align="right">Avg Cost</TableCell><TableCell align="right">Current</TableCell>
              <TableCell align="right">Market Value</TableCell><TableCell align="right">P&L</TableCell>
              <TableCell align="right">P&L %</TableCell><TableCell>Sector</TableCell><TableCell />
            </TableRow></TableHead>
            <TableBody>
              {portfolio.holdings.map(h => {
                const mv = h.quantity * h.currentPrice;
                const cost = h.quantity * h.avgCostBasis;
                const pl = mv - cost;
                const plPct = (pl / cost) * 100;
                const plColor = pl >= 0 ? 'success.main' : 'error.main';
                return (
                  <TableRow key={h.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{h.symbol}</Typography>
                      <Typography variant="caption" color="text.secondary">{h.name}</Typography>
                    </TableCell>
                    <TableCell align="right"><Typography variant="caption">{h.quantity}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption">{fmtPrice(h.avgCostBasis)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(h.currentPrice)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2">{fmtPrice(mv)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption" sx={{ color: plColor }}>{fmtChange(pl)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption" sx={{ color: plColor, fontWeight: 600 }}>{fmtPct(plPct)}</Typography></TableCell>
                    <TableCell><Chip label={h.sector} size="small" sx={{ height: 18, fontSize: '0.62rem' }} /></TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => dispatch(removeHolding({ portfolioId: activePortfolioId, holdingId: h.id }))} sx={{ color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { bgcolor: 'background.paper' } } }}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700 }}>Add Holding</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            {[
              { label: 'Symbol', key: 'symbol' }, { label: 'Name', key: 'name' },
              { label: 'Quantity', key: 'quantity' }, { label: 'Avg Cost Basis', key: 'avgCostBasis' },
              { label: 'Current Price', key: 'currentPrice' },
            ].map(f => (
              <TextField key={f.key} label={f.label} size="small" fullWidth value={(newHolding as any)[f.key]}
                onChange={e => setNewHolding(p => ({ ...p, [f.key]: e.target.value }))}
                slotProps={{ input: { sx: { fontSize: '0.8rem' } }, inputLabel: { sx: { fontSize: '0.8rem' } } }} />
            ))}
            <FormControl size="small">
              <InputLabel sx={{ fontSize: '0.8rem' }}>Sector</InputLabel>
              <Select label="Sector" value={newHolding.sector} onChange={e => setNewHolding(p => ({ ...p, sector: e.target.value }))} sx={{ fontSize: '0.8rem' }}>
                {['Technology', 'Healthcare', 'Financials', 'Energy', 'Consumer Staples', 'Consumer Discretionary', 'Commodities', 'Dividend', 'Blend'].map(s =>
                  <MenuItem key={s} value={s} sx={{ fontSize: '0.8rem' }}>{s}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={handleAdd} disabled={!newHolding.symbol || !newHolding.quantity}>Add Holding</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PortfolioTab;
