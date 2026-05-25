import React, { useState, useRef, useEffect } from 'react';
import {
  Box, InputBase, Paper, Typography, List, ListItemButton, Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../../store';
import { STOCK_UNIVERSE, MAG7_SYMBOLS, AI_STOCK_SYMBOLS, BUFFETT_SYMBOLS, RECURRING_SYMBOLS } from '../../config/research';

// Build a searchable universe from all known symbols
const SEARCH_UNIVERSE = Array.from(
  new Map([
    ...STOCK_UNIVERSE,
    ...MAG7_SYMBOLS,
    ...AI_STOCK_SYMBOLS,
    ...BUFFETT_SYMBOLS,
    ...RECURRING_SYMBOLS,
  ].map(s => [s.symbol, s])).values()
);

const SearchPanel: React.FC = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const results = query.length >= 1
    ? SEARCH_UNIVERSE.filter(s =>
        s.symbol.toUpperCase().startsWith(query.toUpperCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (symbol: string) => {
    // Navigate to the most relevant tab for this symbol
    const isInMag7 = MAG7_SYMBOLS.some(s => s.symbol === symbol);
    const isRecurring = RECURRING_SYMBOLS.some(s => s.symbol === symbol);
    const isBuffett = BUFFETT_SYMBOLS.some(s => s.symbol === symbol);
    const isAI = AI_STOCK_SYMBOLS.some(s => s.symbol === symbol);

    if (isInMag7) dispatch(setActiveTab('mag7'));
    else if (isRecurring) dispatch(setActiveTab('recurring'));
    else if (isBuffett) dispatch(setActiveTab('buffett'));
    else if (isAI) dispatch(setActiveTab('ai'));
    else dispatch(setActiveTab('screener'));

    setQuery('');
    setOpen(false);
  };

  return (
    <Box ref={ref} sx={{ position: 'relative', flex: 1, maxWidth: 320 }}>
      <Paper sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        px: 1.5, py: 0.5, height: 32,
        bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid',
        borderColor: open ? 'primary.main' : 'divider',
        borderRadius: 1, transition: 'border-color 0.15s',
      }}>
        <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <InputBase
          placeholder="Search symbol or name..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          sx={{ fontSize: '0.8rem', flex: 1, '& input': { p: 0 } }}
        />
      </Paper>

      {open && results.length > 0 && (
        <Paper sx={{
          position: 'absolute', top: '100%', left: 0, right: 0, mt: 0.5,
          zIndex: 1300, maxHeight: 320, overflowY: 'auto',
          border: '1px solid', borderColor: 'divider',
        }}>
          <List dense disablePadding>
            {results.map(s => (
              <ListItemButton key={s.symbol} onClick={() => handleSelect(s.symbol)}
                sx={{ px: 1.5, py: 0.75 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {s.symbol}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{s.name}</Typography>
                  </Box>
                  <Chip label={(s as any).sector ?? 'Stock'} size="small"
                    sx={{ height: 16, fontSize: '0.6rem', flexShrink: 0 }} />
                </Box>
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchPanel;
