import api from "../lib/axios";

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  isActive: boolean;
  openingHours?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationDto {
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
  isActive?: boolean;
}

class LocationService {
  async getAllLocations(isActive?: boolean) {
    const params = isActive !== undefined ? { isActive } : {};
    const response = await api.get<{ locations: Location[]; success: boolean }>(
      "/api/locations",
      { params }
    );
    return response.data;
  }

  async getLocationById(id: string) {
    const response = await api.get<Location>(`/api/locations/${id}`);
    return response.data;
  }

  async createLocation(data: CreateLocationDto) {
    const response = await api.post<Location>("/api/locations", data);
    return response.data;
  }

  async updateLocation(id: string, data: Partial<CreateLocationDto>) {
    const response = await api.put<Location>(`/api/locations/${id}`, data);
    return response.data;
  }

  async deleteLocation(id: string) {
    const response = await api.delete(`/api/locations/${id}`);
    return response.data;
  }

  async getLocationStaff(id: string) {
    const response = await api.get(`/api/locations/${id}/staff`);
    return response.data;
  }
}

export default new LocationService();
