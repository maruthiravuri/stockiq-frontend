import React, { useMemo } from 'react';
import {
  Box, Paper, Typography, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, LinearProgress, CircularProgress,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DIVIDEND_ETF_SYMBOLS, DIVIDEND_ETF_CRITERIA } from '../../config/research';
import { useBatchQuotes } from '../../hooks/useApi';
import { fmtPrice, fmtLargeNum } from '../../utils/format';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const COLORS = ['#00D4AA','#6C8EEF','#FFB84D','#FF4D6A','#9B59B6','#1ABC9C','#E67E22','#3498DB','#E91E63','#8BC34A'];

const DividendEtfTab: React.FC = () => {
  const symbols = DIVIDEND_ETF_SYMBOLS.map(e => e.symbol);
  const { data: quotes, isLoading } = useBatchQuotes(symbols);
  const hasLive = !!quotes?.length;

  const etfs = useMemo(() => {
    const qMap = Object.fromEntries((quotes ?? []).map(q => [q.symbol, q]));
    return DIVIDEND_ETF_SYMBOLS.map(e => {
      const live = qMap[e.symbol];
      return live
        ? { ...e, price: Number(live.price), change: Number(live.change), changePercent: Number(live.changePercent) }
        : { ...e, change: 0, changePercent: 0 };
    });
  }, [quotes]);

  const sorted = [...etfs].sort((a, b) => b.dividendYield - a.dividendYield);
  const avgYield = (etfs.reduce((s, e) => s + e.dividendYield, 0) / etfs.length).toFixed(1);
  const maxYield = Math.max(...etfs.map(e => e.dividendYield));
  const minExpense = Math.min(...etfs.map(e => e.expenseRatio));
  const monthlyCount = etfs.filter(e => e.frequency === 'Monthly').length;
  const lowestCostEtf = etfs.find(e => e.expenseRatio === minExpense);

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MonetizationOnIcon sx={{ color: 'primary.main', fontSize: 22 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Top 10 Dividend ETFs</Typography>
            {isLoading
              ? <CircularProgress size={12} />
              : <Chip label={hasLive ? '● LIVE' : 'DEMO'} size="small"
                  sx={{ height: 18, fontSize: '0.62rem',
                    bgcolor: hasLive ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.06)',
                    color: hasLive ? 'success.main' : 'text.secondary', fontWeight: 700 }} />}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {DIVIDEND_ETF_CRITERIA.description}
          </Typography>
        </Box>
      </Box>

      {/* Active criteria */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">Criteria:</Typography>
        {DIVIDEND_ETF_CRITERIA.criteria.map((c, i) => (
          <Chip key={i} label={c.label} size="small"
            sx={{ height: 22, fontSize: '0.68rem', bgcolor: 'rgba(0,212,170,0.1)', color: 'primary.main' }} />
        ))}
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          · Edit in{' '}
          <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 4px', borderRadius: 3 }}>
            src/config/research.ts → DIVIDEND_ETF_SYMBOLS
          </code>
        </Typography>
      </Box>

      {/* Summary cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 1.5 }}>
        <Paper sx={{ p: 1.5, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Avg Yield</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>{avgYield}%</Typography>
        </Paper>
        <Paper sx={{ p: 1.5, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Highest Yield</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{maxYield.toFixed(1)}%</Typography>
          <Typography variant="caption" color="text.secondary">{sorted[0]?.symbol}</Typography>
        </Paper>
        <Paper sx={{ p: 1.5, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Lowest Expense</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{minExpense.toFixed(2)}%</Typography>
          <Typography variant="caption" color="text.secondary">{lowestCostEtf?.symbol}</Typography>
        </Paper>
        <Paper sx={{ p: 1.5, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Monthly Payers</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFB84D' }}>{monthlyCount}</Typography>
          <Typography variant="caption" color="text.secondary">of {etfs.length} ETFs</Typography>
        </Paper>
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 2 }}>
        <Paper sx={{ p: 1.5, height: 240 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Dividend Yield Comparison</Typography>
          <ResponsiveContainer width="100%" height={195}>
            <BarChart data={sorted.map(e => ({ name: e.symbol, yield: e.dividendYield }))}>
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: any) => [`${Number(v).toFixed(1)}%`, 'Yield']} contentStyle={{ fontSize: '0.75rem' }} />
              <Bar dataKey="yield" radius={[3, 3, 0, 0]}>
                {sorted.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ p: 1.5, height: 240 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Top 5 — Yield vs Cost</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0.5 }}>
            {sorted.slice(0, 5).map((e, i) => (
              <Box key={e.symbol}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[i] }} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{e.symbol}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>{e.dividendYield.toFixed(1)}%</Typography>
                    <Typography variant="caption" color="text.secondary">{e.expenseRatio.toFixed(2)}% fee</Typography>
                  </Box>
                </Box>
                <LinearProgress variant="determinate" value={(e.dividendYield / 10) * 100}
                  sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.07)',
                    '& .MuiLinearProgress-bar': { bgcolor: COLORS[i], borderRadius: 3 } }} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Main table */}
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ETF</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Today</TableCell>
                <TableCell align="right" sx={{ color: 'success.main', fontWeight: 700 }}>Yield</TableCell>
                <TableCell align="right">Expense</TableCell>
                <TableCell align="right">AUM</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Strategy</TableCell>
                <TableCell align="right">Since</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((etf, i) => (
                <TableRow key={etf.symbol} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        bgcolor: COLORS[i % COLORS.length] + '25',
                        border: `1.5px solid ${COLORS[i % COLORS.length]}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: COLORS[i % COLORS.length] }}>
                          #{i + 1}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{etf.symbol}</Typography>
                        <Typography variant="caption" color="text.secondary"
                          sx={{ display: 'block', maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {etf.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(etf.price)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption"
                      sx={{ color: (etf.changePercent ?? 0) >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                      {(etf.changePercent ?? 0) >= 0 ? '+' : ''}{(etf.changePercent ?? 0).toFixed(2)}%
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={`${etf.dividendYield.toFixed(1)}%`} size="small"
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700,
                        bgcolor: etf.dividendYield >= 5 ? 'rgba(0,212,170,0.2)' : 'rgba(0,212,170,0.08)',
                        color: 'success.main' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" sx={{
                      color: etf.expenseRatio <= 0.10 ? 'success.main' : etf.expenseRatio >= 0.40 ? 'warning.main' : 'text.primary',
                      fontWeight: 600,
                    }}>
                      {etf.expenseRatio.toFixed(2)}%
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption">{fmtLargeNum(etf.aum)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={etf.frequency} size="small"
                      sx={{ height: 18, fontSize: '0.62rem',
                        bgcolor: etf.frequency === 'Monthly' ? 'rgba(108,142,239,0.15)' : 'rgba(255,255,255,0.06)',
                        color: etf.frequency === 'Monthly' ? 'primary.light' : 'text.secondary' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary"
                      sx={{ maxWidth: 180, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {etf.focus}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" color="text.secondary">{etf.inception}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DividendEtfTab;
