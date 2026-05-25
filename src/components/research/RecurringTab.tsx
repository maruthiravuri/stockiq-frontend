import React, { useMemo, useState } from 'react';
import {
  Box, Paper, Typography, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, TextField,
  InputAdornment, ToggleButton, ToggleButtonGroup, Tooltip,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { RECURRING_SYMBOLS } from '../../config/research';
import { useBatchQuotes } from '../../hooks/useApi';
import { fmtPrice, fmtPct, fmtLargeNum } from '../../utils/format';
import RepeatIcon from '@mui/icons-material/Repeat';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const COLORS: Record<string, string> = {
  'Broad Market':          '#00D4AA',
  'Technology':            '#6C8EEF',
  'Dividend':              '#FFB84D',
  'International':         '#9B59B6',
  'Commodities':           '#F1C40F',
  'Consumer Staples':      '#1ABC9C',
  'Communication Services':'#3498DB',
};

const FREQ_AMOUNTS: Record<string, number> = {
  Weekly: 1, Biweekly: 2, Monthly: 4,
};

const RecurringTab: React.FC = () => {
  const [weeklyAmount, setWeeklyAmount] = useState('100');
  const [freq, setFreq] = useState<'Weekly' | 'Biweekly' | 'Monthly'>('Weekly');
  const [filter, setFilter] = useState<'All' | 'ETF' | 'Stock'>('All');

  const symbols = RECURRING_SYMBOLS.map(r => r.symbol);
  const { data: quotes, isLoading } = useBatchQuotes(symbols);
  const hasLive = !!quotes?.length;

  // Merge live prices
  const holdings = useMemo(() => {
    const qMap = Object.fromEntries((quotes ?? []).map(q => [q.symbol, q]));
    return RECURRING_SYMBOLS.map(r => {
      const live = qMap[r.symbol];
      return {
        ...r,
        price:         live ? Number(live.price)         || r.price : r.price,
        change:        live ? Number(live.change)         || 0       : 0,
        changePercent: live ? Number(live.changePercent)  || 0       : 0,
      };
    });
  }, [quotes]);

  const visible = holdings.filter(h => filter === 'All' || h.type === filter);

  // DCA calculator
  const perPeriod = Number(weeklyAmount) || 0;
  const multiplier = FREQ_AMOUNTS[freq];
  const perItem = visible.length > 0 ? (perPeriod * multiplier) / visible.length : 0;

  // Sector allocation data for pie
  const sectorData = useMemo(() => {
    const map: Record<string, number> = {};
    visible.forEach(h => { map[h.sector] = (map[h.sector] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [visible]);

  // Annual projection
  const annualTotal = perPeriod * 52 * (freq === 'Weekly' ? 1 : freq === 'Biweekly' ? 0.5 : 0.25);

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RepeatIcon sx={{ color: 'primary.main', fontSize: 22 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Recurring Investments</Typography>
          {isLoading
            ? <CircularProgress size={12} />
            : <Chip label={hasLive ? '● LIVE' : 'DEMO'} size="small"
                sx={{ height: 18, fontSize: '0.62rem',
                  bgcolor: hasLive ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.06)',
                  color: hasLive ? 'success.main' : 'text.secondary', fontWeight: 700 }} />}
        </Box>
        <Typography variant="caption" color="text.secondary">
          Handpicked stocks & ETFs for regular DCA investing
        </Typography>
      </Box>

      {/* DCA Calculator */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>DCA Calculator</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Amount per week ($)"
            size="small"
            value={weeklyAmount}
            onChange={e => setWeeklyAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            sx={{ width: 180 }}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                sx: { fontSize: '0.85rem' },
              }
            }}
          />
          <ToggleButtonGroup value={freq} exclusive size="small"
            onChange={(_, v) => v && setFreq(v)}
            sx={{ '& .MuiToggleButton-root': { fontSize: '0.72rem', px: 1.5, py: 0.5 } }}>
            <ToggleButton value="Weekly">Weekly</ToggleButton>
            <ToggleButton value="Biweekly">Bi-weekly</ToggleButton>
            <ToggleButton value="Monthly">Monthly</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup value={filter} exclusive size="small"
            onChange={(_, v) => v && setFilter(v)}
            sx={{ '& .MuiToggleButton-root': { fontSize: '0.72rem', px: 1.5, py: 0.5 } }}>
            <ToggleButton value="All">All ({holdings.length})</ToggleButton>
            <ToggleButton value="ETF">ETFs ({holdings.filter(h => h.type === 'ETF').length})</ToggleButton>
            <ToggleButton value="Stock">Stocks ({holdings.filter(h => h.type === 'Stock').length})</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Summary row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 1.5, mt: 2 }}>
          {[
            { label: `Per ${freq.toLowerCase()} total`, value: `$${(perPeriod * multiplier).toFixed(0)}` },
            { label: 'Per position', value: `$${perItem.toFixed(2)}` },
            { label: 'Annual invested', value: `$${annualTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}` },
            { label: 'Positions', value: String(visible.length) },
          ].map(s => (
            <Paper key={s.label} variant="outlined" sx={{ p: 1, textAlign: 'center', bgcolor: 'rgba(0,212,170,0.04)', borderColor: 'rgba(0,212,170,0.2)' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{s.label}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{s.value}</Typography>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* Charts row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' }, gap: 2 }}>

        {/* Per-position bar chart */}
        <Paper sx={{ p: 1.5, height: 230 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Amount per position ({freq}) — ${perItem.toFixed(0)} each
          </Typography>
          <ResponsiveContainer width="100%" height={185}>
            <BarChart data={visible.map(h => ({ name: h.symbol, amount: parseFloat(perItem.toFixed(2)), shares: perItem > 0 ? parseFloat((perItem / h.price).toFixed(4)) : 0 }))}>
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `$${v}`} />
              <RTooltip formatter={(v: any) => [`$${Number(v).toFixed(2)}`, 'Per position']} contentStyle={{ fontSize: '0.75rem' }} />
              <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                {visible.map((h, i) => <Cell key={i} fill={COLORS[h.sector] ?? '#00D4AA'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Sector pie */}
        <Paper sx={{ p: 1.5, height: 230 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>Sector Mix</Typography>
          <ResponsiveContainer width="100%" height={195}>
            <PieChart>
              <Pie data={sectorData} dataKey="value" nameKey="name" cx="50%" cy="45%"
                innerRadius={45} outerRadius={75} paddingAngle={2}>
                {sectorData.map((s, i) => <Cell key={i} fill={COLORS[s.name] ?? '#8B93A5'} />)}
              </Pie>
              <RTooltip formatter={(v: any, name: any) => [v, name]} contentStyle={{ fontSize: '0.72rem' }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '0.68rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Holdings table */}
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Today</TableCell>
                <TableCell align="right" sx={{ color: 'primary.main' }}>Buy / {freq}</TableCell>
                <TableCell align="right">Shares / {freq}</TableCell>
                <TableCell>Sector</TableCell>
                <TableCell>Expense</TableCell>
                <TableCell>Yield</TableCell>
                <TableCell>Why buy?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map((h, i) => {
                const sharesPerPeriod = h.price > 0 ? perItem / h.price : 0;
                return (
                  <TableRow key={h.symbol} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{
                          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                          bgcolor: COLORS[h.sector] ?? '#8B93A5',
                        }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {h.symbol}
                          </Typography>
                          <Typography variant="caption" color="text.secondary"
                            sx={{ display: 'block', maxWidth: 130, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {h.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={h.type} size="small"
                        sx={{ height: 18, fontSize: '0.62rem',
                          bgcolor: h.type === 'ETF' ? 'rgba(108,142,239,0.15)' : 'rgba(0,212,170,0.1)',
                          color: h.type === 'ETF' ? 'primary.light' : 'primary.main' }} />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(h.price)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption"
                        sx={{ color: h.changePercent >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                        {fmtPct(h.changePercent)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${perItem.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">
                        {sharesPerPeriod < 0.001 ? sharesPerPeriod.toFixed(6) : sharesPerPeriod.toFixed(4)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={h.sector} size="small"
                        sx={{ height: 18, fontSize: '0.6rem',
                          bgcolor: (COLORS[h.sector] ?? '#8B93A5') + '20',
                          color: COLORS[h.sector] ?? 'text.secondary' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {h.expenseRatio !== undefined ? `${h.expenseRatio.toFixed(2)}%` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption"
                        sx={{ color: (h.dividendYield ?? 0) > 0 ? 'success.main' : 'text.secondary' }}>
                        {h.dividendYield !== undefined && h.dividendYield > 0 ? `${h.dividendYield.toFixed(1)}%` : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={h.why} placement="left" arrow>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'default' }}>
                          <InfoOutlinedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary"
                            sx={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                            {h.why}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default RecurringTab;
