import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiExternalLink } from "react-icons/fi";
import { SiDoordash, SiUbereats } from "react-icons/si";
import { MdDeliveryDining } from "react-icons/md";

interface DeliveryService {
  id: string;
  name: string;
  serviceUrl: string;
  isActive: boolean;
}

interface DeliveryServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryServices: DeliveryService[];
  isLoading: boolean;
}

const getServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  if (name.includes("doordash")) return <SiDoordash size={32} />;
  if (name.includes("uber")) return <SiUbereats size={32} />;
  return <MdDeliveryDining size={32} />;
};

const DeliveryServicesModal: React.FC<DeliveryServicesModalProps> = ({
  isOpen,
  onClose,
  deliveryServices,
  isLoading,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-zinc-800"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Order for Delivery
                  </h2>
                  <p className="text-red-100 text-sm mt-1">
                    Choose your preferred delivery service
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-red-100 transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-zinc-800 rounded-xl h-20"
                      />
                    ))}
                  </div>
                ) : deliveryServices.length === 0 ? (
                  <div className="text-center py-12">
                    <MdDeliveryDining
                      size={64}
                      className="text-zinc-700 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-medium text-white mb-2">
                      No Delivery Services Available
                    </h3>
                    <p className="text-zinc-400">
                      Please select pickup or contact us directly to order.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {deliveryServices.map((service) => (
                      <motion.a
                        key={service.id}
                        href={service.serviceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 bg-zinc-800/60 hover:bg-zinc-800 rounded-xl border border-zinc-700/50 hover:border-red-500/50 transition-all group"
                      >
                        <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg flex items-center justify-center text-red-600">
                          {getServiceIcon(service.name)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-zinc-400 text-sm">
                            Order now via {service.name}
                          </p>
                        </div>
                        <FiExternalLink
                          size={20}
                          className="text-zinc-500 group-hover:text-red-500 transition-colors"
                        />
                      </motion.a>
                    ))}
                  </div>
                )}

                {/* Note */}
                <div className="mt-6 p-4 bg-zinc-800/40 rounded-lg border border-zinc-700/30">
                  <p className="text-sm text-zinc-400 text-center">
                    You'll be redirected to the delivery service website to
                    complete your order
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeliveryServicesModal;
