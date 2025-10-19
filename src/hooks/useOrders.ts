import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ordersApi,
  type CreateOrderRequest,
  type UpdateOrderRequest,
  type OrderStatus,
} from "../services/orders";
import { message } from "antd";

// Query Keys
export const ORDERS_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDERS_KEYS.all, "list"] as const,
  list: (filters: { status?: OrderStatus; userId?: string }) =>
    [...ORDERS_KEYS.lists(), filters] as const,
  myOrders: () => [...ORDERS_KEYS.all, "my-orders"] as const,
  details: () => [...ORDERS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ORDERS_KEYS.details(), id] as const,
};

// Hooks
export const useOrders = (params?: {
  status?: OrderStatus;
  userId?: string;
}) => {
  return useQuery({
    queryKey: ORDERS_KEYS.list(params || {}),
    queryFn: () => ordersApi.getOrders(params),
    staleTime: 30 * 1000, // 30 seconds for real-time updates
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ORDERS_KEYS.myOrders(),
    queryFn: () => ordersApi.getMyOrders(),
    staleTime: 5 * 60 * 1000, // 5 minutes - no polling for customer
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ORDERS_KEYS.detail(id),
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) =>
      ordersApi.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.all });
      message.success("Order placed successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to place order");
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderRequest }) =>
      ordersApi.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.all });
      message.success("Order updated successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to update order");
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEYS.all });
      message.success("Order cancelled successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to cancel order");
    },
  });
};
