import api from "../lib/axios";

// Types
export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  stripePaymentId: string | null;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
    role: string;
  };
  order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    specialNotes: string | null;
    createdAt: string;
    location: {
      id: string;
      name: string;
      address: string;
      city: string;
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
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  userId?: string;
  orderId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  locationId?: string;
}

export interface PaginatedPaymentsResponse {
  success: boolean;
  data: Payment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface PaymentResponse {
  success: boolean;
  data: Payment;
}

export interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  totalRevenue: number;
  averageOrderValue: number;
  paymentsByStatus: Array<{
    status: string;
    count: number;
    totalAmount: number;
  }>;
}

export interface PaymentStatsResponse {
  success: boolean;
  data: PaymentStats;
}

// API Functions
export const paymentsApi = {
  // Get all payments with filters
  getPayments: async (
    filters?: PaymentFilters
  ): Promise<PaginatedPaymentsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const { data } = await api.get(`/api/admin/payments?${params}`);
    return data;
  },

  // Get payment by ID
  getPayment: async (id: string): Promise<PaymentResponse> => {
    const { data } = await api.get(`/api/admin/payments/${id}`);
    return data;
  },

  // Get payments by user
  getPaymentsByUser: async (
    userId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedPaymentsResponse> => {
    const { data } = await api.get(
      `/api/admin/payments/user/${userId}?page=${page}&limit=${limit}`
    );
    return data;
  },

  // Get payment statistics
  getPaymentStats: async (filters?: {
    startDate?: string;
    endDate?: string;
    locationId?: string;
  }): Promise<PaymentStatsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const { data } = await api.get(`/api/admin/payments-stats?${params}`);
    return data;
  },
};
