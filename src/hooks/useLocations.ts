import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../lib/axios";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  openingHours?: string;
  imageUrl?: string;
  isActive: boolean;
}

export const useLocations = (isActive?: boolean) => {
  return useQuery({
    queryKey: ["locations", isActive],
    queryFn: async () => {
      const params = isActive !== undefined ? { isActive } : {};
      const { data } = await api.get("/api/locations", { params });
      return data;
    },
  });
};
