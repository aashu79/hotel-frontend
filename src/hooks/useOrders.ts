import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../services/orders";
import { message } from "antd";

// Query Keys
export const ORDERS_KEYS = {
  all: ["orders"] as const,
  orders: () => [...ORDERS_KEYS.all, "orders"] as const,
  order: (id: number) => [...ORDERS_KEYS.all, "order", id] as const,
};

// Hooks
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      message.success("Order placed successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to place order");
    },
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ORDERS_KEYS.orders(),
    queryFn: () => ordersApi.getOrders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ORDERS_KEYS.order(id),
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      ordersApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.all });
      message.success("Order status updated");
    },
    onError: (error: Error) => {
      message.error("Failed to update order status");
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => ordersApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.all });
      message.success("Order cancelled");
    },
    onError: (error: Error) => {
      message.error("Failed to cancel order");
    },
  });
};
