import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "../services/staff";
import { message } from "antd";

// Query Keys
export const STAFF_KEYS = {
  all: ["staff"] as const,
  lists: () => [...STAFF_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...STAFF_KEYS.lists(), filters] as const,
  details: () => [...STAFF_KEYS.all, "detail"] as const,
  detail: (id: string) => [...STAFF_KEYS.details(), id] as const,
};

// Hooks
export const useStaff = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: STAFF_KEYS.list(params || {}),
    queryFn: () => staffApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.all });
      message.success("Staff member created successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to create staff member");
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        email?: string;
        role?: string;
        phone?: string;
        isActive?: boolean;
      };
    }) => staffApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.all });
      message.success("Staff member updated successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to update staff member");
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.all });
      message.success("Staff member deleted successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to delete staff member");
    },
  });
};
