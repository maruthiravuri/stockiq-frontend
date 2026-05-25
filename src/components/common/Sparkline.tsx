import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  basePrice: number;
  change: number;
  height?: number;
  showTooltip?: boolean;
}

/**
 * Sparkline — generates a realistic intraday price path from
 * just the current price and daily change. No mock data needed.
 */
const Sparkline: React.FC<Props> = ({ basePrice, change, height = 40, showTooltip = false }) => {
  const data = useMemo(() => {
    const open = basePrice - change;
    const points = 24;
    const result = [];
    let price = open;

    for (let i = 0; i <= points; i++) {
      const progress = i / points;
      // Trend toward the actual closing price
      const trend = change * progress;
      // Add some noise that diminishes toward the close
      const noise = (Math.random() - 0.5) * Math.abs(change) * 0.4 * (1 - progress * 0.5);
      price = open + trend + noise;
      result.push({ price: Math.max(0, parseFloat(price.toFixed(2))) });
    }

    // Ensure last point is exactly current price
    result[points] = { price: basePrice };
    return result;
  }, [basePrice, change]);

  const color = change >= 0 ? '#00D4AA' : '#FF4D6A';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
        {showTooltip && (
          <Tooltip
            contentStyle={{ fontSize: '0.7rem', padding: '2px 6px' }}
            formatter={(v: any) => [`$${Number(v).toFixed(2)}`, 'Price']}
            labelFormatter={() => ''}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Sparkline;
