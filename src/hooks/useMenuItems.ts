import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuItemsApi } from "../services/menuItems";
import { message } from "antd";

// Query Keys
export const MENU_ITEMS_KEYS = {
  all: ["menu-items"] as const,
  lists: () => [...MENU_ITEMS_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...MENU_ITEMS_KEYS.lists(), filters] as const,
  details: () => [...MENU_ITEMS_KEYS.all, "detail"] as const,
  detail: (id: number) => [...MENU_ITEMS_KEYS.details(), id] as const,
};

// Hooks
export const useMenuItems = (params?: {
  categoryId?: number;
  isVegetarian?: boolean;
  isAvailable?: boolean;
}) => {
  return useQuery({
    queryKey: MENU_ITEMS_KEYS.list(params || {}),
    queryFn: () => menuItemsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMenuItem = (id: number) => {
  return useQuery({
    queryKey: MENU_ITEMS_KEYS.detail(id),
    queryFn: () => menuItemsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuItemsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_ITEMS_KEYS.all });
      message.success("Menu item created successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to create menu item");
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      menuItemsApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_ITEMS_KEYS.all });
      message.success("Menu item updated successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to update menu item");
    },
  });
};

export const useToggleMenuItemAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuItemsApi.toggleAvailability,
    onSuccess: (data: { message?: string }) => {
      queryClient.invalidateQueries({ queryKey: MENU_ITEMS_KEYS.all });
      message.success(data.message || "Menu item availability updated");
    },
    onError: (error: Error) => {
      message.error("Failed to update availability");
    },
  });
};

export const useToggleMenuItemVegetarian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuItemsApi.toggleVegetarian,
    onSuccess: (data: { message?: string }) => {
      queryClient.invalidateQueries({ queryKey: MENU_ITEMS_KEYS.all });
      message.success(data.message || "Menu item vegetarian status updated");
    },
    onError: (error: Error) => {
      message.error("Failed to update vegetarian status");
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuItemsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_ITEMS_KEYS.all });
      message.success("Menu item deleted successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to delete menu item");
    },
  });
};
