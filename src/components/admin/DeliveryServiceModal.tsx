import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import api from "../../lib/axios";

interface DeliveryServiceModalProps {
  service?: any;
  locations: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const DeliveryServiceModal: React.FC<DeliveryServiceModalProps> = ({
  service,
  locations,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    serviceUrl: "",
    locationId: "",
    isActive: true,
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    }
  }, [service]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (service) {
        return await api.put(`/delivery-services/${service.id}`, data);
      } else {
        return await api.post("/delivery-services", data);
      }
    },
    onSuccess: () => {
      message.success(
        service
          ? "Delivery service updated successfully"
          : "Delivery service created successfully"
      );
      onSuccess();
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message ||
          `Failed to ${service ? "update" : "create"} delivery service`
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-900 rounded-2xl max-w-lg w-full border border-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {service ? "Edit Delivery Service" : "Add Delivery Service"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <FiX size={24} className="text-zinc-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="DoorDash"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Service URL *
              </label>
              <input
                type="url"
                name="serviceUrl"
                value={formData.serviceUrl}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://www.doordash.com/store/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Location *
              </label>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Location</option>
                {locations.map((location: any) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded border-zinc-700 text-red-600 focus:ring-red-500"
              />
              <label className="text-sm font-medium text-zinc-300">
                Active (Service is available for customers)
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {mutation.isPending
                  ? "Saving..."
                  : service
                  ? "Update Service"
                  : "Create Service"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeliveryServiceModal;
