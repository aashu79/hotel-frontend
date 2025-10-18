import axios from "axios";

// Orders/Cart API Service
export const ordersApi = {
  // Create order
  createOrder: async (orderData: {
    orderArray: Array<{
      name: string;
      price: number;
      quantity: number;
      total: number;
    }>;
    totalAmount: number;
  }) => {
    const response = await axios.post(
      "http://localhost:3000/order/createOrder",
      orderData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  // Get orders (for admin/staff)
  getOrders: async () => {
    const response = await axios.get("/api/orders");
    return response.data;
  },

  // Get single order
  getOrder: async (orderId: number) => {
    const response = await axios.get(`/api/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId: number, status: string) => {
    const response = await axios.put(`/api/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: number) => {
    const response = await axios.put(`/api/orders/${orderId}/cancel`);
    return response.data;
  },
};
