import api from "../lib/axios";

// Order Status Types
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

// Order Item Interface
export interface OrderItem {
  menuItemId: string;
  quantity: number;
  menuItem?: {
    id: string;
    name: string;
    price: number;
  };
}

// Order Interface
export interface Order {
  id: string;
  userId: string;
  locationId?: string;
  items: OrderItem[];
  tableNumber?: number;
  specialInstructions?: string;
  status: OrderStatus;
  paid: boolean;
  paymentMethod?: string;
  totalAmount: number;
  orderNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Create Order Request
export interface CreateOrderRequest {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  tableNumber?: number;
  specialInstructions?: string;
  status?: OrderStatus;
}

// Update Order Request
export interface UpdateOrderRequest {
  items?: OrderItem[];
  tableNumber?: number;
  status?: OrderStatus;
}

// Orders API Service
export const ordersApi = {
  // Create order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await api.post("/api/orders", orderData);
    return response.data;
  },

  // Get all orders (admin/staff) with optional filters
  getOrders: async (params?: {
    status?: OrderStatus;
    userId?: string;
  }): Promise<Order[]> => {
    const response = await api.get("/api/orders/all", { params });
    // Handle both response formats
    if (response.data.success && response.data.orders) {
      return response.data.orders;
    }
    return response.data;
  },

  // Get user's orders
  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get("/api/orders/user/orders");
    // Handle both response formats
    if (response.data.success && response.data.orders) {
      return response.data.orders;
    }
    return response.data;
  },

  // Get order by ID
  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  // Update order
  updateOrder: async (
    id: string,
    orderData: UpdateOrderRequest
  ): Promise<Order> => {
    const response = await api.patch(`/api/orders/${id}/status`, orderData);
    return response.data;
  },

  // Delete order
  deleteOrder: async (id: string): Promise<void> => {
    await api.delete(`/api/orders/${id}`);
  },
};
