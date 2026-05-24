import React, { useState } from 'react';
import {
  Box, Paper, Typography, Button, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Tabs, Tab, Chip, Tooltip,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addToWatchlist, removeFromWatchlist, createWatchlist } from '../../store';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { fmtPrice, fmtPct, genId } from '../../utils/format';
import { MAG7_STOCKS, SP100_MOVERS, SP500_VALUE } from '../../services/mockData';
import { Watchlist } from '../../types';

const allStocks = [...MAG7_STOCKS, ...SP100_MOVERS, ...SP500_VALUE];

const WatchlistTabV2: React.FC = () => {
  const dispatch = useDispatch();
  const { watchlists } = useSelector((s: RootState) => s.watchlist);
  const [activeWL, setActiveWL] = useState(0);
  const [addSymbolOpen, setAddSymbolOpen] = useState(false);
  const [newWLOpen, setNewWLOpen] = useState(false);
  const [sym, setSym] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [newWLName, setNewWLName] = useState('');

  const wl = watchlists[activeWL] || watchlists[0];

  const handleAddSymbol = () => {
    const stock = allStocks.find(s => s.symbol === sym.toUpperCase());
    dispatch(addToWatchlist({
      watchlistId: wl.id,
      item: {
        symbol: sym.toUpperCase(), name: stock?.name || sym,
        addedAt: new Date().toISOString(),
        alertPrice: alertPrice ? Number(alertPrice) : undefined,
      },
    }));
    setSym(''); setAlertPrice(''); setAddSymbolOpen(false);
  };

  const handleCreateWL = () => {
    const newWL: Watchlist = {
      id: genId(), name: newWLName, items: [], createdAt: new Date().toISOString(),
    };
    dispatch(createWatchlist(newWL));
    setNewWLName(''); setNewWLOpen(false);
    setActiveWL(watchlists.length);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tabs value={Math.min(activeWL, watchlists.length - 1)} onChange={(_, v) => setActiveWL(v)}
          sx={{ flex: 1, '.MuiTab-root': { minHeight: 36, fontSize: '0.78rem' } }}>
          {watchlists.map(w => <Tab key={w.id} label={`${w.name} (${w.items.length})`} />)}
        </Tabs>
        <Button size="small" startIcon={<AddIcon />} onClick={() => setNewWLOpen(true)} sx={{ height: 28, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
          New List
        </Button>
      </Box>

      <Paper>
        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{wl?.name}</Typography>
            <Typography variant="caption" color="text.secondary">{wl?.items.length} symbols · alerts on {wl?.items.filter(i => i.alertPrice).length}</Typography>
          </Box>
          <Button size="small" startIcon={<AddIcon />} onClick={() => setAddSymbolOpen(true)} variant="outlined" sx={{ height: 28, fontSize: '0.72rem' }}>
            Add Symbol
          </Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead><TableRow>
              <TableCell>Symbol</TableCell><TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell><TableCell align="right">Change</TableCell>
              <TableCell align="right">% Change</TableCell><TableCell align="right">Alert</TableCell>
              <TableCell align="right">Added</TableCell><TableCell />
            </TableRow></TableHead>
            <TableBody>
              {wl?.items.map(item => {
                const stock = allStocks.find(s => s.symbol === item.symbol);
                const alertTriggered = item.alertPrice && stock && stock.price >= item.alertPrice;
                return (
                  <TableRow key={item.symbol} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{item.symbol}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{item.name}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2">{stock ? fmtPrice(stock.price) : '—'}</Typography></TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ color: (stock?.change ?? 0) >= 0 ? 'success.main' : 'error.main' }}>
                        {stock ? `${stock.change >= 0 ? '+' : ''}$${stock.change.toFixed(2)}` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" sx={{ color: (stock?.changePercent ?? 0) >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                        {stock ? fmtPct(stock.changePercent) : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {item.alertPrice ? (
                        <Tooltip title={alertTriggered ? '🔔 Alert triggered!' : `Alert at ${fmtPrice(item.alertPrice)}`}>
                          <Chip
                            icon={<NotificationsNoneIcon sx={{ fontSize: '12px !important' }} />}
                            label={fmtPrice(item.alertPrice)}
                            size="small"
                            sx={{ height: 18, fontSize: '0.6rem', bgcolor: alertTriggered ? 'rgba(0,212,170,0.2)' : 'rgba(255,255,255,0.05)', color: alertTriggered ? 'success.main' : 'text.secondary' }}
                          />
                        </Tooltip>
                      ) : <Typography variant="caption" color="text.secondary">—</Typography>}
                    </TableCell>
                    <TableCell align="right"><Typography variant="caption" color="text.secondary">{new Date(item.addedAt).toLocaleDateString()}</Typography></TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => dispatch(removeFromWatchlist({ watchlistId: wl.id, symbol: item.symbol }))} sx={{ color: 'error.main', opacity: 0.5, '&:hover': { opacity: 1 } }}>
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

      {/* Add Symbol Dialog */}
      <Dialog open={addSymbolOpen} onClose={() => setAddSymbolOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { bgcolor: 'background.paper' } } }}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700 }}>Add to {wl?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            <TextField autoFocus label="Ticker Symbol" size="small" fullWidth value={sym}
              onChange={e => setSym(e.target.value.toUpperCase())}
              slotProps={{ input: { sx: { fontSize: '0.8rem', fontFamily: 'monospace' } } }} />
            <TextField label="Price Alert (optional)" size="small" fullWidth value={alertPrice}
              onChange={e => setAlertPrice(e.target.value)} placeholder="e.g. 200.00"
              helperText="Get notified when price reaches this level"
              slotProps={{ input: { sx: { fontSize: '0.8rem' } }, formHelperText: { sx: { fontSize: '0.7rem' } } }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setAddSymbolOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={handleAddSymbol} disabled={!sym}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* New Watchlist Dialog */}
      <Dialog open={newWLOpen} onClose={() => setNewWLOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { bgcolor: 'background.paper' } } }}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700 }}>Create Watchlist</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Watchlist Name" size="small" fullWidth value={newWLName}
            onChange={e => setNewWLName(e.target.value)} sx={{ mt: 1 }}
            slotProps={{ input: { sx: { fontSize: '0.8rem' } } }} />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setNewWLOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={handleCreateWL} disabled={!newWLName}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WatchlistTabV2;
