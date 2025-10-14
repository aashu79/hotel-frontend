import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  ShoppingBag,
  Star,
  Settings,
  ChevronRight,
} from "lucide-react";

const Profile = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const user = {
    name: "Alex Johnson",
    phoneNumber: "+1 234 567 8900",
  };

  const actions = [
    {
      icon: ShoppingBag,
      label: "My Orders",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Star,
      label: "My Reviews",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Settings,
      label: "Settings",
      color: "from-red-600 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              My Profile
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="relative">
              {/* Avatar Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 blur-3xl rounded-3xl"></div>

              {/* Avatar Container */}
              <div className="relative flex flex-col items-center pt-8 pb-8">
                <div className="h-40 w-40 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
                  <User size={80} className="text-white" />
                </div>

                <h2 className="text-3xl font-bold text-white text-center mb-2">
                  {user.name}
                </h2>
                <p className="text-gray-500 text-center text-sm">
                  {user.phoneNumber}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Edit Profile
            </motion.button>
          </motion.div>

          {/* Right Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {/* Contact Info Section */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-red-500 to-orange-500 rounded"></span>
                Contact Information
              </h3>

              <div className="space-y-3">
                <div className="group cursor-pointer">
                  <p className="text-gray-500 text-sm mb-1">Full Name</p>
                  <p className="text-white text-lg font-semibold group-hover:text-red-400 transition-colors">
                    {user.name}
                  </p>
                  <div className="h-px bg-gradient-to-r from-gray-800 to-transparent group-hover:from-red-500/30 transition-colors mt-2"></div>
                </div>

                <div className="group cursor-pointer mt-6">
                  <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                  <p className="text-white text-lg font-semibold group-hover:text-red-400 transition-colors">
                    {user.phoneNumber}
                  </p>
                  <div className="h-px bg-gradient-to-r from-gray-800 to-transparent group-hover:from-red-500/30 transition-colors mt-2"></div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 my-12"></div>

            {/* Quick Actions Section */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-red-500 to-orange-500 rounded"></span>
                Quick Access
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <motion.button
                      key={index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-6 py-6 rounded-2xl overflow-hidden bg-gray-900/40 border border-gray-800 hover:border-red-500/30 transition-all duration-300"
                    >
                      {/* Hover Background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      ></div>

                      {/* Content */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${action.color}`}
                          >
                            <IconComponent size={24} className="text-white" />
                          </div>
                          <span className="text-white font-semibold text-left">
                            {action.label}
                          </span>
                        </div>
                        <ChevronRight
                          size={20}
                          className={`text-gray-600 group-hover:text-red-400 transition-all duration-300 ${
                            hoveredIndex === index ? "translate-x-1" : ""
                          }`}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Logout Button - Full Width */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full mt-16 px-8 py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <LogOut
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Logout</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Profile;
