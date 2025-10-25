import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../lib/axios";

interface DeliveryService {
  id: string;
  name: string;
  serviceUrl: string;
  isActive: boolean;
  locationId: string;
}

export const useDeliveryServices = (
  locationId?: string,
  isActive?: boolean
) => {
  return useQuery({
    queryKey: ["deliveryServices", locationId, isActive],
    queryFn: async () => {
      const params: any = {};
      //   if (locationId) params.locationId = locationId;
      if (isActive !== undefined) params.isActive = isActive;

      const { data } = await api.get("/api/delivery-services", {
        params,
      });
      return data;
    },
    enabled: !!locationId, // Only fetch if locationId is provided
  });
};
