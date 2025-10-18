import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customersApi } from "../services/customers";
import { message } from "antd";

// Query Keys
export const CUSTOMERS_KEYS = {
  all: ["customers"] as const,
  lists: () => [...CUSTOMERS_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...CUSTOMERS_KEYS.lists(), filters] as const,
  details: () => [...CUSTOMERS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CUSTOMERS_KEYS.details(), id] as const,
};

// Hooks
export const useCustomers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: CUSTOMERS_KEYS.list(params || {}),
    queryFn: () => customersApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEYS.all });
      message.success("Customer deleted successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to delete customer");
    },
  });
};
