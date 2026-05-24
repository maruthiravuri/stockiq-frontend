import React, { useState, useMemo } from 'react';
import {
  Box, Paper, Typography, Button, Select, MenuItem, TextField,
  IconButton, Chip, Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { SP100_MOVERS, SP500_VALUE, MAG7_STOCKS, AI_STOCKS } from '../../services/mockData';
import { Stock } from '../../types';
import { fmtPrice, fmtPct, fmtLargeNum } from '../../utils/format';
import AgStockTable from '../common/AgStockTable';

const ALL_STOCKS: Stock[] = Array.from(
  new Map(
    [...MAG7_STOCKS, ...SP100_MOVERS, ...SP500_VALUE, ...AI_STOCKS].map(s => [s.symbol, s] as [string, Stock])
  ).values()
);

type Operator = '>' | '<' | '>=' | '<=' | '==' | 'contains';
type FieldKey = keyof Stock;

interface Filter {
  id: string;
  field: FieldKey;
  operator: Operator;
  value: string;
}

const FILTERABLE_FIELDS: { key: FieldKey; label: string; type: 'number' | 'string' }[] = [
  { key: 'price', label: 'Price ($)', type: 'number' },
  { key: 'changePercent', label: '% Change', type: 'number' },
  { key: 'marketCap', label: 'Market Cap', type: 'number' },
  { key: 'volume', label: 'Volume', type: 'number' },
  { key: 'peRatio', label: 'P/E Ratio', type: 'number' },
  { key: 'pbRatio', label: 'P/B Ratio', type: 'number' },
  { key: 'dividendYield', label: 'Dividend Yield (%)', type: 'number' },
  { key: 'beta', label: 'Beta', type: 'number' },
  { key: 'sector', label: 'Sector', type: 'string' },
];

const PRESETS = [
  { label: 'High Dividend (>3%)', filters: [{ id: '1', field: 'dividendYield' as FieldKey, operator: '>' as Operator, value: '3' }] },
  { label: 'Value (P/E<15)', filters: [{ id: '1', field: 'peRatio' as FieldKey, operator: '<' as Operator, value: '15' }] },
  { label: 'Momentum (>+2%)', filters: [{ id: '1', field: 'changePercent' as FieldKey, operator: '>' as Operator, value: '2' }] },
  { label: 'Mega Cap (>$500B)', filters: [{ id: '1', field: 'marketCap' as FieldKey, operator: '>' as Operator, value: '500000000000' }] },
];

const ScreenerTab: React.FC = () => {
  const [filters, setFilters] = useState<Filter[]>([
    { id: '1', field: 'peRatio', operator: '<', value: '30' },
  ]);
  const [results, setResults] = useState<Stock[]>([]);
  const [ran, setRan] = useState(false);

  const addFilter = () => {
    setFilters(f => [...f, { id: Date.now().toString(), field: 'price', operator: '>', value: '' }]);
  };

  const removeFilter = (id: string) => {
    setFilters(f => f.filter(x => x.id !== id));
  };

  const updateFilter = (id: string, key: keyof Filter, val: string) => {
    setFilters(f => f.map(x => x.id === id ? { ...x, [key]: val } : x));
  };

  const runScreen = () => {
    let screened = ALL_STOCKS;
    filters.forEach(f => {
      if (!f.value) return;
      screened = screened.filter(stock => {
        const raw = (stock as any)[f.field];
        if (raw === undefined || raw === null) return false;
        const num = parseFloat(f.value);
        switch (f.operator) {
          case '>':  return typeof raw === 'number' && raw > num;
          case '<':  return typeof raw === 'number' && raw < num;
          case '>=': return typeof raw === 'number' && raw >= num;
          case '<=': return typeof raw === 'number' && raw <= num;
          case '==': return String(raw) === f.value;
          case 'contains': return String(raw).toLowerCase().includes(f.value.toLowerCase());
          default: return true;
        }
      });
    });
    setResults(screened);
    setRan(true);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setFilters(preset.filters);
    setRan(false);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Custom Screener</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {PRESETS.map(p => (
              <Chip key={p.label} label={p.label} size="small" onClick={() => applyPreset(p)}
                sx={{ fontSize: '0.68rem', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,212,170,0.15)' } }} />
            ))}
          </Box>
        </Box>

        {filters.map(f => {
          const fieldMeta = FILTERABLE_FIELDS.find(x => x.key === f.field);
          const ops: Operator[] = fieldMeta?.type === 'string' ? ['contains', '=='] : ['>', '<', '>=', '<=', '=='];
          return (
            <Box key={f.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Select size="small" value={f.field} onChange={e => updateFilter(f.id, 'field', e.target.value)} sx={{ minWidth: 160, fontSize: '0.8rem', height: 32 }}>
                {FILTERABLE_FIELDS.map(x => <MenuItem key={x.key as string} value={x.key as string} sx={{ fontSize: '0.8rem' }}>{x.label}</MenuItem>)}
              </Select>
              <Select size="small" value={f.operator} onChange={e => updateFilter(f.id, 'operator', e.target.value)} sx={{ minWidth: 80, fontSize: '0.8rem', height: 32 }}>
                {ops.map(op => <MenuItem key={op} value={op} sx={{ fontSize: '0.8rem' }}>{op}</MenuItem>)}
              </Select>
              <TextField size="small" value={f.value} onChange={e => updateFilter(f.id, 'value', e.target.value)}
                placeholder="Value" sx={{ width: 120, '& input': { fontSize: '0.8rem', height: 16 } }} />
              <IconButton size="small" onClick={() => removeFilter(f.id)} sx={{ color: 'error.main', opacity: 0.7 }}>
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          );
        })}

        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
          <Button size="small" startIcon={<AddIcon />} onClick={addFilter} variant="outlined" sx={{ height: 30, fontSize: '0.75rem' }}>
            Add Filter
          </Button>
          <Button size="small" startIcon={<PlayArrowIcon />} onClick={runScreen} variant="contained" sx={{ height: 30, fontSize: '0.75rem' }}>
            Run Screen ({ALL_STOCKS.length} stocks)
          </Button>
        </Box>
      </Paper>

      {ran && (
        <Paper sx={{ flex: 1, minHeight: 400 }}>
          <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Results</Typography>
            <Chip
              label={`${results.length} matches`}
              size="small"
              sx={{ bgcolor: results.length > 0 ? 'rgba(0,212,170,0.15)' : 'rgba(255,77,106,0.15)', color: results.length > 0 ? 'success.main' : 'error.main' }}
            />
          </Box>
          {results.length > 0 ? (
            <AgStockTable data={results} title="" showValueCols height={420} />
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No stocks match your criteria. Try relaxing the filters.</Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ScreenerTab;
