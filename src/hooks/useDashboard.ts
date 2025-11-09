import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  dashboardApi,
  type DashboardMetrics,
  type MostSoldItem,
  type RevenueTrend,
  type SalesByCategory,
  type TopCustomer,
  type OrderStatusDistribution,
  type LocationPerformance,
  type DashboardFilters,
} from "../services/dashboard";

// Query Keys
export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  metrics: (filters?: DashboardFilters) =>
    [...DASHBOARD_KEYS.all, "metrics", filters] as const,
  mostSold: (limit: number, filters?: DashboardFilters) =>
    [...DASHBOARD_KEYS.all, "most-sold", limit, filters] as const,
  revenueTrends: (groupBy: string, filters?: DashboardFilters) =>
    [...DASHBOARD_KEYS.all, "revenue-trends", groupBy, filters] as const,
  salesByCategory: (filters?: DashboardFilters) =>
    [...DASHBOARD_KEYS.all, "sales-by-category", filters] as const,
  topCustomers: (limit: number, filters?: DashboardFilters) =>
    [...DASHBOARD_KEYS.all, "top-customers", limit, filters] as const,
  orderStatus: (filters?: DashboardFilters) =>
    [...DASHBOARD_KEYS.all, "order-status", filters] as const,
  locationPerformance: (filters?: Omit<DashboardFilters, "locationId">) =>
    [...DASHBOARD_KEYS.all, "location-performance", filters] as const,
};

// Hooks
export const useDashboardMetrics = (
  filters?: DashboardFilters
): UseQueryResult<{ success: boolean; data: DashboardMetrics }, Error> => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.metrics(filters),
    queryFn: () => dashboardApi.getMetrics(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
};

export const useMostSoldItems = (
  limit = 10,
  filters?: DashboardFilters
): UseQueryResult<{ success: boolean; data: MostSoldItem[] }, Error> => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.mostSold(limit, filters),
    queryFn: () => dashboardApi.getMostSoldItems(limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRevenueTrends = (
  groupBy: "hour" | "day" | "week" | "month" | "year" = "day",
  filters?: DashboardFilters
): UseQueryResult<{ success: boolean; data: RevenueTrend[] }, Error> => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.revenueTrends(groupBy, filters),
    queryFn: () => dashboardApi.getRevenueTrends(groupBy, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSalesByCategory = (
  filters?: DashboardFilters
): UseQueryResult<{ success: boolean; data: SalesByCategory[] }, Error> => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.salesByCategory(filters),
    queryFn: () => dashboardApi.getSalesByCategory(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTopCustomers = (
  limit = 10,
  filters?: DashboardFilters
): UseQueryResult<{ success: boolean; data: TopCustomer[] }, Error> => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.topCustomers(limit, filters),
    queryFn: () => dashboardApi.getTopCustomers(limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrderStatusDistribution = (
  filters?: DashboardFilters
): UseQueryResult<
  { success: boolean; data: OrderStatusDistribution[] },
  Error
> => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.orderStatus(filters),
    queryFn: () => dashboardApi.getOrderStatusDistribution(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
};

export const useLocationPerformance = (
  filters?: Omit<DashboardFilters, "locationId">
): UseQueryResult<{ success: boolean; data: LocationPerformance[] }, Error> => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.locationPerformance(filters),
    queryFn: () => dashboardApi.getLocationPerformance(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
