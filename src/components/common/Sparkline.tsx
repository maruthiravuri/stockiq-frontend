import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { generateIntraday } from '../../services/mockData';

interface SparklineProps {
  basePrice: number;
  change: number;
  height?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ basePrice, change, height = 40 }) => {
  const data = useMemo(() => generateIntraday(basePrice, 30), [basePrice]);
  const color = change >= 0 ? '#00D4AA' : '#FF4D6A';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="price" stroke={color} strokeWidth={1.5} dot={false} />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }}
          formatter={(v: any) => [`$${Number(v).toFixed(2)}`, '']}
          labelStyle={{ color: '#8B93A5', fontSize: 10 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Sparkline;
