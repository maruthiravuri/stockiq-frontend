import React, { useState, useMemo } from 'react';
import {
  Box, Paper, Typography, Button, Select, MenuItem, TextField,
  IconButton, Chip, CircularProgress, Alert, FormControl, InputLabel,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useBatchQuotes } from '../../hooks/useApi';
import {
  MAG7_SYMBOLS, SP100_SYMBOLS, SP500_VALUE_SYMBOLS, AI_STOCK_SYMBOLS,
  BUFFETT_SYMBOLS, METALS_ETF_SYMBOLS,
  SCREENER_PRESETS, SCREENER_NUMERIC_FIELDS, SCREENER_SECTORS,
} from '../../config/research';
import { fmtPrice, fmtPct, fmtLargeNum } from '../../utils/format';
import AgStockTable from '../common/AgStockTable';

// ── Universe: all symbols from all tabs merged ────────────────────────────────
const ALL_MOCK = Array.from(
  new Map([
    ...MAG7_SYMBOLS, ...SP100_SYMBOLS, ...SP500_VALUE_SYMBOLS,
    ...AI_STOCK_SYMBOLS, ...BUFFETT_SYMBOLS, ...METALS_ETF_SYMBOLS,
  ].map(s => [s.symbol, s])).values()
);
const ALL_SYMBOLS = ALL_MOCK.map(s => s.symbol);

// ── Filter types ──────────────────────────────────────────────────────────────
type Operator = '>' | '<' | '>=' | '<=' | '==';
type StringOp = 'is' | 'contains';

interface NumericFilter {
  id: string; type: 'numeric';
  field: 'price' | 'changePercent' | 'marketCap' | 'volume' | 'peRatio' | 'beta' | 'dividendYield';
  operator: Operator;
  value: string;
}

interface StringFilter {
  id: string; type: 'string';
  field: 'sector';
  operator: StringOp;
  value: string;
}

type Filter = NumericFilter | StringFilter;

const NUMERIC_FIELDS = SCREENER_NUMERIC_FIELDS;

const SECTORS = [
  'Technology', 'Healthcare', 'Financials', 'Energy',
  'Consumer Staples', 'Consumer Discretionary', 'Communication Services',
  'Industrials', 'Materials', 'Real Estate', 'Utilities',
];

// Presets from config/research.ts
const PRESETS = SCREENER_PRESETS;

function applyFilters(stocks: any[], filters: Filter[]): any[] {
  return stocks.filter(stock => filters.every(f => {
    if (f.type === 'string') {
      const val = String(stock[f.field] ?? '').toLowerCase();
      if (f.operator === 'is') return val === f.value.toLowerCase();
      if (f.operator === 'contains') return val.includes(f.value.toLowerCase());
      return true;
    }
    const stockVal = Number(stock[f.field]);
    const filterVal = Number(f.value);
    if (isNaN(stockVal) || isNaN(filterVal)) return false;
    switch (f.operator) {
      case '>':  return stockVal >  filterVal;
      case '<':  return stockVal <  filterVal;
      case '>=': return stockVal >= filterVal;
      case '<=': return stockVal <= filterVal;
      case '==': return stockVal === filterVal;
    }
  }));
}

const ScreenerTab: React.FC = () => {
  const [filters, setFilters] = useState<Filter[]>([
    { id: '1', type: 'numeric', field: 'peRatio', operator: '<', value: '30' },
  ]);
  const [ran, setRan] = useState(false);

  // Fetch live prices for the full universe
  const { data: quotes, isLoading, isError } = useBatchQuotes(ALL_SYMBOLS);

  // Merge live prices into mock metadata
  const universe = useMemo(() => {
    if (!quotes?.length) return ALL_MOCK;
    const qMap = Object.fromEntries(quotes.map(q => [q.symbol, q]));
    return ALL_MOCK.map(s => {
      const live = qMap[s.symbol];
      return live ? { ...s, price: Number(live.price), change: Number(live.change),
        changePercent: Number(live.changePercent), volume: Number(live.volume ?? (s as any).volume ?? 0) } : s;
    });
  }, [quotes]);

  const results = useMemo(() => ran ? applyFilters(universe, filters) : [], [ran, filters, universe]);

  const addFilter = () => setFilters(f => [
    ...f, { id: Date.now().toString(), type: 'numeric', field: 'price', operator: '>', value: '' }
  ]);

  const removeFilter = (id: string) => setFilters(f => f.filter(x => x.id !== id));

  const updateFilter = (id: string, changes: Partial<Filter>) =>
    setFilters(f => f.map(x => x.id === id ? { ...x, ...changes } as Filter : x));

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Stock Screener</Typography>
          <Typography variant="caption" color="text.secondary">
            {isLoading ? 'Loading live prices...' : isError ? `${ALL_MOCK.length} stocks (demo prices)` : `${universe.length} stocks with live prices`}
          </Typography>
        </Box>
        {isLoading
          ? <CircularProgress size={16} />
          : <Chip label={quotes?.length ? '● LIVE' : 'DEMO'} size="small"
              sx={{ height: 18, fontSize: '0.62rem',
                bgcolor: quotes?.length ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.06)',
                color: quotes?.length ? 'success.main' : 'text.secondary', fontWeight: 700 }} />}
      </Box>

      {/* Presets */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <Chip key={p.label} label={p.label} size="small" clickable
            onClick={() => { setFilters(p.filters as any); setRan(true); }}
            sx={{ fontSize: '0.72rem', height: 24,
              bgcolor: 'rgba(108,142,239,0.12)', color: 'primary.light',
              '&:hover': { bgcolor: 'rgba(108,142,239,0.22)' } }} />
        ))}
      </Box>

      {/* Filter builder */}
      <Paper sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Filters</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addFilter}
            sx={{ height: 26, fontSize: '0.72rem' }}>Add</Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {filters.map(f => (
            <Box key={f.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>

              {/* Field selector */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select value={f.field} sx={{ fontSize: '0.78rem' }}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'sector') {
                      updateFilter(f.id, { field: 'sector', type: 'string', operator: 'is', value: 'Technology' } as any);
                    } else {
                      updateFilter(f.id, { field: val as any, type: 'numeric', operator: '>', value: '' } as any);
                    }
                  }}>
                  {NUMERIC_FIELDS.map(nf => (
                    <MenuItem key={nf.key} value={nf.key} sx={{ fontSize: '0.78rem' }}>{nf.label}</MenuItem>
                  ))}
                  <MenuItem value="sector" sx={{ fontSize: '0.78rem' }}>Sector</MenuItem>
                </Select>
              </FormControl>

              {/* Operator */}
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select value={f.operator} sx={{ fontSize: '0.78rem' }}
                  onChange={e => updateFilter(f.id, { operator: e.target.value as any })}>
                  {f.type === 'string'
                    ? <>
                        <MenuItem value="is" sx={{ fontSize: '0.78rem' }}>is</MenuItem>
                        <MenuItem value="contains" sx={{ fontSize: '0.78rem' }}>contains</MenuItem>
                      </>
                    : ['>', '<', '>=', '<=', '=='].map(op => (
                        <MenuItem key={op} value={op} sx={{ fontSize: '0.78rem' }}>{op}</MenuItem>
                      ))
                  }
                </Select>
              </FormControl>

              {/* Value */}
              {f.type === 'string' ? (
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select value={f.value} sx={{ fontSize: '0.78rem' }}
                    onChange={e => updateFilter(f.id, { value: e.target.value })}>
                    {SECTORS.map(s => (
                      <MenuItem key={s} value={s} sx={{ fontSize: '0.78rem' }}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField size="small" placeholder="Value" value={f.value}
                  onChange={e => updateFilter(f.id, { value: e.target.value })}
                  sx={{ width: 140, '& input': { fontSize: '0.78rem' } }} />
              )}

              <IconButton size="small" onClick={() => removeFilter(f.id)} sx={{ color: 'error.main', opacity: 0.6 }}>
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="contained" size="small" startIcon={<PlayArrowIcon />}
            onClick={() => setRan(true)} sx={{ height: 30, fontSize: '0.78rem' }}>
            Run Screen
          </Button>
          {ran && (
            <Typography variant="caption" color="text.secondary">
              {results.length} of {universe.length} stocks match
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Results */}
      {ran && (
        <Paper sx={{ flex: 1, minHeight: 300 }}>
          {results.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No stocks match your filters.</Typography>
              <Typography variant="caption" color="text.secondary">Try adjusting the criteria.</Typography>
            </Box>
          ) : (
            <AgStockTable
              data={results as any}
              title={`Screener Results`}
              subtitle={`${results.length} stocks matched${quotes?.length ? ' · live prices' : ' · demo prices'}`}
              showExtra
            />
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ScreenerTab;
