import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiClock, FiPhone } from "react-icons/fi";
import { useLocations } from "@/hooks/useLocations";
import { useCart } from "@/contexts/CartContext";

const LocationSelector: React.FC = () => {
  const { data: locationsData, isLoading } = useLocations(true);
  const { selectedLocationId, setSelectedLocationId } = useCart();
  const [showAllLocations, setShowAllLocations] = useState(false);

  const locations = locationsData?.locations || [];
  const selectedLocation = locations.find(
    (loc: any) => loc.id === selectedLocationId
  );

  const displayedLocations = showAllLocations
    ? locations
    : locations.slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-zinc-800 rounded-xl h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FiMapPin className="text-red-500" />
          Select Pickup Location
        </h3>
        {!selectedLocationId && (
          <span className="text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
            Required
          </span>
        )}
      </div>

      <div className="space-y-3">
        {displayedLocations.map((location: any) => (
          <motion.button
            key={location.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedLocationId(location.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedLocationId === location.id
                ? "bg-red-600/10 border-red-500 shadow-lg shadow-red-500/20"
                : "bg-zinc-800/60 border-zinc-700/50 hover:border-zinc-600"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  selectedLocationId === location.id
                    ? "bg-red-600 border-red-600"
                    : "border-zinc-600"
                }`}
              >
                {selectedLocationId === location.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold mb-2">
                  {location.name}
                </h4>

                <div className="space-y-1.5 text-sm text-zinc-400">
                  <div className="flex items-start gap-2">
                    <FiMapPin size={14} className="flex-shrink-0 mt-0.5" />
                    <span>
                      {location.address}, {location.city}
                      {location.state && `, ${location.state}`}
                    </span>
                  </div>

                  {location.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <FiPhone size={14} className="flex-shrink-0" />
                      <span>{location.phoneNumber}</span>
                    </div>
                  )}

                  {location.openingHours && (
                    <div className="flex items-center gap-2">
                      <FiClock size={14} className="flex-shrink-0" />
                      <span>{location.openingHours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {locations.length > 3 && (
        <button
          onClick={() => setShowAllLocations(!showAllLocations)}
          className="w-full py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          {showAllLocations
            ? "Show Less"
            : `Show ${locations.length - 3} More Locations`}
        </button>
      )}
    </div>
  );
};

export default LocationSelector;
