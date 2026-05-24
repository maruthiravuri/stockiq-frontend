import api from './api';

export interface HoldingResponse {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgCostBasis: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  sector: string;
  assetType: string;
  purchaseDate: string;
}

export interface PortfolioResponse {
  id: string;
  name: string;
  description: string | null;
  holdings: HoldingResponse[];
  totalValue: number;
  totalCost: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface AllocationSlice { label: string; value: number; percent: number; }
export interface AllocationResponse {
  bySector: AllocationSlice[];
  byAssetType: AllocationSlice[];
  totalValue: number;
}

export interface AddHoldingRequest {
  symbol: string;
  name: string;
  quantity: number;
  avgCostBasis: number;
  currentPrice: number;
  sector: string;
  assetType: string;
  purchaseDate: string;
}

export interface UpdateHoldingRequest {
  quantity: number;
  avgCostBasis: number;
  currentPrice: number;
  sector: string;
  purchaseDate: string;
}

export const portfolioService = {
  async list(): Promise<PortfolioResponse[]> {
    const { data } = await api.get<PortfolioResponse[]>('/api/v1/portfolio');
    return data;
  },

  async get(id: string): Promise<PortfolioResponse> {
    const { data } = await api.get<PortfolioResponse>(`/api/v1/portfolio/${id}`);
    return data;
  },

  async create(name: string, description?: string): Promise<PortfolioResponse> {
    const { data } = await api.post<PortfolioResponse>('/api/v1/portfolio', { name, description });
    return data;
  },

  async update(id: string, name: string, description?: string): Promise<PortfolioResponse> {
    const { data } = await api.put<PortfolioResponse>(`/api/v1/portfolio/${id}`, { name, description });
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/portfolio/${id}`);
  },

  async addHolding(portfolioId: string, req: AddHoldingRequest): Promise<HoldingResponse> {
    const { data } = await api.post<HoldingResponse>(
      `/api/v1/portfolio/${portfolioId}/holdings`, req
    );
    return data;
  },

  async updateHolding(portfolioId: string, holdingId: string, req: UpdateHoldingRequest): Promise<HoldingResponse> {
    const { data } = await api.put<HoldingResponse>(
      `/api/v1/portfolio/${portfolioId}/holdings/${holdingId}`, req
    );
    return data;
  },

  async deleteHolding(portfolioId: string, holdingId: string): Promise<void> {
    await api.delete(`/api/v1/portfolio/${portfolioId}/holdings/${holdingId}`);
  },

  async getAllocation(portfolioId: string): Promise<AllocationResponse> {
    const { data } = await api.get<AllocationResponse>(
      `/api/v1/portfolio/${portfolioId}/allocation`
    );
    return data;
  },

  exportCsvUrl(portfolioId: string): string {
    const token = localStorage.getItem('accessToken');
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/portfolio/${portfolioId}/export/csv?token=${token}`;
  },

  downloadCsv(portfolioId: string, portfolioName: string): void {
    api.get(`/api/v1/portfolio/${portfolioId}/export/csv`, { responseType: 'blob' })
      .then(({ data }) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `${portfolioName}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  },
};
