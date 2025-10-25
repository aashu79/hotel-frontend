import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiTruck,
  FiExternalLink,
  FiMapPin,
} from "react-icons/fi";
import { SiDoordash, SiUbereats } from "react-icons/si";
import { MdDeliveryDining } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import api from "../../lib/axios";
import DeliveryServiceModal from "../../components/admin/DeliveryServiceModal";

const DeliveryServicesManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ["deliveryServices"],
    queryFn: async () => {
      const { data } = await api.get("/delivery-services");
      return data;
    },
  });

  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data } = await api.get("/locations");
      return data;
    },
  });

  const services = servicesData?.deliveryServices || [];
  const locations = locationsData?.locations || [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/delivery-services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveryServices"] });
      message.success("Delivery service deleted successfully");
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to delete delivery service"
      );
    },
  });

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes("doordash")) return <SiDoordash size={24} />;
    if (name.includes("uber")) return <SiUbereats size={24} />;
    return <MdDeliveryDining size={24} />;
  };

  const getLocationName = (locationId: string) => {
    return (
      locations.find((loc: any) => loc.id === locationId)?.name || "Unknown"
    );
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this delivery service?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Delivery Services
            </h1>
            <p className="text-zinc-400">
              Manage external delivery service integrations
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            <FiPlus size={20} />
            Add Service
          </button>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-zinc-800 rounded-xl h-40"
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FiTruck size={64} className="text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              No Delivery Services Yet
            </h3>
            <p className="text-zinc-400 mb-6">
              Add delivery service integrations for your locations
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              Add First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-800/60 rounded-xl border border-zinc-700/50 overflow-hidden hover:border-zinc-600 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-red-600">
                        {getServiceIcon(service.name)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {service.name}
                        </h3>
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
                            service.isActive
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <FiMapPin size={16} className="flex-shrink-0" />
                      <span>{getLocationName(service.locationId)}</span>
                    </div>
                    <a
                      href={service.serviceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <FiExternalLink size={16} className="flex-shrink-0" />
                      <span className="truncate">{service.serviceUrl}</span>
                    </a>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-zinc-700">
                    <button
                      onClick={() => handleEdit(service)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
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

      {/* Delivery Service Modal */}
      {showModal && (
        <DeliveryServiceModal
          service={editingService}
          locations={locations}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            queryClient.invalidateQueries({ queryKey: ["deliveryServices"] });
          }}
        />
      )}
    </div>
  );
};

export default DeliveryServicesManagement;
