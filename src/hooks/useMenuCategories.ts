import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuCategoriesApi } from "../services/menuCategories";
import { message } from "antd";

// Query Keys
export const MENU_CATEGORIES_KEYS = {
  all: ["menu-categories"] as const,
  lists: () => [...MENU_CATEGORIES_KEYS.all, "list"] as const,
  list: () => [...MENU_CATEGORIES_KEYS.lists()] as const,
  details: () => [...MENU_CATEGORIES_KEYS.all, "detail"] as const,
  detail: (id: number) => [...MENU_CATEGORIES_KEYS.details(), id] as const,
};

// Hooks
export const useMenuCategories = (params?: { includeInactive?: boolean }) => {
  return useQuery({
    queryKey: [...MENU_CATEGORIES_KEYS.list(), params],
    queryFn: () => menuCategoriesApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateMenuCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuCategoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_CATEGORIES_KEYS.all });
      message.success("Menu category created successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to create menu category");
    },
  });
};

export const useUpdateMenuCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        name: string;
        description?: string;
        sortOrder?: number;
        isActive?: boolean;
      };
    }) => menuCategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_CATEGORIES_KEYS.all });
      message.success("Menu category updated successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to update menu category");
    },
  });
};

export const useToggleMenuCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuCategoriesApi.toggleStatus,
    onSuccess: (data: { message?: string }) => {
      queryClient.invalidateQueries({ queryKey: MENU_CATEGORIES_KEYS.all });
      message.success(data.message || "Menu category status updated");
    },
    onError: (error: Error) => {
      message.error("Failed to update category status");
    },
  });
};

export const useDeleteMenuCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuCategoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENU_CATEGORIES_KEYS.all });
      message.success("Menu category deleted successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to delete menu category");
    },
  });
};
