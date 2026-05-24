import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { usePortfolios, useAllocation } from '../../hooks/useApi';
import { fmtPrice } from '../../utils/format';

const COLORS = ['#00D4AA','#6C8EEF','#FFB84D','#FF4D6A','#9B59B6','#1ABC9C','#E67E22','#3498DB'];

const AllocationTab: React.FC = () => {
  const { data: portfolios } = usePortfolios();
  const portfolioId = portfolios?.[0]?.id || '';
  const { data: allocation, isLoading } = useAllocation(portfolioId);

  if (isLoading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (!allocation) return <Box sx={{ p: 4 }}><Typography color="text.secondary">No portfolio data. Add holdings in the Portfolio tab.</Typography></Box>;

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
        <Paper sx={{ p: 1.5, height: 260 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>By Sector</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={allocation.bySector} dataKey="value" nameKey="label" cx="50%" cy="45%" outerRadius={75} paddingAngle={2}>
                {allocation.bySector.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [fmtPrice(Number(v)), 'Value']} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '0.68rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ p: 1.5, height: 260 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>By Asset Type</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={allocation.byAssetType} dataKey="value" nameKey="label" cx="50%" cy="45%" outerRadius={75} paddingAngle={2}>
                {allocation.byAssetType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [fmtPrice(Number(v)), 'Value']} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '0.68rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ p: 1.5, height: 260 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>Weight by Sector</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            {allocation.bySector.map((s, i) => (
              <Box key={s.label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{Number(s.percent).toFixed(1)}%</Typography>
                </Box>
                <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: `${s.percent}%`, borderRadius: 3, bgcolor: COLORS[i % COLORS.length] }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
      <Paper sx={{ p: 1.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Holdings Weight</Typography>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={allocation.bySector}>
            <XAxis dataKey="label" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(v: any) => [`${Number(v).toFixed(1)}%`, 'Weight']} />
            <Bar dataKey="percent" radius={[3,3,0,0]}>
              {allocation.bySector.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default AllocationTab;
