/**
 * ═══════════════════════════════════════════════════════════════
 *  STOCKIQ — RESEARCH CONFIGURATION
 *
 *  Edit this file to change:
 *    1. TAB CRITERIA    — the rules that define each curated tab
 *    2. SYMBOL LISTS    — stocks in each tab (auto-filtered by criteria)
 *    3. SCREENER CONFIG — presets and filter fields
 * ═══════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────
//  TAB CRITERIA DEFINITIONS
//  These rules define WHAT qualifies for each curated tab.
//  Change the thresholds here — the tab updates automatically.
// ─────────────────────────────────────────────────────────────

export interface Criterion {
  field: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | 'contains';
  value: number | string;
  label: string;         // shown in the tab as "Why this stock?"
}

export interface TabCriteria {
  id: string;
  name: string;
  description: string;
  criteria: Criterion[];  // ALL must pass (AND logic)
}

export const TAB_CRITERIA: Record<string, TabCriteria> = {

  sp500value: {
    id: 'sp500value',
    name: 'S&P 500 Value',
    description: 'Stocks that meet classic value investing criteria — low valuation multiples and meaningful income.',
    criteria: [
      { field: 'peRatio',       operator: '<',  value: 20,  label: 'P/E < 20 (not expensive)' },
      { field: 'dividendYield', operator: '>',  value: 1.5, label: 'Dividend yield > 1.5%' },
      { field: 'pbRatio',       operator: '<',  value: 5,   label: 'P/B < 5 (not overpriced vs book)' },
    ],
    // To change to stricter value: set peRatio < 15, dividendYield > 3
    // To change to GARP (growth at reasonable price): set peRatio < 25, remove dividendYield
  },

  buffett: {
    id: 'buffett',
    name: 'Buffett Portfolio',
    description: "Berkshire Hathaway's disclosed holdings — companies with durable competitive moats.",
    criteria: [
      // Buffett tab is a fixed list (actual BRK holdings), not criteria-filtered
      // Edit BUFFETT_SYMBOLS below to change the holdings shown
    ],
  },

  sp100: {
    id: 'sp100',
    name: 'S&P 100 Movers',
    description: 'Largest US companies sorted by biggest price move today.',
    criteria: [
      // SP100 tab shows all symbols sorted by % change — no filtering applied
      // Edit SP100_SYMBOLS below to change which stocks are tracked
    ],
  },

  ai: {
    id: 'ai',
    name: 'AI Stocks & ETFs',
    description: 'Companies with primary revenue exposure to artificial intelligence and semiconductors.',
    criteria: [
      { field: 'sector', operator: '==', value: 'Technology', label: 'Technology sector' },
      // Note: AI tab is curated — add/remove from AI_STOCK_SYMBOLS list below
    ],
  },

};

// Helper: apply criteria to a stock list
export function applyCriteria(stocks: any[], criteria: Criterion[]): any[] {
  if (!criteria.length) return stocks;
  return stocks.filter(stock =>
    criteria.every(c => {
      const val = stock[c.field];
      if (val === undefined || val === null) return false;
      const n = Number(val);
      const threshold = Number(c.value);
      switch (c.operator) {
        case '>':        return n > threshold;
        case '<':        return n < threshold;
        case '>=':       return n >= threshold;
        case '<=':       return n <= threshold;
        case '==':       return String(val) === String(c.value);
        case 'contains': return String(val).toLowerCase().includes(String(c.value).toLowerCase());
        default:         return true;
      }
    })
  );
}


// ─────────────────────────────────────────────────────────────
//  SYMBOL UNIVERSES
//  The master lists of stocks with their metadata.
//  Live prices are always fetched from the API on top of these.
//  The SP500 Value tab auto-filters this list using TAB_CRITERIA.
// ─────────────────────────────────────────────────────────────

// Full investable universe — used by screener + value filter
export const STOCK_UNIVERSE = [
  // Mega cap
  { symbol: 'AAPL',  name: 'Apple Inc.',              price: 189.84, sector: 'Technology',              peRatio: 28.5, pbRatio: 42.1, dividendYield: 0.5,  beta: 1.20 },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',          price: 374.51, sector: 'Technology',              peRatio: 35.2, pbRatio: 13.8, dividendYield: 0.7,  beta: 0.90 },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',             price: 495.22, sector: 'Technology',              peRatio: 65.4, pbRatio: 32.1, dividendYield: 0.03, beta: 1.85 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',            price: 152.19, sector: 'Communication Services',  peRatio: 24.1, pbRatio: 6.2,  dividendYield: 0,    beta: 1.05 },
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',          price: 178.35, sector: 'Consumer Discretionary',  peRatio: 58.3, pbRatio: 8.4,  dividendYield: 0,    beta: 1.30 },
  { symbol: 'META',  name: 'Meta Platforms Inc.',      price: 481.73, sector: 'Communication Services',  peRatio: 26.8, pbRatio: 8.1,  dividendYield: 0.4,  beta: 1.40 },
  { symbol: 'TSLA',  name: 'Tesla Inc.',               price: 248.42, sector: 'Consumer Discretionary',  peRatio: 82.1, pbRatio: 14.2, dividendYield: 0,    beta: 2.10 },
  // Large cap
  { symbol: 'LLY',   name: 'Eli Lilly & Co.',          price: 742.18, sector: 'Healthcare',              peRatio: 68.2, pbRatio: 72.1, dividendYield: 0.7,  beta: 0.40 },
  { symbol: 'V',     name: 'Visa Inc.',                price: 278.34, sector: 'Financials',              peRatio: 30.1, pbRatio: 14.8, dividendYield: 0.8,  beta: 0.93 },
  { symbol: 'JNJ',   name: 'Johnson & Johnson',        price: 152.67, sector: 'Healthcare',              peRatio: 14.8, pbRatio: 4.2,  dividendYield: 3.1,  beta: 0.55 },
  { symbol: 'WMT',   name: 'Walmart Inc.',             price: 168.43, sector: 'Consumer Staples',        peRatio: 28.4, pbRatio: 7.2,  dividendYield: 1.3,  beta: 0.50 },
  { symbol: 'JPM',   name: 'JPMorgan Chase',           price: 196.52, sector: 'Financials',              peRatio: 11.2, pbRatio: 1.8,  dividendYield: 2.4,  beta: 1.10 },
  { symbol: 'XOM',   name: 'Exxon Mobil Corp.',        price: 108.74, sector: 'Energy',                  peRatio: 12.4, pbRatio: 2.1,  dividendYield: 3.8,  beta: 0.85 },
  { symbol: 'UNH',   name: 'UnitedHealth Group',       price: 524.19, sector: 'Healthcare',              peRatio: 19.8, pbRatio: 5.8,  dividendYield: 1.5,  beta: 0.62 },
  { symbol: 'MA',    name: 'Mastercard Inc.',          price: 449.27, sector: 'Financials',              peRatio: 35.8, pbRatio: 58.2, dividendYield: 0.6,  beta: 1.12 },
  { symbol: 'HD',    name: 'Home Depot Inc.',          price: 342.56, sector: 'Consumer Discretionary',  peRatio: 22.4, pbRatio: 0,    dividendYield: 2.4,  beta: 1.00 },
  { symbol: 'PG',    name: 'Procter & Gamble',         price: 158.23, sector: 'Consumer Staples',        peRatio: 25.1, pbRatio: 7.8,  dividendYield: 2.4,  beta: 0.56 },
  { symbol: 'COST',  name: 'Costco Wholesale',         price: 712.44, sector: 'Consumer Staples',        peRatio: 48.2, pbRatio: 14.1, dividendYield: 0.6,  beta: 0.78 },
  { symbol: 'ABBV',  name: 'AbbVie Inc.',              price: 178.92, sector: 'Healthcare',              peRatio: 14.1, pbRatio: 36.2, dividendYield: 3.8,  beta: 0.72 },
  { symbol: 'BAC',   name: 'Bank of America',          price: 34.17,  sector: 'Financials',              peRatio: 10.2, pbRatio: 1.1,  dividendYield: 2.8,  beta: 1.42 },
  { symbol: 'KO',    name: 'Coca-Cola Co.',            price: 62.18,  sector: 'Consumer Staples',        peRatio: 22.1, pbRatio: 10.8, dividendYield: 3.2,  beta: 0.58 },
  { symbol: 'MRK',   name: 'Merck & Co.',              price: 114.52, sector: 'Healthcare',              peRatio: 16.4, pbRatio: 5.8,  dividendYield: 2.6,  beta: 0.48 },
  { symbol: 'AVGO',  name: 'Broadcom Inc.',            price: 1234.67,sector: 'Technology',              peRatio: 28.4, pbRatio: 12.4, dividendYield: 1.6,  beta: 1.18 },
  { symbol: 'CVX',   name: 'Chevron Corp.',            price: 154.38, sector: 'Energy',                  peRatio: 12.4, pbRatio: 1.8,  dividendYield: 4.1,  beta: 0.90 },
  { symbol: 'PEP',   name: 'PepsiCo Inc.',             price: 172.41, sector: 'Consumer Staples',        peRatio: 23.8, pbRatio: 12.4, dividendYield: 3.1,  beta: 0.60 },
  { symbol: 'NFLX',  name: 'Netflix Inc.',             price: 614.29, sector: 'Communication Services',  peRatio: 48.2, pbRatio: 17.2, dividendYield: 0,    beta: 1.28 },
  { symbol: 'ORCL',  name: 'Oracle Corp.',             price: 123.48, sector: 'Technology',              peRatio: 32.1, pbRatio: 0,    dividendYield: 1.5,  beta: 0.98 },
  // Value stocks
  { symbol: 'BRK.B', name: 'Berkshire Hathaway',       price: 358.24, sector: 'Financials',              peRatio: 8.2,  pbRatio: 1.4,  dividendYield: 0,    beta: 0.88 },
  { symbol: 'MO',    name: 'Altria Group',             price: 44.23,  sector: 'Consumer Staples',        peRatio: 8.9,  pbRatio: 0,    dividendYield: 9.2,  beta: 0.60 },
  { symbol: 'T',     name: 'AT&T Inc.',                price: 18.47,  sector: 'Communication Services',  peRatio: 7.1,  pbRatio: 1.1,  dividendYield: 6.8,  beta: 0.65 },
  { symbol: 'VZ',    name: 'Verizon Communications',   price: 38.14,  sector: 'Communication Services',  peRatio: 8.4,  pbRatio: 1.8,  dividendYield: 6.5,  beta: 0.42 },
  { symbol: 'IBM',   name: 'IBM Corp.',                price: 148.32, sector: 'Technology',              peRatio: 18.2, pbRatio: 7.1,  dividendYield: 4.1,  beta: 0.72 },
  { symbol: 'PFE',   name: 'Pfizer Inc.',              price: 27.84,  sector: 'Healthcare',              peRatio: 10.8, pbRatio: 1.8,  dividendYield: 6.1,  beta: 0.45 },
  { symbol: 'WBA',   name: 'Walgreens Boots Alliance', price: 21.34,  sector: 'Consumer Staples',        peRatio: 5.2,  pbRatio: 0.8,  dividendYield: 8.4,  beta: 0.68 },
  { symbol: 'CVS',   name: 'CVS Health Corp.',         price: 63.18,  sector: 'Healthcare',              peRatio: 9.1,  pbRatio: 1.3,  dividendYield: 3.8,  beta: 0.62 },
  { symbol: 'GM',    name: 'General Motors',           price: 44.72,  sector: 'Consumer Discretionary',  peRatio: 5.8,  pbRatio: 0.8,  dividendYield: 1.0,  beta: 1.32 },
  // AI stocks
  { symbol: 'AMD',   name: 'Advanced Micro Devices',   price: 148.37, sector: 'Technology',              peRatio: 42.1, pbRatio: 4.2,  dividendYield: 0,    beta: 1.72 },
  { symbol: 'PLTR',  name: 'Palantir Technologies',    price: 24.18,  sector: 'Technology',              peRatio: 82.4, pbRatio: 14.1, dividendYield: 0,    beta: 2.10 },
  { symbol: 'ANET',  name: 'Arista Networks',          price: 278.43, sector: 'Technology',              peRatio: 48.2, pbRatio: 18.4, dividendYield: 0,    beta: 1.18 },
  { symbol: 'ARM',   name: 'Arm Holdings',             price: 142.67, sector: 'Technology',              peRatio: 188.2,pbRatio: 28.4, dividendYield: 0,    beta: 1.85 },
  { symbol: 'SMCI',  name: 'Super Micro Computer',     price: 478.23, sector: 'Technology',              peRatio: 22.4, pbRatio: 8.2,  dividendYield: 0,    beta: 2.40 },
  // Buffett holdings
  { symbol: 'AXP',   name: 'American Express',         price: 218.43, sector: 'Financials',              peRatio: 18.7, pbRatio: 6.4,  dividendYield: 1.2,  beta: 1.18 },
  { symbol: 'OXY',   name: 'Occidental Petroleum',     price: 58.92,  sector: 'Energy',                  peRatio: 11.8, pbRatio: 2.1,  dividendYield: 1.2,  beta: 1.48 },
  { symbol: 'KHC',   name: 'Kraft Heinz Co.',          price: 35.41,  sector: 'Consumer Staples',        peRatio: 14.2, pbRatio: 0.8,  dividendYield: 4.8,  beta: 0.72 },
  { symbol: 'USB',   name: 'US Bancorp',               price: 41.83,  sector: 'Financials',              peRatio: 11.1, pbRatio: 1.4,  dividendYield: 4.8,  beta: 1.08 },
  { symbol: 'DVA',   name: 'DaVita Inc.',              price: 138.64, sector: 'Healthcare',              peRatio: 15.8, pbRatio: 4.2,  dividendYield: 0,    beta: 0.42 },
];

// ── Per-tab symbol lists (filtered subsets of STOCK_UNIVERSE) ─────────────────

export const MAG7_SYMBOLS = STOCK_UNIVERSE.filter(s =>
  ['AAPL','MSFT','NVDA','GOOGL','AMZN','META','TSLA'].includes(s.symbol)
);

export const SP100_SYMBOLS = STOCK_UNIVERSE.filter(s =>
  ['LLY','V','JNJ','WMT','JPM','XOM','UNH','MA','HD','PG',
   'COST','ABBV','BAC','KO','MRK','AVGO','CVX','PEP','NFLX','ORCL'].includes(s.symbol)
);

// SP500 Value — auto-filtered by TAB_CRITERIA.sp500value
// Change the criteria in TAB_CRITERIA above to change what shows up here
export const SP500_VALUE_SYMBOLS = applyCriteria(
  STOCK_UNIVERSE,
  TAB_CRITERIA.sp500value.criteria
);

export const BUFFETT_SYMBOLS = STOCK_UNIVERSE.filter(s =>
  ['AAPL','BAC','AXP','KO','CVX','OXY','KHC','USB','DVA'].includes(s.symbol)
).map((s, i) => ({
  ...s,
  weight: [44.2, 9.3, 8.7, 7.9, 7.2, 4.8, 3.7, 3.6, 1.1][i] ?? 0,
}));

export const AI_STOCK_SYMBOLS = STOCK_UNIVERSE.filter(s =>
  ['NVDA','MSFT','GOOGL','AMD','PLTR','ANET','ARM','SMCI'].includes(s.symbol)
);

export const AI_ETF_SYMBOLS = [
  { symbol: 'SMH',  name: 'VanEck Semiconductor ETF',     price: 238.47, expenseRatio: 0.35, aum: 22_000_000_000 },
  { symbol: 'SOXX', name: 'iShares Semiconductor ETF',    price: 214.83, expenseRatio: 0.35, aum: 12_000_000_000 },
  { symbol: 'AIQ',  name: 'AI & Big Data ETF',            price: 32.18,  expenseRatio: 0.68, aum: 2_800_000_000 },
  { symbol: 'BOTZ', name: 'Global Robotics & AI ETF',     price: 28.43,  expenseRatio: 0.68, aum: 2_400_000_000 },
  { symbol: 'ARKQ', name: 'ARK Autonomous Tech ETF',      price: 54.17,  expenseRatio: 0.75, aum: 800_000_000 },
  { symbol: 'ROBO', name: 'ROBO Global Robotics ETF',     price: 58.92,  expenseRatio: 0.95, aum: 1_200_000_000 },
];

export const METALS_ETF_SYMBOLS = [
  { symbol: 'GLD',  name: 'SPDR Gold Shares',          price: 187.34, nav: 187.20, expenseRatio: 0.40, aum: 57000000000 },
  { symbol: 'IAU',  name: 'iShares Gold Trust',        price: 38.47,  nav: 38.44,  expenseRatio: 0.25, aum: 29000000000 },
  { symbol: 'SLV',  name: 'iShares Silver Trust',      price: 22.18,  nav: 22.15,  expenseRatio: 0.50, aum: 11000000000 },
  { symbol: 'SIVR', name: 'abrdn Physical Silver',     price: 23.41,  nav: 23.38,  expenseRatio: 0.30, aum: 1200000000 },
  { symbol: 'CPER', name: 'US Copper Index Fund',      price: 28.74,  nav: 28.70,  expenseRatio: 0.65, aum: 230000000 },
  { symbol: 'PDBC', name: 'Invesco Optimum Yield ETF', price: 13.47,  nav: 13.45,  expenseRatio: 0.59, aum: 4200000000 },
];

export const CRYPTO_SYMBOLS = [
  { symbol: 'BTCUSD', name: 'Bitcoin',  rank: 1, marketCap: 1_280_000_000_000, volume: 28_000_000_000 },
  { symbol: 'ETHUSD', name: 'Ethereum', rank: 2, marketCap: 380_000_000_000,   volume: 12_000_000_000 },
  { symbol: 'SOLUSD', name: 'Solana',   rank: 3, marketCap: 82_000_000_000,    volume: 3_200_000_000 },
  { symbol: 'XRPUSD', name: 'Ripple',   rank: 4, marketCap: 68_000_000_000,    volume: 2_800_000_000 },
  { symbol: 'ADAUSD', name: 'Cardano',  rank: 5, marketCap: 24_000_000_000,    volume: 680_000_000 },
];

export const MARKET_BAR_SYMBOLS = ['SPY', 'QQQ', 'DIA', 'IWM', 'GLD', 'TLT', 'VIX'];
export const MARKET_BAR_LABELS: Record<string, string> = {
  SPY: 'S&P 500', QQQ: 'NASDAQ', DIA: 'DOW',
  IWM: 'Russell 2K', GLD: 'Gold', TLT: '20Y Bond', VIX: 'VIX',
};


// ─────────────────────────────────────────────────────────────
//  SCREENER PRESETS & FIELDS
// ─────────────────────────────────────────────────────────────

export interface ScreenerFilter {
  id: string; type: 'numeric' | 'string';
  field: string; operator: string; value: string;
}

export interface ScreenerPreset {
  label: string;
  filters: ScreenerFilter[];
}

export const SCREENER_PRESETS: ScreenerPreset[] = [
  { label: 'High Dividend (>3%)',  filters: [{ id:'1', type:'numeric', field:'dividendYield', operator:'>', value:'3' }] },
  { label: 'Value (P/E < 15)',     filters: [{ id:'1', type:'numeric', field:'peRatio',       operator:'<', value:'15' }] },
  { label: 'Momentum (>+2%)',      filters: [{ id:'1', type:'numeric', field:'changePercent', operator:'>', value:'2' }] },
  { label: 'Mega Cap (>$500B)',    filters: [{ id:'1', type:'numeric', field:'marketCap',     operator:'>', value:'500000000000' }] },
  { label: 'Low Beta (<0.8)',      filters: [{ id:'1', type:'numeric', field:'beta',          operator:'<', value:'0.8' }] },
  { label: 'Tech Sector',          filters: [{ id:'1', type:'string',  field:'sector',        operator:'is', value:'Technology' }] },
  { label: 'Deep Value',           filters: [
    { id:'1', type:'numeric', field:'peRatio',       operator:'<', value:'12' },
    { id:'2', type:'numeric', field:'dividendYield', operator:'>', value:'3' },
  ]},
];

export const SCREENER_NUMERIC_FIELDS = [
  { key: 'price',         label: 'Price ($)' },
  { key: 'changePercent', label: '% Change' },
  { key: 'marketCap',     label: 'Market Cap ($)' },
  { key: 'volume',        label: 'Volume' },
  { key: 'peRatio',       label: 'P/E Ratio' },
  { key: 'pbRatio',       label: 'P/B Ratio' },
  { key: 'dividendYield', label: 'Dividend Yield (%)' },
  { key: 'beta',          label: 'Beta' },
] as const;

export const SCREENER_SECTORS = [
  'Technology', 'Healthcare', 'Financials', 'Energy',
  'Consumer Staples', 'Consumer Discretionary', 'Communication Services',
  'Industrials', 'Materials', 'Real Estate', 'Utilities',
];

// ─────────────────────────────────────────────────────────────
//  DIVIDEND ETFs
//  Top dividend-focused ETFs with yield, expense ratio, AUM
// ─────────────────────────────────────────────────────────────

export interface DividendEtf {
  symbol: string;
  name: string;
  price: number;
  dividendYield: number;     // annual yield %
  expenseRatio: number;      // annual expense ratio %
  aum: number;               // assets under management $
  frequency: string;         // Monthly | Quarterly
  focus: string;             // brief strategy description
  inception: string;         // year
}

export const DIVIDEND_ETF_SYMBOLS: DividendEtf[] = [
  { symbol: 'SCHD',  name: 'Schwab US Dividend Equity ETF',     price: 77.42,  dividendYield: 3.5,  expenseRatio: 0.06, aum: 52_000_000_000, frequency: 'Quarterly', focus: 'Quality dividend growers, 100 stocks',      inception: '2011' },
  { symbol: 'VYM',   name: 'Vanguard High Dividend Yield ETF',   price: 118.34, dividendYield: 2.9,  expenseRatio: 0.06, aum: 48_000_000_000, frequency: 'Quarterly', focus: 'Broad high-yield US equities, 400+ stocks', inception: '2006' },
  { symbol: 'DVY',   name: 'iShares Select Dividend ETF',        price: 124.18, dividendYield: 4.8,  expenseRatio: 0.38, aum: 18_000_000_000, frequency: 'Quarterly', focus: 'High dividend US stocks screened by payout', inception: '2003' },
  { symbol: 'DGRO',  name: 'iShares Core Dividend Growth ETF',   price: 57.82,  dividendYield: 2.4,  expenseRatio: 0.08, aum: 26_000_000_000, frequency: 'Quarterly', focus: 'Dividend growth track record 5+ years',     inception: '2014' },
  { symbol: 'HDV',   name: 'iShares Core High Dividend ETF',     price: 108.47, dividendYield: 3.8,  expenseRatio: 0.08, aum: 10_000_000_000, frequency: 'Quarterly', focus: 'Morningstar Economic Moat screened',        inception: '2011' },
  { symbol: 'JEPI',  name: 'JPMorgan Equity Premium Income ETF', price: 54.23,  dividendYield: 7.2,  expenseRatio: 0.35, aum: 34_000_000_000, frequency: 'Monthly',   focus: 'S&P 500 + covered calls for income',       inception: '2020' },
  { symbol: 'JEPQ',  name: 'JPMorgan NASDAQ Equity Premium ETF', price: 52.18,  dividendYield: 9.1,  expenseRatio: 0.35, aum: 15_000_000_000, frequency: 'Monthly',   focus: 'NASDAQ 100 + covered calls for income',    inception: '2022' },
  { symbol: 'DIVO',  name: 'Amplify CWP Enhanced Dividend ETF',  price: 38.92,  dividendYield: 4.8,  expenseRatio: 0.55, aum: 3_000_000_000,  frequency: 'Monthly',   focus: 'Blue-chip dividend + tactical covered calls', inception: '2016' },
  { symbol: 'PEY',   name: 'Invesco High Yield Equity Dividend ETF', price: 19.84, dividendYield: 5.2, expenseRatio: 0.52, aum: 1_200_000_000, frequency: 'Monthly',   focus: 'Highest yielding US dividend stocks',       inception: '2004' },
  { symbol: 'SPHD',  name: 'Invesco S&P 500 High Div Low Vol ETF', price: 42.17, dividendYield: 4.6, expenseRatio: 0.30, aum: 3_800_000_000,  frequency: 'Monthly',   focus: 'High yield + low volatility S&P 500',      inception: '2012' },
];

// Criteria that define a "top dividend ETF" — shown in the tab header
export const DIVIDEND_ETF_CRITERIA: TabCriteria = {
  id: 'dividendetfs',
  name: 'Top 10 Dividend ETFs',
  description: 'Best-in-class ETFs for dividend income — screened by yield, expense ratio, AUM and strategy quality.',
  criteria: [
    { field: 'dividendYield', operator: '>=', value: 2.4,  label: 'Yield ≥ 2.4%' },
    { field: 'aum',           operator: '>=', value: 1_000_000_000, label: 'AUM ≥ $1B (established)' },
    { field: 'expenseRatio',  operator: '<=', value: 0.55, label: 'Expense ratio ≤ 0.55%' },
  ],
};

// ─────────────────────────────────────────────────────────────
//  RECURRING INVESTMENTS
//  Stocks and ETFs suitable for regular DCA / recurring buys
// ─────────────────────────────────────────────────────────────

export interface RecurringHolding {
  symbol: string;
  name: string;
  price: number;
  type: 'ETF' | 'Stock';
  sector: string;
  why: string;            // one-line investment thesis
  expenseRatio?: number;  // for ETFs
  dividendYield?: number;
}

export const RECURRING_SYMBOLS: RecurringHolding[] = [
  // ── Core ETFs ─────────────────────────────────────────────
  { symbol: 'VOO',  name: 'Vanguard S&P 500 ETF',         price: 492.18, type: 'ETF',   sector: 'Broad Market',  why: 'Core US large-cap index — buy and hold forever',         expenseRatio: 0.03, dividendYield: 1.3 },
  { symbol: 'QQQ',  name: 'Invesco QQQ Trust',             price: 448.62, type: 'ETF',   sector: 'Technology',    why: 'NASDAQ-100 — top 100 non-financial NASDAQ companies',    expenseRatio: 0.20, dividendYield: 0.6 },
  { symbol: 'QQQM', name: 'Invesco NASDAQ 100 ETF',        price: 204.37, type: 'ETF',   sector: 'Technology',    why: 'Same as QQQ, lower cost — better for long-term DCA',    expenseRatio: 0.15, dividendYield: 0.6 },
  { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', price: 77.42,  type: 'ETF',   sector: 'Dividend',      why: 'Quality dividend growth — income + appreciation',        expenseRatio: 0.06, dividendYield: 3.5 },
  { symbol: 'VXUS', name: 'Vanguard Total Intl Stock ETF', price: 62.18,  type: 'ETF',   sector: 'International', why: 'Ex-US diversification — Europe, Asia, emerging markets', expenseRatio: 0.07, dividendYield: 3.1 },
  { symbol: 'GLD',  name: 'SPDR Gold Shares',              price: 187.34, type: 'ETF',   sector: 'Commodities',   why: 'Inflation hedge and safe haven — store of value',        expenseRatio: 0.40, dividendYield: 0   },
  { symbol: 'SMH',  name: 'VanEck Semiconductor ETF',      price: 238.47, type: 'ETF',   sector: 'Technology',    why: 'Semiconductor leaders — NVDA, TSM, AVGO, AMD, ASML',   expenseRatio: 0.35, dividendYield: 0.6 },
  { symbol: 'SOXX', name: 'iShares Semiconductor ETF',     price: 214.83, type: 'ETF',   sector: 'Technology',    why: 'Broader chip exposure — 30 semiconductor companies',    expenseRatio: 0.35, dividendYield: 0.9 },
  // ── Individual Stocks ─────────────────────────────────────
  { symbol: 'COST', name: 'Costco Wholesale',              price: 712.44, type: 'Stock', sector: 'Consumer Staples',   why: 'Membership moat — loyal customer base, consistent growth'  },
  { symbol: 'GOOGL',name: 'Alphabet Inc.',                 price: 152.19, type: 'Stock', sector: 'Communication Services', why: 'Search monopoly + AI + Cloud — dominant platform'    },
  { symbol: 'MSFT', name: 'Microsoft Corp.',               price: 374.51, type: 'Stock', sector: 'Technology',    why: 'Azure + Office + AI — best enterprise software moat'      },
  { symbol: 'WMT',  name: 'Walmart Inc.',                  price: 168.43, type: 'Stock', sector: 'Consumer Staples',   why: 'Retail giant + growing e-commerce and ad revenue'          },
];
