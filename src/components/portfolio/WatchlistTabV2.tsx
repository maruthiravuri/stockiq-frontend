import React, { useState } from 'react';
import { Box, Paper, Typography, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Chip, Tooltip, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useBatchQuotes } from '../../hooks/useApi';
import { fmtPrice, fmtPct } from '../../utils/format';

interface WatchlistItem { symbol: string; name: string; addedAt: string; alertPrice?: number; }
interface Watchlist { id: string; name: string; items: WatchlistItem[]; }

const STORAGE_KEY = 'stockiq_watchlists';

function loadWatchlists(): Watchlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [{ id: 'w1', name: 'My Watchlist', items: [
    { symbol: 'MSFT', name: 'Microsoft Corp.', addedAt: new Date().toISOString() },
    { symbol: 'AMD', name: 'Advanced Micro Devices', addedAt: new Date().toISOString() },
  ]}];
}

function saveWatchlists(wls: Watchlist[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wls));
}

const WatchlistTabV2: React.FC = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(loadWatchlists);
  const [activeIdx, setActiveIdx] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [newWLOpen, setNewWLOpen] = useState(false);
  const [sym, setSym] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [newWLName, setNewWLName] = useState('');

  const wl = watchlists[Math.min(activeIdx, watchlists.length - 1)];
  const symbols = wl?.items.map(i => i.symbol) || [];
  const { data: quotes, isLoading } = useBatchQuotes(symbols);

  const quoteMap: Record<string, any> = {};
  quotes?.forEach(q => { quoteMap[q.symbol] = q; });

  const update = (newWls: Watchlist[]) => { setWatchlists(newWls); saveWatchlists(newWls); };

  const addSymbol = () => {
    const updated = watchlists.map((w, i) => i === activeIdx
      ? { ...w, items: [...w.items, { symbol: sym.toUpperCase(), name: sym.toUpperCase(), addedAt: new Date().toISOString(), alertPrice: alertPrice ? Number(alertPrice) : undefined }] }
      : w);
    update(updated);
    setSym(''); setAlertPrice(''); setAddOpen(false);
  };

  const removeSymbol = (symbol: string) => {
    const updated = watchlists.map((w, i) => i === activeIdx ? { ...w, items: w.items.filter(x => x.symbol !== symbol) } : w);
    update(updated);
  };

  const createWL = () => {
    const newWL: Watchlist = { id: Date.now().toString(), name: newWLName, items: [] };
    const updated = [...watchlists, newWL];
    update(updated);
    setActiveIdx(updated.length - 1);
    setNewWLName(''); setNewWLOpen(false);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tabs value={Math.min(activeIdx, watchlists.length - 1)} onChange={(_, v) => setActiveIdx(v)}
          sx={{ flex: 1, '.MuiTab-root': { minHeight: 36, fontSize: '0.78rem' } }}>
          {watchlists.map(w => <Tab key={w.id} label={`${w.name} (${w.items.length})`} />)}
        </Tabs>
        <Button size="small" startIcon={<AddIcon />} onClick={() => setNewWLOpen(true)} sx={{ height: 28, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>New List</Button>
      </Box>
      <Paper>
        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{wl?.name}</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} variant="outlined" sx={{ height: 28, fontSize: '0.72rem' }}>Add Symbol</Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead><TableRow>
              <TableCell>Symbol</TableCell><TableCell align="right">Price</TableCell>
              <TableCell align="right">Change</TableCell><TableCell align="right">% Change</TableCell>
              <TableCell align="right">Alert</TableCell><TableCell />
            </TableRow></TableHead>
            <TableBody>
              {wl?.items.map(item => {
                const q = quoteMap[item.symbol];
                const triggered = item.alertPrice && q && q.price >= item.alertPrice;
                return (
                  <TableRow key={item.symbol} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{item.symbol}</Typography><Typography variant="caption" color="text.secondary">{q?.name || item.name}</Typography></TableCell>
                    <TableCell align="right">{isLoading ? <CircularProgress size={12} /> : <Typography variant="body2">{q ? fmtPrice(q.price) : '—'}</Typography>}</TableCell>
                    <TableCell align="right"><Typography variant="caption" sx={{ color: (q?.change || 0) >= 0 ? 'success.main' : 'error.main' }}>{q ? `${q.change >= 0 ? '+' : ''}$${q.change.toFixed(2)}` : '—'}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption" sx={{ color: (q?.changePercent || 0) >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>{q ? fmtPct(q.changePercent) : '—'}</Typography></TableCell>
                    <TableCell align="right">
                      {item.alertPrice ? (
                        <Tooltip title={triggered ? '🔔 Alert triggered!' : `Alert at ${fmtPrice(item.alertPrice)}`}>
                          <Chip icon={<NotificationsNoneIcon sx={{ fontSize: '12px !important' }} />}
                            label={fmtPrice(item.alertPrice)} size="small"
                            sx={{ height: 18, fontSize: '0.6rem', bgcolor: triggered ? 'rgba(0,212,170,0.2)' : 'rgba(255,255,255,0.05)', color: triggered ? 'success.main' : 'text.secondary' }} />
                        </Tooltip>
                      ) : <Typography variant="caption" color="text.secondary">—</Typography>}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => removeSymbol(item.symbol)} sx={{ color: 'error.main', opacity: 0.5, '&:hover': { opacity: 1 } }}>
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

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { bgcolor: 'background.paper' } } }}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700 }}>Add Symbol</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            <TextField autoFocus label="Ticker Symbol" size="small" fullWidth value={sym}
              onChange={e => setSym(e.target.value.toUpperCase())} slotProps={{ input: { sx: { fontSize: '0.8rem', fontFamily: 'monospace' } } }} />
            <TextField label="Price Alert (optional)" size="small" fullWidth value={alertPrice}
              onChange={e => setAlertPrice(e.target.value)} placeholder="e.g. 200.00"
              slotProps={{ input: { sx: { fontSize: '0.8rem' } } }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={addSymbol} disabled={!sym}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newWLOpen} onClose={() => setNewWLOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { bgcolor: 'background.paper' } } }}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700 }}>Create Watchlist</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Name" size="small" fullWidth value={newWLName}
            onChange={e => setNewWLName(e.target.value)} sx={{ mt: 1 }} slotProps={{ input: { sx: { fontSize: '0.8rem' } } }} />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setNewWLOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={createWL} disabled={!newWLName}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WatchlistTabV2;
