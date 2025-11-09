import api from "../lib/axios";

// Types
export interface DashboardMetrics {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
  };
  payments: {
    byStatus: Array<{
      status: string;
      count: number;
      totalAmount: number;
    }>;
  };
}

export interface MostSoldItem {
  menuItem: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    category: {
      name: string;
    };
  };
  quantitySold: number;
  totalRevenue: number;
  orderCount: number;
}

export interface RevenueTrend {
  period: string;
  revenue: number;
}

export interface SalesByCategory {
  categoryId: string;
  categoryName: string;
  totalQuantity: number;
  totalRevenue: number;
  itemCount: number;
}

export interface TopCustomer {
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
  };
  orderCount: number;
  totalSpent: number;
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
  totalAmount: number;
}

export interface LocationPerformance {
  location: {
    id: string;
    name: string;
    city: string;
    address: string;
  };
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  locationId?: string;
}

// API Functions
export const dashboardApi = {
  // Get dashboard metrics overview
  getMetrics: async (
    filters?: DashboardFilters
  ): Promise<{ success: boolean; data: DashboardMetrics }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const { data } = await api.get(`/api/admin/dashboard/metrics?${params}`);
    return data;
  },

  // Get most sold items
  getMostSoldItems: async (
    limit = 10,
    filters?: DashboardFilters
  ): Promise<{ success: boolean; data: MostSoldItem[] }> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const { data } = await api.get(
      `/api/admin/dashboard/most-sold-items?${params}`
    );
    return data;
  },

  // Get revenue trends
  getRevenueTrends: async (
    groupBy: "hour" | "day" | "week" | "month" | "year" = "day",
    filters?: DashboardFilters
  ): Promise<{ success: boolean; data: RevenueTrend[] }> => {
    const params = new URLSearchParams({ groupBy });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const { data } = await api.get(
      `/api/admin/dashboard/revenue-trends?${params}`
    );
    return data;
  },

  // Get sales by category
  getSalesByCategory: async (
    filters?: DashboardFilters
  ): Promise<{ success: boolean; data: SalesByCategory[] }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const { data } = await api.get(
      `/api/admin/dashboard/sales-by-category?${params}`
    );
    return data;
  },

  // Get top customers
  getTopCustomers: async (
    limit = 10,
    filters?: DashboardFilters
  ): Promise<{ success: boolean; data: TopCustomer[] }> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const { data } = await api.get(`/admin/dashboard/top-customers?${params}`);
    return data;
  },

  // Get order status distribution
  getOrderStatusDistribution: async (
    filters?: DashboardFilters
  ): Promise<{ success: boolean; data: OrderStatusDistribution[] }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const { data } = await api.get(
      `/api/admin/dashboard/order-status-distribution?${params}`
    );
    return data;
  },

  // Get location performance
  getLocationPerformance: async (
    filters?: Omit<DashboardFilters, "locationId">
  ): Promise<{ success: boolean; data: LocationPerformance[] }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const { data } = await api.get(
      `/api/admin/dashboard/location-performance?${params}`
    );
    return data;
  },
};
