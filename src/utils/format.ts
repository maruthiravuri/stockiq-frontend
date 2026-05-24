export const fmtPrice = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

export const fmtLargeNum = (v: number) => {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  return `$${v.toLocaleString()}`;
};

export const fmtVolume = (v: number) => {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return v.toString();
};

export const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

export const fmtChange = (v: number) =>
  `${v >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v)}`;

export const colorForChange = (v: number, theme: 'dark' | 'light' = 'dark') => {
  if (theme === 'dark') return v >= 0 ? '#00D4AA' : '#FF4D6A';
  return v >= 0 ? '#00875A' : '#D63031';
};

export const genId = () => Math.random().toString(36).slice(2, 9);
