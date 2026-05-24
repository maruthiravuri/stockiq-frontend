import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketService, QuoteDto } from '../services/marketService';
import { portfolioService, AddHoldingRequest, UpdateHoldingRequest } from '../services/portfolioService';

// ── Market Data Hooks ─────────────────────────────────────────────────────────
export const useMag7 = () =>
  useQuery({
    queryKey: ['market', 'mag7'],
    queryFn: marketService.getMag7,
    refetchInterval: 30000,   // refetch every 30s
    staleTime: 15000,
    retry: 2,
  });

export const useQuote = (symbol: string) =>
  useQuery({
    queryKey: ['market', 'quote', symbol],
    queryFn: () => marketService.getQuote(symbol),
    enabled: !!symbol,
    refetchInterval: 30000,
    staleTime: 15000,
  });

export const useBatchQuotes = (symbols: string[]) =>
  useQuery({
    queryKey: ['market', 'batch', symbols.sort().join(',')],
    queryFn: () => marketService.getBatchQuotes(symbols),
    enabled: symbols.length > 0,
    refetchInterval: 30000,
    staleTime: 15000,
  });

export const useCrypto = () =>
  useQuery({
    queryKey: ['market', 'crypto'],
    queryFn: marketService.getCrypto,
    refetchInterval: 15000,
    staleTime: 10000,
  });

// ── Portfolio Hooks ───────────────────────────────────────────────────────────
export const usePortfolios = () =>
  useQuery({
    queryKey: ['portfolios'],
    queryFn: portfolioService.list,
    staleTime: 60000,
  });

export const usePortfolio = (id: string) =>
  useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => portfolioService.get(id),
    enabled: !!id,
    refetchInterval: 60000,
    staleTime: 30000,
  });

export const useAllocation = (portfolioId: string) =>
  useQuery({
    queryKey: ['portfolio', portfolioId, 'allocation'],
    queryFn: () => portfolioService.getAllocation(portfolioId),
    enabled: !!portfolioId,
    staleTime: 60000,
  });

export const useAddHolding = (portfolioId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: AddHoldingRequest) => portfolioService.addHolding(portfolioId, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolio', portfolioId] });
      qc.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useUpdateHolding = (portfolioId: string, holdingId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateHoldingRequest) => portfolioService.updateHolding(portfolioId, holdingId, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolio', portfolioId] });
    },
  });
};

export const useDeleteHolding = (portfolioId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (holdingId: string) => portfolioService.deleteHolding(portfolioId, holdingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolio', portfolioId] });
      qc.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useCreatePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      portfolioService.create(name, description),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['portfolios'] }),
  });
};

export const useDeletePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => portfolioService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['portfolios'] }),
  });
};
