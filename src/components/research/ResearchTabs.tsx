import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { SP100_MOVERS, SP500_VALUE, BUFFETT_PORTFOLIO, AI_STOCKS, AI_ETFS, METALS_ETFS, CRYPTO_ASSETS } from '../../services/mockData';
import { Stock, ETF, CryptoAsset } from '../../types';
import { fmtPrice, fmtPct, fmtChange, fmtLargeNum, fmtVolume } from '../../utils/format';
import StockTable from '../common/StockTable';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ── SP100 Movers ─────────────────────────────────────────────────────────────
export const SP100Tab: React.FC = () => {
  const [stocks, setStocks] = useState(SP100_MOVERS);
  useEffect(() => {
    const t = setInterval(() => setStocks(p => p.map(s => {
      const d = (Math.random() - 0.49) * s.price * 0.001;
      return { ...s, price: parseFloat((s.price + d).toFixed(2)), change: parseFloat((s.change + d).toFixed(2)), changePercent: parseFloat(((s.change + d) / s.previousClose * 100).toFixed(2)) };
    })), 5000);
    return () => clearInterval(t);
  }, []);

  const sorted = [...stocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  const gainers = sorted.filter(s => s.change >= 0).slice(0, 5);
  const losers = sorted.filter(s => s.change < 0).slice(0, 5);

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700, mb: 1 }}>▲ Top Gainers</Typography>
            {gainers.map(s => (
              <Box key={s.symbol} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
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
              <Box key={s.symbol} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box><Typography variant="body2" sx={{ fontWeight: 700 }}>{s.symbol}</Typography><Typography variant="caption" color="text.secondary">{s.name}</Typography></Box>
                <Box sx={{ textAlign: 'right' }}><Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(s.price)}</Typography><Typography variant="caption" sx={{ color: 'error.main' }}>{fmtPct(s.changePercent)}</Typography></Box>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ height: 200 }}>
            <Typography variant="caption" sx={{ p: 1.5, display: 'block', color: 'text.secondary' }}>S&P 100 — % Move Heatmap</Typography>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={sorted.slice(0, 20).map(s => ({ name: s.symbol, v: s.changePercent }))}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: any) => [`${Number(v).toFixed(2)}%`, 'Change']} />
                <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                  {sorted.slice(0, 20).map((s, i) => <Cell key={i} fill={s.changePercent >= 0 ? '#00D4AA' : '#FF4D6A'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      <Paper sx={{ flex: 1, minHeight: 300 }}>
        <StockTable data={stocks} title="S&P 100 Movers" subtitle="Sorted by absolute % move" />
      </Paper>
    </Box>
  );
};

// ── SP500 Value ───────────────────────────────────────────────────────────────
export const SP500ValueTab: React.FC = () => (
  <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
    <Paper sx={{ height: '100%', minHeight: 500 }}>
      <StockTable data={SP500_VALUE} title="S&P 500 Value Stocks" subtitle="Filtered by fundamental value metrics" showValueCols />
    </Paper>
  </Box>
);

// ── Buffett Portfolio ─────────────────────────────────────────────────────────
export const BuffettTab: React.FC = () => {
  const alloc = [
    { name: 'AAPL', pct: 44.2 }, { name: 'BAC', pct: 9.3 }, { name: 'AXP', pct: 8.7 },
    { name: 'KO', pct: 7.9 }, { name: 'CVX', pct: 7.2 }, { name: 'OXY', pct: 4.8 },
    { name: 'Others', pct: 17.9 },
  ];
  const COLORS = ['#00D4AA', '#6C8EEF', '#FFB84D', '#FF4D6A', '#9B59B6', '#1ABC9C', '#5A6478'];

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>Berkshire Hathaway — Allocation</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={alloc} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={50} />
                <Tooltip formatter={(v: any) => [`${v}%`, 'Allocation']} />
                <Bar dataKey="pct" radius={[0, 3, 3, 0]}>
                  {alloc.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Key Buffett Criteria</Typography>
            {[
              { label: 'Economic Moat', value: 'Wide (all holdings)' },
              { label: 'Average P/E', value: '14.2x' },
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
        <StockTable data={BUFFETT_PORTFOLIO} title="Berkshire Hathaway Holdings" subtitle="Top disclosed positions" showValueCols />
      </Paper>
    </Box>
  );
};

// ── AI Stocks & ETFs ──────────────────────────────────────────────────────────
export const AITab: React.FC = () => (
  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
    <Paper sx={{ minHeight: 300 }}>
      <StockTable data={AI_STOCKS} title="AI Stocks" subtitle="Equities with primary AI/semiconductor exposure" showExtra />
    </Paper>
    <Paper sx={{ minHeight: 250 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>AI & Robotics ETFs</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead><TableRow>
              <TableCell>Ticker</TableCell><TableCell>Name</TableCell><TableCell align="right">Price</TableCell>
              <TableCell align="right">Change</TableCell><TableCell align="right">AUM</TableCell><TableCell align="right">Exp. Ratio</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {AI_ETFS.map((etf, i) => (
                <TableRow key={etf.symbol} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{etf.symbol}</Typography></TableCell>
                  <TableCell><Typography variant="caption" color="text.secondary">{etf.name}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2">{fmtPrice(etf.price)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption" sx={{ color: etf.change >= 0 ? 'success.main' : 'error.main' }}>{fmtPct(etf.changePercent)}</Typography></TableCell>
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

// ── Metals ETFs ───────────────────────────────────────────────────────────────
export const MetalsTab: React.FC = () => (
  <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
    <Paper>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Metals ETFs</Typography>
        <Typography variant="caption" color="text.secondary">Gold, Silver & Copper — Physical and futures-backed funds</Typography>
        <TableContainer sx={{ mt: 1.5 }}>
          <Table size="small">
            <TableHead><TableRow>
              <TableCell>Ticker</TableCell><TableCell>Name</TableCell><TableCell align="right">Price</TableCell>
              <TableCell align="right">NAV</TableCell><TableCell align="right">Change</TableCell>
              <TableCell align="right">AUM</TableCell><TableCell align="right">Expense Ratio</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {METALS_ETFS.map(etf => (
                <TableRow key={etf.symbol} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{etf.symbol}</Typography></TableCell>
                  <TableCell><Typography variant="caption">{etf.name}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtPrice(etf.price)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption">{fmtPrice(etf.nav ?? etf.price)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption" sx={{ color: etf.change >= 0 ? 'success.main' : 'error.main' }}>{fmtPct(etf.changePercent)}</Typography></TableCell>
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

// ── Crypto ────────────────────────────────────────────────────────────────────
export const CryptoTab: React.FC = () => {
  const [assets, setAssets] = useState(CRYPTO_ASSETS);
  useEffect(() => {
    const t = setInterval(() => setAssets(p => p.map(a => {
      const d = (Math.random() - 0.49) * a.price * 0.003;
      const np = parseFloat((a.price + d).toFixed(a.price > 100 ? 2 : 4));
      const nc = parseFloat((a.change + d).toFixed(a.price > 100 ? 2 : 4));
      return { ...a, price: np, change: nc, changePercent: parseFloat(((nc / (np - nc)) * 100).toFixed(2)) };
    })), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {assets.map(a => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={a.symbol}>
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
                <Chip size="small" label={fmtPct(a.changePercent)} sx={{ bgcolor: a.changePercent >= 0 ? 'rgba(0,212,170,0.15)' : 'rgba(255,77,106,0.15)', color: a.changePercent >= 0 ? 'success.main' : 'error.main', height: 20, fontSize: '0.65rem' }} />
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
