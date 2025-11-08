import api from "../lib/axios";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateCheckoutSessionRequest {
  orderId: string;
  items: CartItem[];
  currency: string;
  userId: string;
  locationId: string;
  tableNumber?: number;
  specialInstructions?: string;
}

export interface CreateCheckoutSessionResponse {
  url: string;
}

export interface VerifyPaymentRequest {
  session_id: string;
}

export interface VerifyPaymentResponse {
  order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    paid: boolean;
    userId: string;
    locationId: string;
    createdAt: string;
  };
}

export const paymentApi = {
  createCheckoutSession: async (
    data: CreateCheckoutSessionRequest
  ): Promise<CreateCheckoutSessionResponse> => {
    console.log("🚀 Creating checkout session with data:", data);
    console.log("📦 Items:", JSON.stringify(data.items, null, 2));
    console.log("🆔 OrderId:", data.orderId);
    console.log("💰 Currency:", data.currency);
    console.log("👤 UserId:", data.userId);
    console.log("📍 LocationId:", data.locationId);

    const response = await api.post(
      "/api/payments/create-checkout-session",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Response:", response.data);
    return response.data;
  },
  verifyPayment: async (
    data: VerifyPaymentRequest
  ): Promise<VerifyPaymentResponse> => {
    const response = await api.post("/api/payments/verify-payment", data);
    return response.data;
  },
};
