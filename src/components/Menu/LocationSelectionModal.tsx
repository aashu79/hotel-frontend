import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiCheck,
} from "react-icons/fi";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  phoneNumber?: string;
  email?: string;
  openingHours?: string;
  imageUrl?: string;
}

interface LocationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  selectedLocationId: string | null;
  onSelectLocation: (locationId: string) => void;
  isLoading: boolean;
}

const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({
  isOpen,
  onClose,
  locations,
  selectedLocationId,
  onSelectLocation,
  isLoading,
}) => {
  const [tempSelectedId, setTempSelectedId] = useState<string | null>(
    selectedLocationId
  );

  const handleConfirm = () => {
    if (tempSelectedId) {
      onSelectLocation(tempSelectedId);
      onClose();
    }
  };

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
              className="bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-zinc-800"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Select Pickup Location
                  </h2>
                  <p className="text-red-100 text-sm mt-1">
                    Choose your nearest branch
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
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-zinc-800 rounded-xl h-32"
                      />
                    ))}
                  </div>
                ) : locations.length === 0 ? (
                  <div className="text-center py-12">
                    <FiMapPin
                      size={64}
                      className="text-zinc-700 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-medium text-white mb-2">
                      No Locations Available
                    </h3>
                    <p className="text-zinc-400">
                      Please contact us to place your order.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {locations.map((location) => (
                      <motion.div
                        key={location.id}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setTempSelectedId(location.id)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          tempSelectedId === location.id
                            ? "bg-red-600/10 border-red-500"
                            : "bg-zinc-800/60 border-zinc-700/50 hover:border-zinc-600"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Selection Indicator */}
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              tempSelectedId === location.id
                                ? "bg-red-600 border-red-600"
                                : "border-zinc-600"
                            }`}
                          >
                            {tempSelectedId === location.id && (
                              <FiCheck size={16} className="text-white" />
                            )}
                          </div>

                          {/* Location Details */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {location.name}
                            </h3>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2 text-zinc-400">
                                <FiMapPin
                                  size={16}
                                  className="flex-shrink-0 mt-0.5"
                                />
                                <span>
                                  {location.address}, {location.city}
                                  {location.state && `, ${location.state}`}
                                </span>
                              </div>

                              {location.phoneNumber && (
                                <div className="flex items-center gap-2 text-zinc-400">
                                  <FiPhone
                                    size={16}
                                    className="flex-shrink-0"
                                  />
                                  <span>{location.phoneNumber}</span>
                                </div>
                              )}

                              {location.openingHours && (
                                <div className="flex items-center gap-2 text-zinc-400">
                                  <FiClock
                                    size={16}
                                    className="flex-shrink-0"
                                  />
                                  <span>{location.openingHours}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-900/50">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!tempSelectedId}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Location
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LocationSelectionModal;
