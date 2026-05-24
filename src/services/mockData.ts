import { Stock, ETF, CryptoAsset, MarketSummary } from '../types';

const randomChange = (base: number, pct: number = 0.05): number => {
  const change = (Math.random() - 0.48) * base * pct;
  return parseFloat(change.toFixed(2));
};

const makeStock = (symbol: string, name: string, price: number, sector: string, extra: Partial<Stock> = {}): Stock => {
  const change = randomChange(price);
  return {
    symbol, name, price, change,
    changePercent: parseFloat(((change / price) * 100).toFixed(2)),
    volume: Math.floor(Math.random() * 50000000) + 1000000,
    marketCap: Math.floor(price * (Math.random() * 5000000000 + 500000000)),
    high: parseFloat((price + Math.abs(randomChange(price, 0.02))).toFixed(2)),
    low: parseFloat((price - Math.abs(randomChange(price, 0.02))).toFixed(2)),
    open: parseFloat((price + randomChange(price, 0.01)).toFixed(2)),
    previousClose: parseFloat((price - change).toFixed(2)),
    sector,
    peRatio: parseFloat((Math.random() * 40 + 10).toFixed(1)),
    pbRatio: parseFloat((Math.random() * 10 + 1).toFixed(1)),
    dividendYield: parseFloat((Math.random() * 4).toFixed(2)),
    eps: parseFloat((Math.random() * 20 + 1).toFixed(2)),
    beta: parseFloat((Math.random() * 2 + 0.3).toFixed(2)),
    weekHigh52: parseFloat((price * (1 + Math.random() * 0.4)).toFixed(2)),
    weekLow52: parseFloat((price * (1 - Math.random() * 0.35)).toFixed(2)),
    ...extra,
  };
};

export const MAG7_STOCKS: Stock[] = [
  makeStock('AAPL', 'Apple Inc.', 189.84, 'Technology', { peRatio: 28.5, eps: 6.66, beta: 1.2 }),
  makeStock('MSFT', 'Microsoft Corp.', 374.51, 'Technology', { peRatio: 35.2, eps: 10.63, beta: 0.9 }),
  makeStock('NVDA', 'NVIDIA Corp.', 495.22, 'Technology', { peRatio: 65.4, eps: 7.57, beta: 1.85 }),
  makeStock('GOOGL', 'Alphabet Inc.', 152.19, 'Communication Services', { peRatio: 24.1, eps: 6.31, beta: 1.05 }),
  makeStock('AMZN', 'Amazon.com Inc.', 178.35, 'Consumer Discretionary', { peRatio: 58.3, eps: 3.06, beta: 1.3 }),
  makeStock('META', 'Meta Platforms Inc.', 481.73, 'Communication Services', { peRatio: 26.8, eps: 17.97, beta: 1.4 }),
  makeStock('TSLA', 'Tesla Inc.', 248.42, 'Consumer Discretionary', { peRatio: 82.1, eps: 3.02, beta: 2.1 }),
];

export const SP100_MOVERS: Stock[] = [
  makeStock('LLY', 'Eli Lilly & Co.', 742.18, 'Healthcare'),
  makeStock('V', 'Visa Inc.', 278.34, 'Financials'),
  makeStock('JNJ', 'Johnson & Johnson', 152.67, 'Healthcare'),
  makeStock('WMT', 'Walmart Inc.', 168.43, 'Consumer Staples'),
  makeStock('JPM', 'JPMorgan Chase', 196.52, 'Financials'),
  makeStock('XOM', 'Exxon Mobil Corp.', 108.74, 'Energy'),
  makeStock('UNH', 'UnitedHealth Group', 524.19, 'Healthcare'),
  makeStock('MA', 'Mastercard Inc.', 449.27, 'Financials'),
  makeStock('HD', 'Home Depot Inc.', 342.56, 'Consumer Discretionary'),
  makeStock('PG', 'Procter & Gamble', 158.23, 'Consumer Staples'),
  makeStock('COST', 'Costco Wholesale', 712.44, 'Consumer Staples'),
  makeStock('ABBV', 'AbbVie Inc.', 178.92, 'Healthcare'),
  makeStock('BAC', 'Bank of America', 34.17, 'Financials'),
  makeStock('KO', 'Coca-Cola Co.', 62.18, 'Consumer Staples'),
  makeStock('MRK', 'Merck & Co.', 114.52, 'Healthcare'),
  makeStock('AVGO', 'Broadcom Inc.', 1234.67, 'Technology'),
  makeStock('CVX', 'Chevron Corp.', 154.38, 'Energy'),
  makeStock('PEP', 'PepsiCo Inc.', 172.41, 'Consumer Staples'),
  makeStock('NFLX', 'Netflix Inc.', 614.29, 'Communication Services'),
  makeStock('ORCL', 'Oracle Corp.', 123.48, 'Technology'),
];

export const SP500_VALUE: Stock[] = [
  makeStock('BRK.B', 'Berkshire Hathaway', 358.24, 'Financials', { peRatio: 8.2, pbRatio: 1.4, dividendYield: 0 }),
  makeStock('ABBV', 'AbbVie Inc.', 178.92, 'Healthcare', { peRatio: 14.8, pbRatio: 5.2, dividendYield: 3.8 }),
  makeStock('MO', 'Altria Group', 44.23, 'Consumer Staples', { peRatio: 9.1, pbRatio: 2.1, dividendYield: 8.9 }),
  makeStock('T', 'AT&T Inc.', 18.47, 'Communication Services', { peRatio: 7.2, pbRatio: 1.1, dividendYield: 6.4 }),
  makeStock('VZ', 'Verizon Communications', 38.14, 'Communication Services', { peRatio: 8.8, pbRatio: 1.8, dividendYield: 6.7 }),
  makeStock('IBM', 'IBM Corp.', 148.32, 'Technology', { peRatio: 16.4, pbRatio: 7.2, dividendYield: 3.9 }),
  makeStock('PFE', 'Pfizer Inc.', 27.84, 'Healthcare', { peRatio: 11.3, pbRatio: 1.9, dividendYield: 5.8 }),
  makeStock('WBA', 'Walgreens Boots Alliance', 21.34, 'Consumer Staples', { peRatio: 6.1, pbRatio: 0.9, dividendYield: 7.2 }),
  makeStock('CVS', 'CVS Health Corp.', 63.18, 'Healthcare', { peRatio: 9.7, pbRatio: 1.4, dividendYield: 3.4 }),
  makeStock('GM', 'General Motors', 44.72, 'Consumer Discretionary', { peRatio: 5.8, pbRatio: 0.8, dividendYield: 1.0 }),
];

export const BUFFETT_PORTFOLIO: Stock[] = [
  makeStock('AAPL', 'Apple Inc.', 189.84, 'Technology'),
  makeStock('BAC', 'Bank of America', 34.17, 'Financials'),
  makeStock('AXP', 'American Express', 218.43, 'Financials'),
  makeStock('KO', 'Coca-Cola Co.', 62.18, 'Consumer Staples'),
  makeStock('CVX', 'Chevron Corp.', 154.38, 'Energy'),
  makeStock('OXY', 'Occidental Petroleum', 58.92, 'Energy'),
  makeStock('KHC', 'Kraft Heinz Co.', 35.41, 'Consumer Staples'),
  makeStock('MCO', 'Moody\'s Corp.', 384.27, 'Financials'),
  makeStock('USB', 'US Bancorp', 41.83, 'Financials'),
  makeStock('DVA', 'DaVita Inc.', 138.64, 'Healthcare'),
];

export const AI_STOCKS: Stock[] = [
  makeStock('NVDA', 'NVIDIA Corp.', 495.22, 'Technology'),
  makeStock('MSFT', 'Microsoft Corp.', 374.51, 'Technology'),
  makeStock('GOOGL', 'Alphabet Inc.', 152.19, 'Communication Services'),
  makeStock('AMD', 'Advanced Micro Devices', 148.37, 'Technology'),
  makeStock('PLTR', 'Palantir Technologies', 24.18, 'Technology'),
  makeStock('ANET', 'Arista Networks', 278.43, 'Technology'),
  makeStock('ARM', 'Arm Holdings', 142.67, 'Technology'),
  makeStock('SMCI', 'Super Micro Computer', 478.23, 'Technology'),
];

export const AI_ETFS: ETF[] = [
  { ...makeStock('AIQ', 'AI & Big Data ETF', 32.18, 'Technology'), aum: 1280000000, expenseRatio: 0.68, nav: 32.17 } as ETF,
  { ...makeStock('BOTZ', 'Global Robotics & AI ETF', 28.43, 'Technology'), aum: 2340000000, expenseRatio: 0.68, nav: 28.41 } as ETF,
  { ...makeStock('ARKQ', 'ARK Autonomous Tech ETF', 54.17, 'Technology'), aum: 780000000, expenseRatio: 0.75, nav: 54.15 } as ETF,
  { ...makeStock('ROBO', 'ROBO Global Robotics ETF', 58.92, 'Technology'), aum: 1120000000, expenseRatio: 0.95, nav: 58.90 } as ETF,
];

export const METALS_ETFS: ETF[] = [
  { ...makeStock('GLD', 'SPDR Gold Shares', 187.34, 'Commodities'), aum: 58200000000, expenseRatio: 0.40, nav: 187.30 } as ETF,
  { ...makeStock('IAU', 'iShares Gold Trust', 38.47, 'Commodities'), aum: 29800000000, expenseRatio: 0.25, nav: 38.46 } as ETF,
  { ...makeStock('SLV', 'iShares Silver Trust', 22.18, 'Commodities'), aum: 11400000000, expenseRatio: 0.50, nav: 22.17 } as ETF,
  { ...makeStock('SIVR', 'abrdn Physical Silver', 23.41, 'Commodities'), aum: 980000000, expenseRatio: 0.30, nav: 23.40 } as ETF,
  { ...makeStock('CPER', 'US Copper Index Fund', 28.74, 'Commodities'), aum: 340000000, expenseRatio: 0.97, nav: 28.73 } as ETF,
  { ...makeStock('PDBC', 'Invesco Optimum Yield ETF', 13.47, 'Commodities'), aum: 4200000000, expenseRatio: 0.59, nav: 13.46 } as ETF,
];

export const CRYPTO_ASSETS: CryptoAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67284.23, change: randomChange(67284), changePercent: 0, marketCap: 1320000000000, volume: 28400000000, rank: 1, circulatingSupply: 19600000 },
  { symbol: 'ETH', name: 'Ethereum', price: 3482.17, change: randomChange(3482), changePercent: 0, marketCap: 418000000000, volume: 14200000000, rank: 2, circulatingSupply: 120000000 },
  { symbol: 'BNB', name: 'BNB', price: 564.38, change: randomChange(564), changePercent: 0, marketCap: 84200000000, volume: 1840000000, rank: 3, circulatingSupply: 149000000 },
  { symbol: 'SOL', name: 'Solana', price: 168.42, change: randomChange(168), changePercent: 0, marketCap: 74800000000, volume: 2840000000, rank: 4, circulatingSupply: 444000000 },
  { symbol: 'XRP', name: 'XRP', price: 0.5284, change: randomChange(0.5284), changePercent: 0, marketCap: 28900000000, volume: 1240000000, rank: 5, circulatingSupply: 54700000000 },
].map(c => ({ ...c, changePercent: parseFloat(((c.change / c.price) * 100).toFixed(2)) }));

export const MARKET_SUMMARY: MarketSummary[] = [
  { indexName: 'S&P 500', value: 5234.18, change: randomChange(5234, 0.01), changePercent: 0 },
  { indexName: 'NASDAQ', value: 16421.34, change: randomChange(16421, 0.012), changePercent: 0 },
  { indexName: 'DOW JONES', value: 38742.15, change: randomChange(38742, 0.008), changePercent: 0 },
  { indexName: 'VIX', value: 14.82, change: randomChange(14.82, 0.05), changePercent: 0 },
].map(m => ({ ...m, changePercent: parseFloat(((m.change / m.value) * 100).toFixed(2)) }));

export const generateIntraday = (basePrice: number, points: number = 78) => {
  const data = [];
  let price = basePrice * (1 - 0.015 + Math.random() * 0.01);
  const start = new Date();
  start.setHours(9, 30, 0, 0);
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.49) * basePrice * 0.003;
    data.push({
      time: new Date(start.getTime() + i * 5 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};
