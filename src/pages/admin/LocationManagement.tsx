import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiImage,
} from "react-icons/fi";
import { useLocations } from "@/hooks/useLocations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { message } from "antd";
import LocationModal from "@/components/admin/LocationModal";

const LocationManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: locationsData, isLoading } = useLocations();
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);

  const locations = locationsData?.locations || [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/locations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      message.success("Location deleted successfully");
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to delete location"
      );
    },
  });

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLocation(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Location Management
            </h1>
            <p className="text-zinc-400">
              Manage restaurant branches and locations
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            <FiPlus size={20} />
            Add Location
          </button>
        </div>

        {/* Locations Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-zinc-800 rounded-xl h-64"
              />
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FiMapPin size={64} className="text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              No Locations Yet
            </h3>
            <p className="text-zinc-400 mb-6">
              Start by adding your first restaurant location
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              Add First Location
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location: any) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-800/60 rounded-xl border border-zinc-700/50 overflow-hidden hover:border-zinc-600 transition-all"
              >
                {/* Image */}
                {location.imageUrl && (
                  <div className="h-40 bg-zinc-900">
                    <img
                      src={location.imageUrl}
                      alt={location.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {location.name}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          location.isActive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {location.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-zinc-400 mb-4">
                    <div className="flex items-start gap-2">
                      <FiMapPin size={16} className="flex-shrink-0 mt-0.5" />
                      <span>
                        {location.address}, {location.city}
                        {location.state && `, ${location.state}`}
                      </span>
                    </div>

                    {location.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <FiPhone size={16} className="flex-shrink-0" />
                        <span>{location.phoneNumber}</span>
                      </div>
                    )}

                    {location.email && (
                      <div className="flex items-center gap-2">
                        <FiMail size={16} className="flex-shrink-0" />
                        <span>{location.email}</span>
                      </div>
                    )}

                    {location.openingHours && (
                      <div className="flex items-center gap-2">
                        <FiClock size={16} className="flex-shrink-0" />
                        <span>{location.openingHours}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-zinc-700">
                    <button
                      onClick={() => handleEdit(location)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(location.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Location Modal */}
      {showModal && (
        <LocationModal
          location={editingLocation}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            queryClient.invalidateQueries({ queryKey: ["locations"] });
          }}
        />
      )}
    </div>
  );
};

export default LocationManagement;
