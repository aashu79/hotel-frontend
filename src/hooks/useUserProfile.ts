import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await api.get("/api/auth/profile");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
