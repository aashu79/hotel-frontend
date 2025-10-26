import api from "../lib/axios";

export interface DeliveryService {
  id: string;
  name: string;
  serviceUrl: string;
  isActive: boolean;
  locationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryServiceDto {
  name: string;
  serviceUrl: string;
  locationId: string;
  isActive?: boolean;
}

class DeliveryServiceService {
  async getAllDeliveryServices(locationId?: string, isActive?: boolean) {
    const params: any = {};
    if (locationId) params.locationId = locationId;
    if (isActive !== undefined) params.isActive = isActive;
    const response = await api.get<DeliveryService[]>(
      "/api/delivery-services",
      {
        params,
      }
    );
    return response.data;
  }

  async getDeliveryServicesByLocation(locationId: string) {
    const response = await api.get<DeliveryService[]>(
      `/api/delivery-services/location/${locationId}`
    );
    return response.data;
  }

  async getDeliveryServiceById(id: string) {
    const response = await api.get<DeliveryService>(
      `/api/delivery-services/${id}`
    );
    return response.data;
  }

  async createDeliveryService(data: CreateDeliveryServiceDto) {
    const response = await api.post<DeliveryService>(
      "/api/delivery-services",
      data
    );
    return response.data;
  }

  async updateDeliveryService(
    id: string,
    data: Partial<CreateDeliveryServiceDto>
  ) {
    const response = await api.put<DeliveryService>(
      `/api/delivery-services/${id}`,
      data
    );
    return response.data;
  }

  async deleteDeliveryService(id: string) {
    const response = await api.delete(`/api/delivery-services/${id}`);
    return response.data;
  }
}

export default new DeliveryServiceService();
