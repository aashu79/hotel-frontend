import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantApi } from "../services/restaurant";
import { message } from "antd";

// Query Keys
export const RESTAURANT_KEYS = {
  all: ["restaurant"] as const,
  config: () => [...RESTAURANT_KEYS.all, "config"] as const,
};

// Hooks
export const useRestaurantConfig = () => {
  return useQuery({
    queryKey: RESTAURANT_KEYS.config(),
    queryFn: () => restaurantApi.getConfig(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateRestaurantConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restaurantApi.updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESTAURANT_KEYS.all });
      message.success("Restaurant settings updated successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to update restaurant settings");
    },
  });
};

export const useUpdateRestaurantConfigField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      field,
      value,
    }: {
      field: string;
      value: string | number | boolean;
    }) => restaurantApi.updateConfigField(field, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESTAURANT_KEYS.all });
      message.success("Setting updated successfully");
    },
    onError: (error: Error) => {
      message.error("Failed to update setting");
    },
  });
};
