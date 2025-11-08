import { create } from "zustand";
import locationService, { Location } from "../services/locationService";

interface LocationState {
  locations: Location[];
  activeLocations: Location[];
  currentLocation: Location | null;
  loading: boolean;
  error: string | null;
  fetchLocations: (isActive?: boolean) => Promise<void>;
  fetchActiveLocations: () => Promise<void>;
  fetchLocationById: (id: string) => Promise<void>;
  createLocation: (data: any) => Promise<Location>;
  updateLocation: (id: string, data: any) => Promise<Location>;
  deleteLocation: (id: string) => Promise<void>;
  setCurrentLocation: (location: Location | null) => void;
}

const useLocationStore = create<LocationState>((set) => ({
  locations: [],
  activeLocations: [],
  currentLocation: null,
  loading: false,
  error: null,

  fetchLocations: async (isActive?: boolean) => {
    set({ loading: true, error: null });
    try {
      const locations = await locationService.getAllLocations(isActive);
      set({ locations: locations.locations, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch locations",
        loading: false,
      });
    }
  },

  fetchActiveLocations: async () => {
    set({ loading: true, error: null });
    try {
      const activeLocations = await locationService.getAllLocations(true);
      set({ activeLocations: activeLocations?.locations, loading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch active locations",
        loading: false,
      });
    }
  },

  fetchLocationById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const location = await locationService.getLocationById(id);
      set({ currentLocation: location, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch location",
        loading: false,
      });
    }
  },

  createLocation: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const location = await locationService.createLocation(data);
      set((state) => ({
        locations: [...state.locations, location],
        loading: false,
      }));
      return location;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create location",
        loading: false,
      });
      throw error;
    }
  },

  updateLocation: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      const updatedLocation = await locationService.updateLocation(id, data);
      set((state) => ({
        locations: state.locations.map((loc) =>
          loc.id === id ? updatedLocation : loc
        ),
        loading: false,
      }));
      return updatedLocation;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update location",
        loading: false,
      });
      throw error;
    }
  },

  deleteLocation: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await locationService.deleteLocation(id);
      set((state) => ({
        locations: state.locations.filter((loc) => loc.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete location",
        loading: false,
      });
      throw error;
    }
  },

  setCurrentLocation: (location: Location | null) => {
    set({ currentLocation: location });
  },
}));

export default useLocationStore;
