import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  paymentsApi,
  type Payment,
  type PaginatedPaymentsResponse,
  type PaymentResponse,
  type PaymentStats,
  type PaymentStatsResponse,
  type PaymentFilters,
} from "../services/payments";

// Query Keys
export const PAYMENTS_KEYS = {
  all: ["payments"] as const,
  lists: () => [...PAYMENTS_KEYS.all, "list"] as const,
  list: (filters: PaymentFilters) =>
    [...PAYMENTS_KEYS.lists(), filters] as const,
  details: () => [...PAYMENTS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PAYMENTS_KEYS.details(), id] as const,
  byUser: (userId: string) => [...PAYMENTS_KEYS.all, "user", userId] as const,
  stats: (filters?: {
    startDate?: string;
    endDate?: string;
    locationId?: string;
  }) => [...PAYMENTS_KEYS.all, "stats", filters] as const,
};

// Hooks
export const usePayments = (
  filters?: PaymentFilters
): UseQueryResult<PaginatedPaymentsResponse, Error> => {
  return useQuery({
    queryKey: PAYMENTS_KEYS.list(filters || {}),
    queryFn: () => paymentsApi.getPayments(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
};

export const usePayment = (
  id: string
): UseQueryResult<PaymentResponse, Error> => {
  return useQuery({
    queryKey: PAYMENTS_KEYS.detail(id),
    queryFn: () => paymentsApi.getPayment(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePaymentsByUser = (
  userId: string,
  page = 1,
  limit = 10
): UseQueryResult<PaginatedPaymentsResponse, Error> => {
  return useQuery({
    queryKey: [...PAYMENTS_KEYS.byUser(userId), page, limit],
    queryFn: () => paymentsApi.getPaymentsByUser(userId, page, limit),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePaymentStats = (filters?: {
  startDate?: string;
  endDate?: string;
  locationId?: string;
}): UseQueryResult<PaymentStatsResponse, Error> => {
  return useQuery({
    queryKey: PAYMENTS_KEYS.stats(filters),
    queryFn: () => paymentsApi.getPaymentStats(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Poll every minute
  });
};
