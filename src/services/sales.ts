import api from "../lib/axios";

// Types
export interface Sale {
  id: string;
  orderId: string;
  locationId: string;
  totalAmount: number;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  paymentMethod: string;
  saleDate: string;
  createdAt: string;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    specialNotes: string | null;
    user: {
      id: string;
      name: string;
      email: string;
    };
    items: Array<{
      id: string;
      quantity: number;
      price: number;
      total: number;
      menuItem: {
        id: string;
        name: string;
        imageUrl: string | null;
        category: {
          name: string;
        };
      };
    }>;
  };
  location: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
}

export interface SaleFilters {
  page?: number;
  limit?: number;
  locationId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedSalesResponse {
  success: boolean;
  data: Sale[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface SaleResponse {
  success: boolean;
  data: Sale;
}

export interface SaleStats {
  totalSales: number;
  totalRevenue: number;
  averageSaleValue: number;
  salesByLocation: Array<{
    location: {
      id: string;
      name: string;
      city: string;
    };
    count: number;
    totalRevenue: number;
  }>;
}

export interface SaleStatsResponse {
  success: boolean;
  data: SaleStats;
}

// API Functions
export const salesApi = {
  // Get all sales with filters
  getSales: async (filters?: SaleFilters): Promise<PaginatedSalesResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await api.get(`/api/admin/sales?${params}`);
    return data;
  },

  // Get sale by ID
  getSale: async (id: string): Promise<SaleResponse> => {
    const { data } = await api.get(`/api/admin/sales/${id}`);
    return data;
  },

  // Get sales by location
  getSalesByLocation: async (
    locationId: string,
    filters?: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<PaginatedSalesResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await api.get(
      `/api/admin/sales/location/${locationId}?${params}`
    );
    return data;
  },

  // Get sales statistics
  getSaleStats: async (filters?: {
    startDate?: string;
    endDate?: string;
    locationId?: string;
  }): Promise<SaleStatsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const { data } = await api.get(`/api/admin/sales-stats?${params}`);
    return data;
  },
};
