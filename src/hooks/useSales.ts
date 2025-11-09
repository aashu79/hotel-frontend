import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  salesApi,
  type Sale,
  type PaginatedSalesResponse,
  type SaleResponse,
  type SaleStats,
  type SaleStatsResponse,
  type SaleFilters,
} from "../services/sales";

// Query Keys
export const SALES_KEYS = {
  all: ["sales"] as const,
  lists: () => [...SALES_KEYS.all, "list"] as const,
  list: (filters: SaleFilters) => [...SALES_KEYS.lists(), filters] as const,
  details: () => [...SALES_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SALES_KEYS.details(), id] as const,
  byLocation: (locationId: string) =>
    [...SALES_KEYS.all, "location", locationId] as const,
  stats: (filters?: {
    startDate?: string;
    endDate?: string;
    locationId?: string;
  }) => [...SALES_KEYS.all, "stats", filters] as const,
};

// Hooks
export const useSales = (
  filters?: SaleFilters
): UseQueryResult<PaginatedSalesResponse, Error> => {
  return useQuery({
    queryKey: SALES_KEYS.list(filters || {}),
    queryFn: () => salesApi.getSales(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
};

export const useSale = (id: string): UseQueryResult<SaleResponse, Error> => {
  return useQuery({
    queryKey: SALES_KEYS.detail(id),
    queryFn: () => salesApi.getSale(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useSalesByLocation = (
  locationId: string,
  filters?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
): UseQueryResult<PaginatedSalesResponse, Error> => {
  return useQuery({
    queryKey: [...SALES_KEYS.byLocation(locationId), filters],
    queryFn: () => salesApi.getSalesByLocation(locationId, filters),
    enabled: !!locationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSaleStats = (filters?: {
  startDate?: string;
  endDate?: string;
  locationId?: string;
}): UseQueryResult<SaleStatsResponse, Error> => {
  return useQuery({
    queryKey: SALES_KEYS.stats(filters),
    queryFn: () => salesApi.getSaleStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Poll every minute
  });
};
