// Safe number coercion — returns 0 if value is undefined/null/NaN
const safe = (v: number | undefined | null): number => {
  const n = Number(v);
  return isFinite(n) ? n : 0;
};

export const fmtPrice = (v: number | undefined | null) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(safe(v));

export const fmtLargeNum = (v: number | undefined | null) => {
  const n = safe(v);
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};

export const fmtVolume = (v: number | undefined | null) => {
  const n = safe(v);
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
};

export const fmtPct = (v: number | undefined | null) => {
  const n = safe(v);
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
};

export const fmtChange = (v: number | undefined | null) => {
  const n = safe(v);
  return `${n >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  }).format(n)}`;
};

export const colorForChange = (v: number | undefined | null, theme: 'dark' | 'light' = 'dark') => {
  const n = safe(v);
  if (theme === 'dark') return n >= 0 ? '#00D4AA' : '#FF4D6A';
  return n >= 0 ? '#00875A' : '#D63031';
};

export const genId = () => Math.random().toString(36).slice(2, 9);
