import api from "./api";

class OrderService {
  async getAllOrders(locationId?: string) {
    const params = locationId ? { locationId } : {};
    const response = await api.get("/orders/all", { params });
    return response.data;
  }

  async createOrder(orderData: any) {
    const response = await api.post("/orders", orderData);
    return response.data;
  }

  // ...existing methods
}

export default new OrderService();
