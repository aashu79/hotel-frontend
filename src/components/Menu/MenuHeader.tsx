import React from "react";
import { motion } from "framer-motion";
import { Search, Utensils } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMenu } from "../../contexts/MenuContext";

const MenuHeader: React.FC = () => {
  const { searchTerm, setSearchTerm } = useMenu();

  return (
    <div className="bg-gradient-to-b from-red-900/30 to-transparent pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Content */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-700/20 to-red-500/20 backdrop-blur-sm border border-white/10 mb-6">
            <Utensils className="w-5 h-5 text-red-400" />
            <span className="text-white font-medium">
              Authentic Nepali Cuisine
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-red-400 via-amber-400 to-red-500 bg-clip-text text-transparent">
              Our Menu
            </span>
          </h1>

          <p className="text-lg text-neutral-gray max-w-3xl mx-auto leading-relaxed">
            Experience the authentic flavors of Nepal with our carefully crafted
            dishes, bringing the taste of the Himalayas directly to your table
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
            <Input
              placeholder="Search our menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-6 bg-black/40 border-white/10 text-white placeholder-neutral-gray rounded-xl text-lg focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all shadow-lg"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MenuHeader;
