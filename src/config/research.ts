/**
 * ═══════════════════════════════════════════════════════════════
 *  STOCKIQ — RESEARCH CONFIGURATION
 *
 *  This is the single file to edit for:
 *    1. SYMBOL LISTS  — which stocks appear in each tab
 *    2. SCREENER PRESETS — the quick-filter buttons
 *    3. SCREENER FILTER FIELDS — what you can filter on
 *
 *  Live prices are always fetched from the API for whatever symbols
 *  are listed here. The metadata (name, sector, P/E etc.) comes from
 *  this file as a fallback when the API doesn't return it.
 * ═══════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────
//  1. SYMBOL LISTS
//  Add, remove, or swap any symbol in any tab.
//  Format: { symbol, name, price (fallback), sector, ...extras }
// ─────────────────────────────────────────────────────────────

export const MAG7_SYMBOLS = [
  { symbol: 'AAPL',  name: 'Apple Inc.',           price: 189.84, sector: 'Technology' },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',       price: 374.51, sector: 'Technology' },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',           price: 495.22, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',          price: 152.19, sector: 'Communication Services' },
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',        price: 178.35, sector: 'Consumer Discretionary' },
  { symbol: 'META',  name: 'Meta Platforms Inc.',    price: 481.73, sector: 'Communication Services' },
  { symbol: 'TSLA',  name: 'Tesla Inc.',             price: 248.42, sector: 'Consumer Discretionary' },
];

export const SP100_SYMBOLS = [
  { symbol: 'LLY',   name: 'Eli Lilly & Co.',        price: 742.18, sector: 'Healthcare' },
  { symbol: 'V',     name: 'Visa Inc.',               price: 278.34, sector: 'Financials' },
  { symbol: 'JNJ',   name: 'Johnson & Johnson',       price: 152.67, sector: 'Healthcare' },
  { symbol: 'WMT',   name: 'Walmart Inc.',            price: 168.43, sector: 'Consumer Staples' },
  { symbol: 'JPM',   name: 'JPMorgan Chase',          price: 196.52, sector: 'Financials' },
  { symbol: 'XOM',   name: 'Exxon Mobil Corp.',       price: 108.74, sector: 'Energy' },
  { symbol: 'UNH',   name: 'UnitedHealth Group',      price: 524.19, sector: 'Healthcare' },
  { symbol: 'MA',    name: 'Mastercard Inc.',         price: 449.27, sector: 'Financials' },
  { symbol: 'HD',    name: 'Home Depot Inc.',         price: 342.56, sector: 'Consumer Discretionary' },
  { symbol: 'PG',    name: 'Procter & Gamble',        price: 158.23, sector: 'Consumer Staples' },
  { symbol: 'COST',  name: 'Costco Wholesale',        price: 712.44, sector: 'Consumer Staples' },
  { symbol: 'ABBV',  name: 'AbbVie Inc.',             price: 178.92, sector: 'Healthcare' },
  { symbol: 'BAC',   name: 'Bank of America',         price: 34.17,  sector: 'Financials' },
  { symbol: 'KO',    name: 'Coca-Cola Co.',           price: 62.18,  sector: 'Consumer Staples' },
  { symbol: 'MRK',   name: 'Merck & Co.',             price: 114.52, sector: 'Healthcare' },
  { symbol: 'AVGO',  name: 'Broadcom Inc.',           price: 1234.67,sector: 'Technology' },
  { symbol: 'CVX',   name: 'Chevron Corp.',           price: 154.38, sector: 'Energy' },
  { symbol: 'PEP',   name: 'PepsiCo Inc.',            price: 172.41, sector: 'Consumer Staples' },
  { symbol: 'NFLX',  name: 'Netflix Inc.',            price: 614.29, sector: 'Communication Services' },
  { symbol: 'ORCL',  name: 'Oracle Corp.',            price: 123.48, sector: 'Technology' },
  // Add more S&P 100 symbols here ↓
  // { symbol: 'CRM',  name: 'Salesforce Inc.',        price: 280, sector: 'Technology' },
  // { symbol: 'NOW',  name: 'ServiceNow Inc.',        price: 750, sector: 'Technology' },
];

export const SP500_VALUE_SYMBOLS = [
  { symbol: 'BRK.B', name: 'Berkshire Hathaway',     price: 358.24, sector: 'Financials',        peRatio: 8.2,  pbRatio: 1.4, dividendYield: 0 },
  { symbol: 'ABBV',  name: 'AbbVie Inc.',             price: 178.92, sector: 'Healthcare',        peRatio: 14.1, pbRatio: 36.2,dividendYield: 3.8 },
  { symbol: 'MO',    name: 'Altria Group',            price: 44.23,  sector: 'Consumer Staples',  peRatio: 8.9,  pbRatio: 0,   dividendYield: 9.2 },
  { symbol: 'T',     name: 'AT&T Inc.',               price: 18.47,  sector: 'Communication Services', peRatio: 7.1, pbRatio: 1.1, dividendYield: 6.8 },
  { symbol: 'VZ',    name: 'Verizon Communications',  price: 38.14,  sector: 'Communication Services', peRatio: 8.4, pbRatio: 1.8, dividendYield: 6.5 },
  { symbol: 'IBM',   name: 'IBM Corp.',               price: 148.32, sector: 'Technology',        peRatio: 18.2, pbRatio: 7.1, dividendYield: 4.1 },
  { symbol: 'PFE',   name: 'Pfizer Inc.',             price: 27.84,  sector: 'Healthcare',        peRatio: 10.8, pbRatio: 1.8, dividendYield: 6.1 },
  { symbol: 'WBA',   name: 'Walgreens Boots Alliance',price: 21.34,  sector: 'Consumer Staples',  peRatio: 5.2,  pbRatio: 0.8, dividendYield: 8.4 },
  { symbol: 'CVS',   name: 'CVS Health Corp.',        price: 63.18,  sector: 'Healthcare',        peRatio: 9.1,  pbRatio: 1.3, dividendYield: 3.8 },
  { symbol: 'GM',    name: 'General Motors',          price: 44.72,  sector: 'Consumer Discretionary', peRatio: 5.8, pbRatio: 0.8, dividendYield: 1.0 },
  // Add more value stocks here ↓
];

export const BUFFETT_SYMBOLS = [
  { symbol: 'AAPL',  name: 'Apple Inc.',             price: 189.84, sector: 'Technology',   peRatio: 28.5, weight: 44.2 },
  { symbol: 'BAC',   name: 'Bank of America',        price: 34.17,  sector: 'Financials',   peRatio: 10.2, weight: 9.3 },
  { symbol: 'AXP',   name: 'American Express',       price: 218.43, sector: 'Financials',   peRatio: 18.7, weight: 8.7 },
  { symbol: 'KO',    name: 'Coca-Cola Co.',          price: 62.18,  sector: 'Consumer Staples', peRatio: 22.1, weight: 7.9 },
  { symbol: 'CVX',   name: 'Chevron Corp.',          price: 154.38, sector: 'Energy',        peRatio: 12.4, weight: 7.2 },
  { symbol: 'OXY',   name: 'Occidental Petroleum',  price: 58.92,  sector: 'Energy',        peRatio: 11.8, weight: 4.8 },
  { symbol: 'KHC',   name: 'Kraft Heinz Co.',        price: 35.41,  sector: 'Consumer Staples', peRatio: 14.2, weight: 3.7 },
  { symbol: 'USB',   name: 'US Bancorp',             price: 41.83,  sector: 'Financials',   peRatio: 11.1, weight: 3.6 },
  { symbol: 'DVA',   name: 'DaVita Inc.',            price: 138.64, sector: 'Healthcare',   peRatio: 15.8, weight: 1.1 },
  // Add more Berkshire holdings here ↓
  // { symbol: 'MCO', name: 'Moody\'s Corp.', price: 420, sector: 'Financials', weight: 2.1 },
];

export const AI_STOCK_SYMBOLS = [
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',           price: 495.22, sector: 'Technology' },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',        price: 374.51, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',          price: 152.19, sector: 'Technology' },
  { symbol: 'AMD',   name: 'Advanced Micro Devices', price: 148.37, sector: 'Technology' },
  { symbol: 'PLTR',  name: 'Palantir Technologies',  price: 24.18,  sector: 'Technology' },
  { symbol: 'ANET',  name: 'Arista Networks',        price: 278.43, sector: 'Technology' },
  { symbol: 'ARM',   name: 'Arm Holdings',           price: 142.67, sector: 'Technology' },
  { symbol: 'SMCI',  name: 'Super Micro Computer',   price: 478.23, sector: 'Technology' },
  // Add more AI stocks here ↓
  // { symbol: 'MRVL', name: 'Marvell Technology', price: 72, sector: 'Technology' },
  // { symbol: 'TSM',  name: 'Taiwan Semiconductor', price: 145, sector: 'Technology' },
];

export const AI_ETF_SYMBOLS = [
  { symbol: 'AIQ',  name: 'AI & Big Data ETF',          price: 32.18, expenseRatio: 0.68, aum: 2800000000 },
  { symbol: 'BOTZ', name: 'Global Robotics & AI ETF',   price: 28.43, expenseRatio: 0.68, aum: 2400000000 },
  { symbol: 'ARKQ', name: 'ARK Autonomous Tech ETF',    price: 54.17, expenseRatio: 0.75, aum: 800000000 },
  { symbol: 'ROBO', name: 'ROBO Global Robotics ETF',   price: 58.92, expenseRatio: 0.95, aum: 1200000000 },
  // Add more AI ETFs here ↓
  // { symbol: 'IRBO', name: 'iShares Robotics & AI ETF', price: 30, expenseRatio: 0.47, aum: 400000000 },
];

export const METALS_ETF_SYMBOLS = [
  { symbol: 'GLD',  name: 'SPDR Gold Shares',            price: 187.34, nav: 187.20, expenseRatio: 0.40, aum: 57000000000 },
  { symbol: 'IAU',  name: 'iShares Gold Trust',          price: 38.47,  nav: 38.44,  expenseRatio: 0.25, aum: 29000000000 },
  { symbol: 'SLV',  name: 'iShares Silver Trust',        price: 22.18,  nav: 22.15,  expenseRatio: 0.50, aum: 11000000000 },
  { symbol: 'SIVR', name: 'abrdn Physical Silver',       price: 23.41,  nav: 23.38,  expenseRatio: 0.30, aum: 1200000000 },
  { symbol: 'CPER', name: 'US Copper Index Fund',        price: 28.74,  nav: 28.70,  expenseRatio: 0.65, aum: 230000000 },
  { symbol: 'PDBC', name: 'Invesco Optimum Yield ETF',   price: 13.47,  nav: 13.45,  expenseRatio: 0.59, aum: 4200000000 },
  // Add more metals ETFs here ↓
  // { symbol: 'GDX', name: 'VanEck Gold Miners ETF', price: 32, expenseRatio: 0.51, aum: 13000000000 },
];

export const CRYPTO_SYMBOLS = [
  { symbol: 'BTCUSD', name: 'Bitcoin',  rank: 1, marketCap: 1_280_000_000_000, volume: 28_000_000_000 },
  { symbol: 'ETHUSD', name: 'Ethereum', rank: 2, marketCap: 380_000_000_000,   volume: 12_000_000_000 },
  { symbol: 'SOLUSD', name: 'Solana',   rank: 3, marketCap: 82_000_000_000,    volume: 3_200_000_000 },
  { symbol: 'XRPUSD', name: 'Ripple',   rank: 4, marketCap: 68_000_000_000,    volume: 2_800_000_000 },
  { symbol: 'ADAUSD', name: 'Cardano',  rank: 5, marketCap: 24_000_000_000,    volume: 680_000_000 },
  // Add more crypto pairs here ↓
  // { symbol: 'DOTUSD', name: 'Polkadot', rank: 6, marketCap: 12_000_000_000, volume: 300_000_000 },
];

// Market bar symbols (top ticker strip)
export const MARKET_BAR_SYMBOLS = ['SPY', 'QQQ', 'DIA', 'IWM', 'GLD', 'TLT', 'VIX'];
export const MARKET_BAR_LABELS: Record<string, string> = {
  SPY: 'S&P 500',
  QQQ: 'NASDAQ',
  DIA: 'DOW',
  IWM: 'Russell 2K',
  GLD: 'Gold',
  TLT: '20Y Bond',
  VIX: 'VIX',
  // Add more ↓
};


// ─────────────────────────────────────────────────────────────
//  2. SCREENER PRESETS
//  Quick-filter buttons shown at the top of the Screener tab.
//  Edit labels or filter values, or add your own presets.
// ─────────────────────────────────────────────────────────────

export interface ScreenerFilter {
  id: string;
  type: 'numeric' | 'string';
  field: string;
  operator: string;
  value: string;
}

export interface ScreenerPreset {
  label: string;
  filters: ScreenerFilter[];
}

export const SCREENER_PRESETS: ScreenerPreset[] = [
  {
    label: 'High Dividend (>3%)',
    filters: [{ id: '1', type: 'numeric', field: 'dividendYield', operator: '>', value: '3' }],
  },
  {
    label: 'Value (P/E < 15)',
    filters: [{ id: '1', type: 'numeric', field: 'peRatio', operator: '<', value: '15' }],
  },
  {
    label: 'Momentum (>+2%)',
    filters: [{ id: '1', type: 'numeric', field: 'changePercent', operator: '>', value: '2' }],
  },
  {
    label: 'Mega Cap (>$500B)',
    filters: [{ id: '1', type: 'numeric', field: 'marketCap', operator: '>', value: '500000000000' }],
  },
  {
    label: 'Low Beta (<0.8)',
    filters: [{ id: '1', type: 'numeric', field: 'beta', operator: '<', value: '0.8' }],
  },
  {
    label: 'Tech Sector',
    filters: [{ id: '1', type: 'string', field: 'sector', operator: 'is', value: 'Technology' }],
  },
  // Add your own presets here ↓
  // {
  //   label: 'Deep Value (P/E<10 + Div>4%)',
  //   filters: [
  //     { id: '1', type: 'numeric', field: 'peRatio',       operator: '<', value: '10' },
  //     { id: '2', type: 'numeric', field: 'dividendYield', operator: '>', value: '4' },
  //   ],
  // },
];


// ─────────────────────────────────────────────────────────────
//  3. SCREENER FILTER FIELDS
//  Fields available in the filter builder dropdowns.
//  Add new fields here if you want to filter on more things.
// ─────────────────────────────────────────────────────────────

export const SCREENER_NUMERIC_FIELDS = [
  { key: 'price',         label: 'Price ($)' },
  { key: 'changePercent', label: '% Change' },
  { key: 'marketCap',     label: 'Market Cap ($)' },
  { key: 'volume',        label: 'Volume' },
  { key: 'peRatio',       label: 'P/E Ratio' },
  { key: 'pbRatio',       label: 'P/B Ratio' },
  { key: 'dividendYield', label: 'Dividend Yield (%)' },
  { key: 'beta',          label: 'Beta' },
  // Add more numeric fields here ↓
  // { key: 'eps',     label: 'EPS ($)' },
  // { key: 'weekHigh52', label: '52-Week High ($)' },
] as const;

export const SCREENER_SECTORS = [
  'Technology',
  'Healthcare',
  'Financials',
  'Energy',
  'Consumer Staples',
  'Consumer Discretionary',
  'Communication Services',
  'Industrials',
  'Materials',
  'Real Estate',
  'Utilities',
  // Add more sectors here ↓
];
