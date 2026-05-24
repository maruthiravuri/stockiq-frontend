import React, { useMemo, useState } from 'react';
import {
  Box, Paper, Grid, Typography, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, IconButton, Tabs, Tab, CircularProgress, Alert,
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import {
  usePortfolios, usePortfolio, useAddHolding, useDeleteHolding,
  useUpdateHolding, useCreatePortfolio,
} from '../../hooks/useApi';
import { portfolioService, AddHoldingRequest, HoldingResponse } from '../../services/portfolioService';
import { fmtPrice, fmtPct, fmtChange } from '../../utils/format';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';

const COLORS = ['#00D4AA','#6C8EEF','#FFB84D','#FF4D6A','#9B59B6','#1ABC9C','#E67E22'];

const EMPTY_FORM = { symbol:'', name:'', quantity:'', avgCostBasis:'', currentPrice:'', sector:'Technology', assetType:'stock', purchaseDate: new Date().toISOString().slice(0,10) };

const MetricCard: React.FC<{ label: string; value: string; sub?: string; color?: string }> = ({ label, value, sub, color }) => (
  <Paper sx={{ p: 1.5, textAlign: 'center' }}>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{label}</Typography>
    <Typography variant="h3" sx={{ fontWeight: 700, color: color || 'text.primary' }}>{value}</Typography>
    {sub && <Typography variant="caption" sx={{ color: color || 'text.secondary' }}>{sub}</Typography>}
  </Paper>
);

const PortfolioTabV2: React.FC = () => {
  const { data: portfolios, isLoading: loadingList } = usePortfolios();
  const [activeId, setActiveId] = useState<string>('');
  const [tabIdx, setTabIdx] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [editHolding, setEditHolding] = useState<HoldingResponse | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [newPortfolioOpen, setNewPortfolioOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');

  // Use first portfolio as default
  const portfolioId = activeId || portfolios?.[0]?.id || '';
  const { data: portfolio, isLoading } = usePortfolio(portfolioId);
  const addHolding = useAddHolding(portfolioId);
  const deleteHolding = useDeleteHolding(portfolioId);
  const updateHolding = useUpdateHolding(portfolioId, editHolding?.id || '');
  const createPortfolio = useCreatePortfolio();

  const allocationData = useMemo(() => {
    if (!portfolio?.holdings.length) return [];
    const bySector: Record<string, number> = {};
    portfolio.holdings.forEach(h => { bySector[h.sector] = (bySector[h.sector] || 0) + h.marketValue; });
    return Object.entries(bySector).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [portfolio]);

  const perfHistory = useMemo(() => {
    const base = (portfolio?.totalValue || 10000) * 0.88;
    const total = portfolio?.totalValue || 10000;
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'][i],
      value: parseFloat((base + (total - base) * (i / 11) + (Math.random() - 0.4) * base * 0.02).toFixed(2)),
    }));
  }, [portfolio?.totalValue]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditHolding(null); setAddOpen(true); };
  const openEdit = (h: HoldingResponse) => {
    setForm({ symbol: h.symbol, name: h.name, quantity: String(h.quantity),
      avgCostBasis: String(h.avgCostBasis), currentPrice: String(h.currentPrice),
      sector: h.sector, assetType: h.assetType, purchaseDate: h.purchaseDate });
    setEditHolding(h);
    setAddOpen(true);
  };

  const handleSave = async () => {
    const req: AddHoldingRequest = {
      symbol: form.symbol.toUpperCase(), name: form.name,
      quantity: Number(form.quantity), avgCostBasis: Number(form.avgCostBasis),
      currentPrice: Number(form.currentPrice), sector: form.sector,
      assetType: form.assetType, purchaseDate: form.purchaseDate,
    };
    if (editHolding) {
      await updateHolding.mutateAsync({ quantity: req.quantity, avgCostBasis: req.avgCostBasis, currentPrice: req.currentPrice, sector: req.sector, purchaseDate: req.purchaseDate });
    } else {
      await addHolding.mutateAsync(req);
    }
    setAddOpen(false);
  };

  if (loadingList) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  if (!portfolios?.length) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>No portfolios yet</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setNewPortfolioOpen(true)}>
        Create Portfolio
      </Button>
    </Box>
  );

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      {/* Portfolio selector */}
      {portfolios.length > 1 && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {portfolios.map(p => (
            <Chip key={p.id} label={p.name} onClick={() => setActiveId(p.id)}
              color={p.id === portfolioId ? 'primary' : 'default'} variant={p.id === portfolioId ? 'filled' : 'outlined'} size="small" />
          ))}
        </Box>
      )}

      {isLoading ? <CircularProgress size={20} /> : portfolio && (
        <>
          {/* Metric cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 1.5 }}>
            <MetricCard label="Total Value" value={fmtPrice(portfolio.totalValue)} />
            <MetricCard label="Unrealized P&L" value={fmtChange(portfolio.unrealizedPL)}
              sub={fmtPct(portfolio.unrealizedPLPercent)}
              color={portfolio.unrealizedPL >= 0 ? '#00D4AA' : '#FF4D6A'} />
            <MetricCard label="Cost Basis" value={fmtPrice(portfolio.totalCost)} />
            <MetricCard label="Holdings" value={String(portfolio.holdings.length)} />
          </Box>

          <Tabs value={tabIdx} onChange={(_, v) => setTabIdx(v)} sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 36 }}>
            <Tab label="Holdings" sx={{ minHeight: 36, fontSize: '0.8rem' }} />
            <Tab label="Charts" sx={{ minHeight: 36, fontSize: '0.8rem' }} />
          </Tabs>

          {tabIdx === 0 && (
            <Paper>
              <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{portfolio.name}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" startIcon={<DownloadIcon />}
                    onClick={() => portfolioService.downloadCsv(portfolioId, portfolio.name)}
                    variant="outlined" sx={{ height: 28, fontSize: '0.72rem' }}>CSV</Button>
                  <Button size="small" startIcon={<AddIcon />} onClick={openAdd}
                    variant="contained" sx={{ height: 28, fontSize: '0.72rem' }}>Add</Button>
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
                    {portfolio.holdings.map(h => (
                      <TableRow key={h.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{h.symbol}</Typography>
                          <Typography variant="caption" color="text.secondary">{h.name}</Typography>
                        </TableCell>
                        <TableCell align="right"><Typography variant="caption">{h.quantity}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="caption">{fmtPrice(h.avgCostBasis)}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(h.currentPrice)}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2">{fmtPrice(h.marketValue)}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="caption" sx={{ color: h.unrealizedPL >= 0 ? 'success.main' : 'error.main' }}>{fmtChange(h.unrealizedPL)}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="caption" sx={{ color: h.unrealizedPLPercent >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>{fmtPct(h.unrealizedPLPercent)}</Typography></TableCell>
                        <TableCell><Chip label={h.sector} size="small" sx={{ height: 18, fontSize: '0.62rem' }} /></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <IconButton size="small" onClick={() => openEdit(h)} sx={{ color: 'primary.main', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                            <EditIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteHolding.mutate(h.id)} sx={{ color: 'error.main', opacity: 0.6, '&:hover': { opacity: 1 } }}>
                            <DeleteIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {tabIdx === 1 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
              <Paper sx={{ p: 1.5, height: 240 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Sector Allocation</Typography>
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie data={allocationData} cx="50%" cy="45%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                      {allocationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [fmtPrice(v), 'Value']} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '0.7rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
              <Paper sx={{ p: 1.5, height: 240 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Performance (12m)</Typography>
                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={perfHistory}>
                    <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3}/><stop offset="95%" stopColor="#00D4AA" stopOpacity={0}/></linearGradient></defs>
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                    <Tooltip formatter={(v: any) => [fmtPrice(v), 'Value']} />
                    <Area type="monotone" dataKey="value" stroke="#00D4AA" strokeWidth={2} fill="url(#pg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
          )}
        </>
      )}

      {/* Add/Edit Holding Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { bgcolor: 'background.paper' } } }}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700 }}>{editHolding ? 'Edit Holding' : 'Add Holding'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            {[
              { label:'Symbol', key:'symbol', disabled: !!editHolding },
              { label:'Name', key:'name' },
              { label:'Quantity', key:'quantity' },
              { label:'Avg Cost Basis ($)', key:'avgCostBasis' },
              { label:'Current Price ($)', key:'currentPrice' },
              { label:'Purchase Date', key:'purchaseDate', type:'date' },
            ].map(f => (
              <TextField key={f.key} label={f.label} size="small" fullWidth
                type={f.type || 'text'} disabled={f.disabled}
                value={(form as any)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
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
          <Button size="small" variant="contained" onClick={handleSave}
            disabled={!form.symbol || !form.quantity || addHolding.isPending || updateHolding.isPending}>
            {addHolding.isPending || updateHolding.isPending ? <CircularProgress size={14} /> : editHolding ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Portfolio Dialog */}
      <Dialog open={newPortfolioOpen} onClose={() => setNewPortfolioOpen(false)} maxWidth="xs" fullWidth
        slotProps={{ paper: { sx: { bgcolor: 'background.paper' } } }}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700 }}>Create Portfolio</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Portfolio Name" size="small" fullWidth
            value={newPortfolioName} onChange={e => setNewPortfolioName(e.target.value)} sx={{ mt: 1 }}
            slotProps={{ input: { sx: { fontSize: '0.8rem' } } }} />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setNewPortfolioOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" disabled={!newPortfolioName || createPortfolio.isPending}
            onClick={async () => {
              const p = await createPortfolio.mutateAsync({ name: newPortfolioName });
              setActiveId(p.id);
              setNewPortfolioOpen(false);
              setNewPortfolioName('');
            }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PortfolioTabV2;
