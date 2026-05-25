import React, { useMemo } from 'react';
import {
  Box, Paper, Typography, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useBatchQuotes } from '../../hooks/useApi';
import {
  SP100_MOVERS, SP500_VALUE, BUFFETT_PORTFOLIO, AI_STOCKS, AI_ETFS,
  METALS_ETFS, CRYPTO_ASSETS,
} from '../../services/mockData';
import { fmtPrice, fmtPct, fmtLargeNum } from '../../utils/format';
import StockTable from '../common/StockTable';
import AgStockTable from '../common/AgStockTable';

// ── Shared helper: merge live API prices into mock metadata ───────────────────
function mergeWithLive(mockData: any[], liveMap: Record<string, any>) {
  return mockData.map(item => {
    const live = liveMap[item.symbol];
    if (!live) return item;
    return {
      ...item,
      price: Number(live.price),
      change: Number(live.change),
      changePercent: Number(live.changePercent),
      high: Number(live.high ?? item.high),
      low: Number(live.low ?? item.low),
      open: Number(live.open ?? item.open),
      previousClose: Number(live.previousClose ?? item.previousClose),
      volume: Number(live.volume ?? item.volume),
    };
  });
}

function useLiveMerge(mockData: any[]) {
  const symbols = useMemo(() => mockData.map(s => s.symbol), []);
  const { data: quotes, isLoading, isError } = useBatchQuotes(symbols);
  const liveMap = useMemo(() => {
    if (!quotes) return {};
    return Object.fromEntries(quotes.map(q => [q.symbol, q]));
  }, [quotes]);
  const merged = useMemo(() => mergeWithLive(mockData, liveMap), [mockData, liveMap]);
  return { data: merged, isLoading, isError, hasLive: !!quotes?.length };
}

function LiveBadge({ isLoading, hasLive, isError }: { isLoading: boolean; hasLive: boolean; isError: boolean }) {
  if (isLoading) return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <CircularProgress size={10} />
      <Typography variant="caption" color="text.secondary">Loading live prices...</Typography>
    </Box>
  );
  if (hasLive) return (
    <Chip label="● LIVE" size="small"
      sx={{ height: 18, fontSize: '0.62rem', bgcolor: 'rgba(0,212,170,0.15)', color: 'success.main', fontWeight: 700 }} />
  );
  if (isError) return (
    <Chip label="DEMO" size="small"
      sx={{ height: 18, fontSize: '0.62rem', bgcolor: 'rgba(255,255,255,0.06)', color: 'text.secondary' }} />
  );
  return null;
}

// ── SP100 Movers ──────────────────────────────────────────────────────────────
export const SP100Tab: React.FC = () => {
  const { data: stocks, isLoading, isError, hasLive } = useLiveMerge(SP100_MOVERS);
  const sorted = [...stocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  const gainers = sorted.filter(s => s.change >= 0).slice(0, 5);
  const losers  = sorted.filter(s => s.change < 0).slice(0, 5);

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>S&P 100 Movers</Typography>
        <LiveBadge isLoading={isLoading} hasLive={hasLive} isError={isError} />
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700, mb: 1 }}>▲ Top Gainers</Typography>
            {gainers.map(s => (
              <Box key={s.symbol} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box><Typography variant="body2" sx={{ fontWeight: 700 }}>{s.symbol}</Typography><Typography variant="caption" color="text.secondary">{s.name}</Typography></Box>
                <Box sx={{ textAlign: 'right' }}><Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(s.price)}</Typography><Typography variant="caption" sx={{ color: 'success.main' }}>{fmtPct(s.changePercent)}</Typography></Box>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 700, mb: 1 }}>▼ Top Losers</Typography>
            {losers.map(s => (
              <Box key={s.symbol} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box><Typography variant="body2" sx={{ fontWeight: 700 }}>{s.symbol}</Typography><Typography variant="caption" color="text.secondary">{s.name}</Typography></Box>
                <Box sx={{ textAlign: 'right' }}><Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(s.price)}</Typography><Typography variant="caption" sx={{ color: 'error.main' }}>{fmtPct(s.changePercent)}</Typography></Box>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>% Move Heatmap — Top 20</Typography>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={sorted.slice(0, 20).map(s => ({ name: s.symbol, v: parseFloat(s.changePercent.toFixed(2)) }))}>
                <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                <YAxis tick={{ fontSize: 8 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: any) => [`${Number(v).toFixed(2)}%`, 'Change']} />
                <Bar dataKey="v" radius={[2,2,0,0]}>
                  {sorted.slice(0, 20).map((s, i) => <Cell key={i} fill={s.changePercent >= 0 ? '#00D4AA' : '#FF4D6A'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      <Paper sx={{ flex: 1, minHeight: 300 }}>
        <StockTable data={stocks as any} title="" subtitle="" />
      </Paper>
    </Box>
  );
};

// ── SP500 Value ───────────────────────────────────────────────────────────────
export const SP500ValueTab: React.FC = () => {
  const { data: stocks, isLoading, hasLive, isError } = useLiveMerge(SP500_VALUE);
  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>S&P 500 Value Stocks</Typography>
        <LiveBadge isLoading={isLoading} hasLive={hasLive} isError={isError} />
      </Box>
      <Paper sx={{ flex: 1, minHeight: 500 }}>
        <StockTable data={stocks as any} title="" subtitle="Filtered by P/E, P/B, dividend yield" showValueCols />
      </Paper>
    </Box>
  );
};

// ── Buffett Portfolio ─────────────────────────────────────────────────────────
export const BuffettTab: React.FC = () => {
  const { data: stocks, isLoading, hasLive, isError } = useLiveMerge(BUFFETT_PORTFOLIO);
  const alloc = [
    { name: 'AAPL', pct: 44.2 }, { name: 'BAC', pct: 9.3 }, { name: 'AXP', pct: 8.7 },
    { name: 'KO', pct: 7.9 },   { name: 'CVX', pct: 7.2 }, { name: 'OXY', pct: 4.8 },
    { name: 'Others', pct: 17.9 },
  ];
  const COLORS = ['#00D4AA','#6C8EEF','#FFB84D','#FF4D6A','#9B59B6','#1ABC9C','#5A6478'];

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Berkshire Hathaway Portfolio</Typography>
        <LiveBadge isLoading={isLoading} hasLive={hasLive} isError={isError} />
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Portfolio Allocation</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={alloc} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={50} />
                <Tooltip formatter={(v: any) => [`${v}%`, 'Allocation']} />
                <Bar dataKey="pct" radius={[0,3,3,0]}>
                  {alloc.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Buffett Criteria</Typography>
            {[
              { label: 'Economic Moat', value: 'Wide (all holdings)' },
              { label: 'Average P/E',   value: '14.2x' },
              { label: 'Dividend Focus', value: 'KO, CVX, BAC' },
              { label: 'Concentration', value: 'Top 5 = 77% of portfolio' },
              { label: 'Holding Period', value: 'Average 12+ years' },
            ].map(r => (
              <Box key={r.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">{r.label}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{r.value}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
      <Paper sx={{ flex: 1, minHeight: 300 }}>
        <StockTable data={stocks as any} title="" subtitle="Top disclosed Berkshire positions" showValueCols />
      </Paper>
    </Box>
  );
};

// ── AI Stocks & ETFs ──────────────────────────────────────────────────────────
export const AITab: React.FC = () => {
  const { data: aiStocks, isLoading, hasLive, isError } = useLiveMerge(AI_STOCKS);
  const aiEtfSymbols = AI_ETFS.map((e: any) => e.symbol);
  const { data: etfQuotes } = useBatchQuotes(aiEtfSymbols);
  const etfMap = useMemo(() =>
    Object.fromEntries((etfQuotes || []).map(q => [q.symbol, q])), [etfQuotes]);
  const mergedEtfs = AI_ETFS.map((e: any) => {
    const live = etfMap[e.symbol];
    return live ? { ...e, price: Number(live.price), change: Number(live.change), changePercent: Number(live.changePercent) } : e;
  });

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>AI Stocks & ETFs</Typography>
        <LiveBadge isLoading={isLoading} hasLive={hasLive} isError={isError} />
      </Box>
      <Paper sx={{ minHeight: 280 }}>
        <StockTable data={aiStocks as any} title="AI & Semiconductor Stocks" subtitle="Primary AI/chip exposure" showExtra />
      </Paper>
      <Paper>
        <Box sx={{ p: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>AI & Robotics ETFs</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead><TableRow>
                <TableCell>Ticker</TableCell><TableCell>Name</TableCell>
                <TableCell align="right">Price</TableCell><TableCell align="right">Change</TableCell>
                <TableCell align="right">AUM</TableCell><TableCell align="right">Exp. Ratio</TableCell>
              </TableRow></TableHead>
              <TableBody>
                {mergedEtfs.map((etf: any) => (
                  <TableRow key={etf.symbol} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{etf.symbol}</Typography></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{etf.name}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(etf.price)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption" sx={{ color: etf.changePercent >= 0 ? 'success.main' : 'error.main' }}>{fmtPct(etf.changePercent)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption">{fmtLargeNum(etf.aum ?? 0)}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption">{etf.expenseRatio?.toFixed(2)}%</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
};

// ── Metals ETFs ───────────────────────────────────────────────────────────────
export const MetalsTab: React.FC = () => {
  const { data: etfs, isLoading, hasLive, isError } = useLiveMerge(METALS_ETFS);
  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Metals ETFs</Typography>
        <LiveBadge isLoading={isLoading} hasLive={hasLive} isError={isError} />
      </Box>
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead><TableRow>
              <TableCell>Ticker</TableCell><TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell><TableCell align="right">NAV</TableCell>
              <TableCell align="right">Change</TableCell><TableCell align="right">AUM</TableCell>
              <TableCell align="right">Exp. Ratio</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {etfs.map((etf: any) => (
                <TableRow key={etf.symbol} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{etf.symbol}</Typography></TableCell>
                  <TableCell><Typography variant="caption">{etf.name}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(etf.price)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption">{fmtPrice(etf.nav ?? etf.price)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption" sx={{ color: etf.changePercent >= 0 ? 'success.main' : 'error.main' }}>{fmtPct(etf.changePercent)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption">{fmtLargeNum(etf.aum ?? 0)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption">{etf.expenseRatio?.toFixed(2)}%</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

// ── Crypto Top 5 ──────────────────────────────────────────────────────────────
export const CryptoTab: React.FC = () => {
  const { data: quotes, isLoading } = useBatchQuotes(['BTC/USD','ETH/USD','SOL/USD','XRP/USD','ADA/USD']);

  // Merge live crypto quotes with mock metadata (for name, rank, marketCap)
  const assets = CRYPTO_ASSETS.map((a: any, i: number) => {
    const live = quotes?.[i];
    return live ? {
      ...a,
      price: Number(live.price),
      change: Number(live.change),
      changePercent: Number(live.changePercent),
    } : a;
  });
  const hasLive = !!quotes?.length;

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Crypto Top 5</Typography>
        {isLoading
          ? <CircularProgress size={12} />
          : <Chip label={hasLive ? '● LIVE' : 'DEMO'} size="small"
              sx={{ height: 18, fontSize: '0.62rem',
                bgcolor: hasLive ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.06)',
                color: hasLive ? 'success.main' : 'text.secondary', fontWeight: 700 }} />}
      </Box>
      <Grid container spacing={2}>
        {assets.map((a: any) => (
          <Grid item xs={12} sm={6} md={4} key={a.symbol}>
            <Paper sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: 'rgba(0,212,170,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.65rem' }}>#{a.rank}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{a.symbol}</Typography>
                    <Typography variant="caption" color="text.secondary">{a.name}</Typography>
                  </Box>
                </Box>
                <Chip size="small" label={fmtPct(a.changePercent)}
                  sx={{ bgcolor: a.changePercent >= 0 ? 'rgba(0,212,170,0.15)' : 'rgba(255,77,106,0.15)',
                        color: a.changePercent >= 0 ? 'success.main' : 'error.main', height: 20, fontSize: '0.65rem' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {a.price > 1 ? fmtPrice(a.price) : `$${a.price.toFixed(4)}`}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">Mkt Cap: {fmtLargeNum(a.marketCap)}</Typography>
                <Typography variant="caption" color="text.secondary">Vol: {fmtLargeNum(a.volume)}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
