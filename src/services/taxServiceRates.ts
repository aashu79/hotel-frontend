import api from "../lib/axios";

export interface TaxServiceRate {
  id: string;
  name: string;
  rate: number;
  isActive: boolean;
}

export interface CreateOrUpdateRateRequest {
  name: string;
  rate: number;
  isActive: boolean;
}

export const taxServiceRatesApi = {
  getAll: async (): Promise<TaxServiceRate[]> => {
    const response = await api.get("/api/tax-service-rates/");
    return response.data;
  },
  getById: async (id: string): Promise<TaxServiceRate> => {
    const response = await api.get(`/api/tax-service-rates/${id}`);
    return response.data;
  },
  create: async (data: CreateOrUpdateRateRequest): Promise<TaxServiceRate> => {
    const response = await api.post("/api/tax-service-rates/", data);
    return response.data;
  },
  update: async (
    id: string,
    data: CreateOrUpdateRateRequest
  ): Promise<TaxServiceRate> => {
    const response = await api.put(`/api/tax-service-rates/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/tax-service-rates/${id}`);
  },
};
