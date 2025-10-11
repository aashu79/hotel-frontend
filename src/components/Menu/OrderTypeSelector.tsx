import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Car, Store } from "lucide-react";
import { useMenu } from "../../contexts/MenuContext";

const OrderTypeSelector: React.FC = () => {
  const { orderType, setOrderType } = useMenu();
  const [location, setLocation] = useState("Bedford");
  const [time, setTime] = useState("ASAP");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="max-w-4xl mx-auto px-4 md:px-6 py-4"
    >
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-1 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {/* Order Type Toggle */}
          <div className="md:col-span-2 flex rounded-lg overflow-hidden">
            <button
              onClick={() => setOrderType("pickup")}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all ${
                orderType === "pickup"
                  ? "bg-red-600 text-white"
                  : "bg-black/40 text-neutral-gray hover:bg-black/60"
              }`}
            >
              <Store size={18} />
              <span className="font-medium">Pickup</span>
            </button>
            <button
              onClick={() => setOrderType("delivery")}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all ${
                orderType === "delivery"
                  ? "bg-red-600 text-white"
                  : "bg-black/40 text-neutral-gray hover:bg-black/60"
              }`}
            >
              <Car size={18} />
              <span className="font-medium">Delivery</span>
            </button>
          </div>

          {/* Location Selector */}
          <div className="md:col-span-3 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <MapPin size={18} className="text-red-400" />
            </div>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-full pl-10 pr-4 py-3 bg-black/40 border-0 rounded-lg text-white focus:ring-1 focus:ring-red-400 appearance-none cursor-pointer"
            >
              <option value="Bedford" className="bg-deep-black">
                Bedford Location
              </option>
              <option value="Arlington" className="bg-deep-black">
                Arlington Location
              </option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-neutral-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Time Selector */}
          <div className="md:col-span-2 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Clock size={18} className="text-red-400" />
            </div>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-full pl-10 pr-4 py-3 bg-black/40 border-0 rounded-lg text-white focus:ring-1 focus:ring-red-400 appearance-none cursor-pointer"
            >
              <option value="ASAP" className="bg-deep-black">
                ASAP
              </option>
              <option value="Later" className="bg-deep-black">
                Schedule for Later
              </option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-neutral-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderTypeSelector;
