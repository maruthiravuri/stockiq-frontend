import api from './api';

export interface QuoteDto {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  marketCap: number | null;
  peRatio: number | null;
  weekHigh52: number | null;
  weekLow52: number | null;
  currency: string;
  exchange: string;
  timestamp: string;
}

export const marketService = {
  async getQuote(symbol: string): Promise<QuoteDto> {
    const { data } = await api.get<QuoteDto>(`/api/v1/market/quote/${symbol}`);
    return data;
  },

  async getBatchQuotes(symbols: string[]): Promise<QuoteDto[]> {
    const { data } = await api.get<QuoteDto[]>('/api/v1/market/quotes', {
      params: { symbols: symbols.join(',') },
    });
    return data;
  },

  async getMag7(): Promise<QuoteDto[]> {
    const { data } = await api.get<QuoteDto[]>('/api/v1/market/mag7');
    return data;
  },

  async getCrypto(): Promise<QuoteDto[]> {
    const { data } = await api.get<QuoteDto[]>('/api/v1/market/crypto');
    return data;
  },

  async getWatchlistQuotes(symbols: string[]): Promise<QuoteDto[]> {
    if (!symbols.length) return [];
    const { data } = await api.get<QuoteDto[]>('/api/v1/market/watchlist', {
      params: { symbols: symbols.join(',') },
    });
    return data;
  },
};
