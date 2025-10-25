import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag,
  FiTruck,
  FiMapPin,
  FiChevronDown,
} from "react-icons/fi";
import { useMenuContext } from "@/contexts/MenuContext";
import { useCart } from "@/contexts/CartContext";
import { useLocations } from "@/hooks/useLocations";

const OrderTypeSelector: React.FC = () => {
  const { orderType, setOrderType } = useMenuContext();
  const { selectedLocationId, setSelectedLocationId } = useCart();
  const { data: locationsData, isLoading: locationsLoading } =
    useLocations(true);

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locations = locationsData?.locations || [];
  const selectedLocation = locations.find(
    (loc: any) => loc.id === selectedLocationId
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOrderTypeChange = (type: "pickup" | "delivery") => {
    setOrderType(type);
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
    setShowLocationDropdown(false);
  };

  return (
    <div className="py-4 px-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Order Type Toggle */}
        <div className="flex bg-zinc-800/60 rounded-lg p-1 border border-zinc-700/50">
          <button
            onClick={() => handleOrderTypeChange("pickup")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-all flex-1 sm:flex-initial ${
              orderType === "pickup"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FiShoppingBag size={18} />
            <span className="font-medium">Pickup</span>
          </button>
          <button
            onClick={() => handleOrderTypeChange("delivery")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-all flex-1 sm:flex-initial ${
              orderType === "delivery"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FiTruck size={18} />
            <span className="font-medium">Delivery</span>
          </button>
        </div>

        {/* Location Selector - Only show for pickup */}
        {orderType === "pickup" && (
          <div
            className="relative flex-1 sm:flex-initial sm:min-w-[280px]"
            ref={dropdownRef}
          >
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              disabled={locationsLoading || locations.length === 0}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border transition-all ${
                selectedLocation
                  ? "bg-zinc-800/60 border-zinc-700/50 text-white hover:border-zinc-600"
                  : "bg-zinc-800/40 border-zinc-700/30 text-zinc-400 hover:border-zinc-600"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FiMapPin size={18} className="flex-shrink-0" />
                <span className="font-medium truncate text-left">
                  {locationsLoading
                    ? "Loading locations..."
                    : selectedLocation
                    ? selectedLocation.name
                    : "Select pickup location"}
                </span>
              </div>
              <FiChevronDown
                size={18}
                className={`flex-shrink-0 transition-transform ${
                  showLocationDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showLocationDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden z-50 max-h-[300px] overflow-y-auto"
                  style={{ minWidth: "280px" }}
                >
                  {locations.length === 0 ? (
                    <div className="px-4 py-8 text-center text-zinc-400">
                      No locations available
                    </div>
                  ) : (
                    <div className="py-1">
                      {locations.map((location: any) => (
                        <button
                          key={location.id}
                          onClick={() => handleLocationSelect(location.id)}
                          className={`w-full text-left px-4 py-3 transition-colors hover:bg-zinc-700/50 ${
                            selectedLocationId === location.id
                              ? "bg-red-600/20 text-red-400"
                              : "text-zinc-300"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <FiMapPin
                              size={16}
                              className={`flex-shrink-0 mt-0.5 ${
                                selectedLocationId === location.id
                                  ? "text-red-400"
                                  : "text-zinc-500"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium mb-0.5 truncate">
                                {location.name}
                              </div>
                              <div className="text-xs text-zinc-500 truncate">
                                {location.address}, {location.city}
                              </div>
                              {location.openingHours && (
                                <div className="text-xs text-zinc-600 mt-1">
                                  {location.openingHours}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Delivery Info - Show for delivery */}
        {orderType === "delivery" && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-400">
            <FiTruck size={18} />
            <span className="text-sm font-medium">
              Order via delivery partners
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTypeSelector;
