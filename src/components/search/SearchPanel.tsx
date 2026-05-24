import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Paper, Typography, InputBase, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useDispatch } from 'react-redux';
import { setActiveTab, setSelectedSymbol } from '../../store';
import { MAG7_STOCKS, SP100_MOVERS, SP500_VALUE, AI_STOCKS, METALS_ETFS } from '../../services/mockData';
import { fmtPrice, fmtPct } from '../../utils/format';

const ALL_SECURITIES = [
  ...MAG7_STOCKS, ...SP100_MOVERS, ...SP500_VALUE, ...AI_STOCKS,
  ...METALS_ETFS.map(e => ({ ...e, sector: e.category || 'ETF' })),
];

const SearchPanel: React.FC = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 1
    ? ALL_SECURITIES.filter(s =>
        s.symbol.toUpperCase().includes(query.toUpperCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : [];

  const handleSelect = useCallback((symbol: string) => {
    dispatch(setSelectedSymbol(symbol));
    setQuery('');
    setOpen(false);
  }, [dispatch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <Box ref={panelRef} sx={{ position: 'relative', flex: 1, maxWidth: 380 }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        borderRadius: 1.5, px: 1.5, py: 0.5,
        border: open ? '1px solid' : '1px solid transparent',
        borderColor: open ? 'primary.main' : 'transparent',
        transition: 'border-color 0.2s',
      }}>
        <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <InputBase
          ref={inputRef}
          placeholder="Search symbol or company..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          sx={{ fontSize: '0.8rem', color: 'text.primary', flex: 1 }}
          inputProps={{ 'aria-label': 'search stocks and ETFs' }}
        />
        {query && (
          <CloseIcon
            sx={{ fontSize: 14, color: 'text.secondary', cursor: 'pointer' }}
            onClick={() => { setQuery(''); setOpen(false); }}
          />
        )}
      </Box>

      {open && results.length > 0 && (
        <Paper sx={{
          position: 'absolute', top: '100%', left: 0, right: 0, mt: 0.5, zIndex: 1300,
          maxHeight: 380, overflowY: 'auto', border: '1px solid', borderColor: 'divider',
        }}>
          {results.map(stock => {
            const isUp = stock.change >= 0;
            return (
              <Box
                key={stock.symbol}
                onClick={() => handleSelect(stock.symbol)}
                sx={{
                  px: 1.5, py: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5,
                  borderBottom: '1px solid', borderColor: 'divider',
                  '&:hover': { bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{stock.symbol}</Typography>
                    <Chip label={stock.sector || 'Stock'} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {stock.name}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(stock.price)}</Typography>
                  <Typography variant="caption" sx={{ color: isUp ? 'success.main' : 'error.main' }}>
                    {fmtPct(stock.changePercent)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Paper>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, mt: 0.5, zIndex: 1300, p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            No results for "{query}"
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SearchPanel;
