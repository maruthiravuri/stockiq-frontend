import React, { useState, useMemo } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Chip, TextField, InputAdornment, Select, MenuItem, FormControl,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Stock } from '../../types';
import { fmtPrice, fmtPct, fmtChange, fmtLargeNum, fmtVolume } from '../../utils/format';

interface StockTableProps {
  data: Stock[];
  title: string;
  subtitle?: string;
  showValueCols?: boolean;
  showExtra?: boolean;
}

const SortHeader: React.FC<{ label: string; field: string; sort: { field: string; dir: 'asc' | 'desc' }; onSort: (f: string) => void; align?: 'right' | 'left' }> = ({ label, field, sort, onSort, align = 'right' }) => (
  <TableCell align={align} onClick={() => onSort(field)} sx={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', '&:hover': { color: 'primary.main' } }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', gap: 0.25 }}>
      {label}
      {sort.field === field && (sort.dir === 'asc' ? <ArrowDropUpIcon sx={{ fontSize: 16 }} /> : <ArrowDropDownIcon sx={{ fontSize: 16 }} />)}
    </Box>
  </TableCell>
);

const StockTable: React.FC<StockTableProps> = ({ data, title, subtitle, showValueCols = false, showExtra = false }) => {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [sort, setSort] = useState<{ field: string; dir: 'asc' | 'desc' }>({ field: 'changePercent', dir: 'desc' });

  const sectors = useMemo(() => ['All', ...Array.from(new Set(data.map(s => s.sector || 'Other')))], [data]);

  const filtered = useMemo(() => {
    let d = data.filter(s =>
      (s.symbol.includes(search.toUpperCase()) || s.name.toLowerCase().includes(search.toLowerCase())) &&
      (sectorFilter === 'All' || s.sector === sectorFilter)
    );
    d = [...d].sort((a, b) => {
      const av = (a as any)[sort.field] ?? 0;
      const bv = (b as any)[sort.field] ?? 0;
      return sort.dir === 'asc' ? av - bv : bv - av;
    });
    return d;
  }, [data, search, sectorFilter, sort]);

  const handleSort = (field: string) => {
    setSort(prev => ({ field, dir: prev.field === field && prev.dir === 'desc' ? 'asc' : 'desc' }));
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>{title}</Typography>
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          </Box>
          <Chip label={`${filtered.length} securities`} size="small" variant="outlined" sx={{ borderColor: 'divider' }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15 }} /></InputAdornment>,
                sx: { fontSize: '0.8rem', height: 32 }
              }
            }}
            sx={{ width: 200 }}
          />
          {sectors.length > 2 && (
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} sx={{ fontSize: '0.8rem', height: 32 }}>
                {sectors.map(s => <MenuItem key={s} value={s} sx={{ fontSize: '0.8rem' }}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>

      <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <SortHeader label="Price" field="price" sort={sort} onSort={handleSort} />
              <SortHeader label="Change" field="change" sort={sort} onSort={handleSort} />
              <SortHeader label="% Change" field="changePercent" sort={sort} onSort={handleSort} />
              <SortHeader label="Volume" field="volume" sort={sort} onSort={handleSort} />
              <SortHeader label="Mkt Cap" field="marketCap" sort={sort} onSort={handleSort} />
              {showValueCols && <>
                <SortHeader label="P/E" field="peRatio" sort={sort} onSort={handleSort} />
                <SortHeader label="P/B" field="pbRatio" sort={sort} onSort={handleSort} />
                <SortHeader label="Div Yield" field="dividendYield" sort={sort} onSort={handleSort} />
              </>}
              {showExtra && <>
                <SortHeader label="52W High" field="weekHigh52" sort={sort} onSort={handleSort} />
                <SortHeader label="Beta" field="beta" sort={sort} onSort={handleSort} />
              </>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((stock, idx) => {
              const isUp = stock.change >= 0;
              const changeColor = isUp ? 'success.main' : 'error.main';
              return (
                <TableRow key={stock.symbol} hover sx={{
                  '&:hover': { bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                  bgcolor: idx % 2 === 0 ? 'transparent' : theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
                }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{stock.symbol}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stock.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(stock.price)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2" sx={{ color: changeColor }}>{fmtChange(stock.change)}</Typography></TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      {isUp ? <ArrowDropUpIcon sx={{ color: changeColor, fontSize: 16 }} /> : <ArrowDropDownIcon sx={{ color: changeColor, fontSize: 16 }} />}
                      <Typography variant="body2" sx={{ color: changeColor, fontWeight: 600 }}>{Math.abs(stock.changePercent).toFixed(2)}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right"><Typography variant="caption" color="text.secondary">{fmtVolume(stock.volume)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption" color="text.secondary">{fmtLargeNum(stock.marketCap)}</Typography></TableCell>
                  {showValueCols && <>
                    <TableCell align="right"><Typography variant="caption">{stock.peRatio?.toFixed(1) ?? '—'}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption">{stock.pbRatio?.toFixed(1) ?? '—'}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption" sx={{ color: (stock.dividendYield ?? 0) > 3 ? 'success.main' : 'text.secondary' }}>{stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : '—'}</Typography></TableCell>
                  </>}
                  {showExtra && <>
                    <TableCell align="right"><Typography variant="caption">{stock.weekHigh52 ? fmtPrice(stock.weekHigh52) : '—'}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption" sx={{ color: (stock.beta ?? 1) > 1.5 ? 'warning.main' : 'text.secondary' }}>{stock.beta?.toFixed(2) ?? '—'}</Typography></TableCell>
                  </>}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StockTable;
