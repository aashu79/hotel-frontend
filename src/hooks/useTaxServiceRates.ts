import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  taxServiceRatesApi,
  TaxServiceRate,
  CreateOrUpdateRateRequest,
} from "../services/taxServiceRates";

export const useTaxServiceRates = () => {
  return useQuery<TaxServiceRate[]>({
    queryKey: ["tax-service-rates"],
    queryFn: taxServiceRatesApi.getAll,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useTaxServiceRate = (id: string) => {
  return useQuery<TaxServiceRate>({
    queryKey: ["tax-service-rate", id],
    queryFn: () => taxServiceRatesApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTaxServiceRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrUpdateRateRequest) =>
      taxServiceRatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-service-rates"] });
    },
  });
};

export const useUpdateTaxServiceRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CreateOrUpdateRateRequest;
    }) => taxServiceRatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-service-rates"] });
    },
  });
};

export const useDeleteTaxServiceRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taxServiceRatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-service-rates"] });
    },
  });
};
