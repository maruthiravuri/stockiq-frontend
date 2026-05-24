import React from 'react';
import { Box, Paper, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { fmtPrice } from '../../utils/format';

const COLORS = ['#00D4AA', '#6C8EEF', '#FFB84D', '#FF4D6A', '#9B59B6', '#1ABC9C', '#E67E22', '#3498DB'];

const AllocationTab: React.FC = () => {
  const { portfolios, activePortfolioId } = useSelector((s: RootState) => s.portfolio);
  const portfolio = portfolios.find(p => p.id === activePortfolioId);
  if (!portfolio) return null;

  const totalValue = portfolio.holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0);

  const bySector = Object.entries(
    portfolio.holdings.reduce((acc, h) => {
      const v = h.quantity * h.currentPrice;
      acc[h.sector] = (acc[h.sector] || 0) + v;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)), pct: parseFloat(((value / totalValue) * 100).toFixed(1)) }));

  const byAsset = Object.entries(
    portfolio.holdings.reduce((acc, h) => {
      acc[h.assetType] = (acc[h.assetType] || 0) + h.quantity * h.currentPrice;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.toUpperCase(), value: parseFloat(value.toFixed(2)) }));

  const holdingsBar = portfolio.holdings.map(h => ({
    symbol: h.symbol, value: parseFloat((h.quantity * h.currentPrice).toFixed(2)),
    pct: parseFloat(((h.quantity * h.currentPrice / totalValue) * 100).toFixed(1)),
  })).sort((a, b) => b.value - a.value);

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 1.5, height: 260 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>By Sector</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={bySector} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={75} paddingAngle={2}>
                  {bySector.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [fmtPrice(v), 'Value']} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '0.68rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 1.5, height: 260 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>By Asset Type</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byAsset} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={75} paddingAngle={2}>
                  {byAsset.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [fmtPrice(v), 'Value']} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '0.68rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 1.5, height: 260 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>Risk Exposure</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              {[
                { label: 'Growth Tilt', pct: 72 },
                { label: 'Defensive', pct: 48 },
                { label: 'Real Assets', pct: 61 },
                { label: 'Income', pct: 35 },
                { label: 'Volatility (Beta)', pct: 55 },
              ].map(r => (
                <Box key={r.label}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" color="text.secondary">{r.label}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{r.pct}%</Typography>
                  </Box>
                  <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: `${r.pct}%`, borderRadius: 3, bgcolor: r.pct > 60 ? '#00D4AA' : r.pct > 40 ? '#FFB84D' : '#6C8EEF' }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Holdings Weight</Typography>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={holdingsBar} margin={{ bottom: 0 }}>
                <XAxis dataKey="symbol" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: any) => [`${v}%`, 'Weight']} />
                <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
                  {holdingsBar.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllocationTab;
