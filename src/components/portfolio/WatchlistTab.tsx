import React, { useState } from 'react';
import { Box, Paper, Typography, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addToWatchlist, removeFromWatchlist } from '../../store';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fmtPrice, fmtPct } from '../../utils/format';
import { MAG7_STOCKS, SP100_MOVERS } from '../../services/mockData';

const allStocks = [...MAG7_STOCKS, ...SP100_MOVERS];

const WatchlistTab: React.FC = () => {
  const dispatch = useDispatch();
  const { watchlists } = useSelector((s: RootState) => s.watchlist);
  const wl = watchlists[0];
  const [open, setOpen] = useState(false);
  const [sym, setSym] = useState('');

  const handleAdd = () => {
    const stock = allStocks.find(s => s.symbol === sym.toUpperCase());
    dispatch(addToWatchlist({
      watchlistId: wl.id,
      item: { symbol: sym.toUpperCase(), name: stock?.name || sym, addedAt: new Date().toISOString() },
    }));
    setSym('');
    setOpen(false);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper>
        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{wl.name}</Typography>
            <Typography variant="caption" color="text.secondary">{wl.items.length} symbols tracked</Typography>
          </Box>
          <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ height: 28, fontSize: '0.75rem' }}>Add Symbol</Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead><TableRow>
              <TableCell>Symbol</TableCell><TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell><TableCell align="right">Change</TableCell>
              <TableCell align="right">% Change</TableCell><TableCell align="right">Added</TableCell><TableCell />
            </TableRow></TableHead>
            <TableBody>
              {wl.items.map(item => {
                const stock = allStocks.find(s => s.symbol === item.symbol);
                return (
                  <TableRow key={item.symbol} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{item.symbol}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{item.name}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2">{stock ? fmtPrice(stock.price) : '—'}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption" sx={{ color: (stock?.change ?? 0) >= 0 ? 'success.main' : 'error.main' }}>{stock ? `${stock.change >= 0 ? '+' : ''}$${stock.change.toFixed(2)}` : '—'}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption" sx={{ color: (stock?.changePercent ?? 0) >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>{stock ? fmtPct(stock.changePercent) : '—'}</Typography></TableCell>
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { bgcolor: 'background.paper' } } }}>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700 }}>Add to Watchlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus label="Ticker Symbol" size="small" fullWidth value={sym}
            onChange={e => setSym(e.target.value.toUpperCase())}
            sx={{ mt: 1 }}
            slotProps={{ input: { sx: { fontSize: '0.8rem', fontFamily: 'monospace' } } }}
          />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="small" variant="contained" onClick={handleAdd} disabled={!sym}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WatchlistTab;
