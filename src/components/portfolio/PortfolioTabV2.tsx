import React, { useMemo, useState } from 'react';
import { Box, Paper, Grid, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Tabs, Tab } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addHolding, removeHolding } from '../../store';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { fmtPrice, fmtPct, fmtChange, genId } from '../../utils/format';
import { PortfolioHolding } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';

const SECTOR_COLORS = ['#00D4AA', '#6C8EEF', '#FFB84D', '#FF4D6A', '#9B59B6', '#1ABC9C', '#E67E22'];

const EMPTY_FORM = { symbol: '', name: '', quantity: '', avgCostBasis: '', currentPrice: '', sector: 'Technology', assetType: 'stock' as 'stock' | 'etf' | 'crypto' };

const MetricCard: React.FC<{ label: string; value: string; sub?: string; color?: string }> = ({ label, value, sub, color }) => (
  <Paper sx={{ p: 1.5, textAlign: 'center' }}>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{label}</Typography>
    <Typography variant="h3" sx={{ fontWeight: 700, color: color || 'text.primary' }}>{value}</Typography>
    {sub && <Typography variant="caption" sx={{ color: color || 'text.secondary' }}>{sub}</Typography>}
  </Paper>
);

const PortfolioTabV2: React.FC = () => {
  const dispatch = useDispatch();
  const { portfolios, activePortfolioId } = useSelector((s: RootState) => s.portfolio);
  const portfolio = portfolios.find(p => p.id === activePortfolioId)!;
  const [addOpen, setAddOpen] = useState(false);
  const [editHolding, setEditHolding] = useState<PortfolioHolding | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tabIdx, setTabIdx] = useState(0);

  const metrics = useMemo(() => {
    if (!portfolio) return { totalValue: 0, totalCost: 0, totalPL: 0, totalPLPct: 0, dayPL: 0 };
    const totalValue = portfolio.holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0);
    const totalCost = portfolio.holdings.reduce((s, h) => s + h.quantity * h.avgCostBasis, 0);
    const totalPL = totalValue - totalCost;
    return { totalValue, totalCost, totalPL, totalPLPct: totalCost ? (totalPL / totalCost) * 100 : 0, dayPL: totalValue * 0.0034 };
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
      month: ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'][i],
      value: parseFloat((base + (metrics.totalValue - base) * (i / 11) + (Math.random() - 0.4) * base * 0.02).toFixed(2)),
    }));
  }, [metrics.totalValue]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditHolding(null); setAddOpen(true); };
  const openEdit = (h: PortfolioHolding) => {
    setForm({ symbol: h.symbol, name: h.name, quantity: String(h.quantity), avgCostBasis: String(h.avgCostBasis), currentPrice: String(h.currentPrice), sector: h.sector, assetType: h.assetType });
    setEditHolding(h);
    setAddOpen(true);
  };

  const handleSave = () => {
    if (editHolding) {
      dispatch(removeHolding({ portfolioId: activePortfolioId, holdingId: editHolding.id }));
    }
    const h: PortfolioHolding = {
      id: editHolding?.id || genId(), symbol: form.symbol.toUpperCase(), name: form.name,
      quantity: Number(form.quantity), avgCostBasis: Number(form.avgCostBasis),
      currentPrice: Number(form.currentPrice), sector: form.sector,
      assetType: form.assetType, purchaseDate: editHolding?.purchaseDate || new Date().toISOString().slice(0, 10),
    };
    dispatch(addHolding({ portfolioId: activePortfolioId, holding: h }));
    setAddOpen(false);
  };

  const exportCsv = () => {
    const rows = ['Symbol,Name,Qty,Avg Cost,Current Price,Market Value,P&L,$,P&L %,Sector']
      .concat(portfolio.holdings.map(h => {
        const mv = (h.quantity * h.currentPrice).toFixed(2);
        const pl = (h.quantity * (h.currentPrice - h.avgCostBasis)).toFixed(2);
        const pct = (((h.currentPrice - h.avgCostBasis) / h.avgCostBasis) * 100).toFixed(2);
        return `${h.symbol},"${h.name}",${h.quantity},${h.avgCostBasis},${h.currentPrice},${mv},${pl},${pct}%,${h.sector}`;
      }));
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${portfolio.name}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!portfolio) return null;

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={1.5}>
        {[
          { label: 'Total Value', value: fmtPrice(metrics.totalValue) },
          { label: 'Unrealized P&L', value: fmtChange(metrics.totalPL), sub: fmtPct(metrics.totalPLPct), color: metrics.totalPL >= 0 ? '#00D4AA' : '#FF4D6A' },
          { label: "Today's P&L", value: fmtChange(metrics.dayPL), color: metrics.dayPL >= 0 ? '#00D4AA' : '#FF4D6A' },
          { label: 'Cost Basis', value: fmtPrice(metrics.totalCost) },
          { label: 'Holdings', value: String(portfolio.holdings.length) },
        ].map(m => (
          <Grid key={m.label} size={{ xs: 6, sm: 4, md: 'grow' }}>
            <MetricCard {...m} />
          </Grid>
        ))}
      </Grid>

      <Tabs value={tabIdx} onChange={(_, v) => setTabIdx(v)} sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 36 }}>
        <Tab label="Holdings" sx={{ minHeight: 36, fontSize: '0.8rem' }} />
        <Tab label="Charts" sx={{ minHeight: 36, fontSize: '0.8rem' }} />
      </Tabs>

      {tabIdx === 0 && (
        <Paper>
          <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Holdings</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" startIcon={<DownloadIcon />} onClick={exportCsv} variant="outlined" sx={{ height: 28, fontSize: '0.72rem' }}>Export CSV</Button>
              <Button size="small" startIcon={<AddIcon />} onClick={openAdd} variant="contained" sx={{ height: 28, fontSize: '0.72rem' }}>Add</Button>
            </Box>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead><TableRow>
                <TableCell>Symbol</TableCell><TableCell align="right">Qty</TableCell>
                <TableCell align="right">Avg Cost</TableCell><TableCell align="right">Current</TableCell>
                <TableCell align="right">Mkt Value</TableCell><TableCell align="right">P&L</TableCell>
                <TableCell align="right">P&L %</TableCell><TableCell>Sector</TableCell><TableCell />
              </TableRow></TableHead>
              <TableBody>
                {portfolio.holdings.map(h => {
                  const mv = h.quantity * h.currentPrice;
                  const cost = h.quantity * h.avgCostBasis;
                  const pl = mv - cost;
                  const plPct = cost ? (pl / cost) * 100 : 0;
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
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <IconButton size="small" onClick={() => openEdit(h)} sx={{ color: 'primary.main', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                          <EditIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => dispatch(removeHolding({ portfolioId: activePortfolioId, holdingId: h.id }))} sx={{ color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                          <DeleteIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabIdx === 1 && (
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
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Portfolio Performance (12m)</Typography>
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={perfHistory}>
                  <defs>
                    <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: any) => [fmtPrice(v), 'Value']} />
                  <Area type="monotone" dataKey="value" stroke="#00D4AA" strokeWidth={2} fill="url(#pg)" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { bgcolor: 'background.paper' } } }}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700 }}>{editHolding ? 'Edit Holding' : 'Add Holding'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            {[
              { label: 'Symbol', key: 'symbol', disabled: !!editHolding },
              { label: 'Name', key: 'name' },
              { label: 'Quantity', key: 'quantity' },
              { label: 'Avg Cost Basis ($)', key: 'avgCostBasis' },
              { label: 'Current Price ($)', key: 'currentPrice' },
            ].map(f => (
              <TextField key={f.key} label={f.label} size="small" fullWidth disabled={f.disabled}
                value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                slotProps={{ input: { sx: { fontSize: '0.8rem' } }, inputLabel: { sx: { fontSize: '0.8rem' } } }} />
            ))}
            <FormControl size="small">
              <InputLabel sx={{ fontSize: '0.8rem' }}>Sector</InputLabel>
              <Select label="Sector" value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} sx={{ fontSize: '0.8rem' }}>
                {['Technology','Healthcare','Financials','Energy','Consumer Staples','Consumer Discretionary','Commodities','Dividend','Blend','Communication Services'].map(s =>
                  <MenuItem key={s} value={s} sx={{ fontSize: '0.8rem' }}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={handleSave} disabled={!form.symbol || !form.quantity}>
            {editHolding ? 'Save Changes' : 'Add Holding'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PortfolioTabV2;
