export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  sector?: string;
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  eps?: number;
  beta?: number;
  weekHigh52?: number;
  weekLow52?: number;
}

export interface ETF extends Stock {
  aum?: number;
  expenseRatio?: number;
  nav?: number;
  category?: string;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  circulatingSupply?: number;
  rank: number;
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgCostBasis: number;
  currentPrice: number;
  sector: string;
  assetType: 'stock' | 'etf' | 'crypto';
  purchaseDate: string;
}

export interface Portfolio {
  id: string;
  name: string;
  holdings: PortfolioHolding[];
  createdAt: string;
  description?: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: string;
  alertPrice?: number;
}

export interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
  createdAt: string;
}

export interface ResearchTab {
  id: string;
  label: string;
  icon: string;
  category: 'market' | 'portfolio' | 'custom';
}

export interface MarketSummary {
  indexName: string;
  value: number;
  change: number;
  changePercent: number;
}

export type SortField = 'symbol' | 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  sector?: string;
  minPrice?: number;
  maxPrice?: number;
  minMarketCap?: number;
  search?: string;
}
