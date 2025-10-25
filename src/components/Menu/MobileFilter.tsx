import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, LeafyGreen, Thermometer, Star } from "lucide-react";
import { useMenuContext } from "../../contexts/MenuContext";

interface MobileFiltersProps {
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  showMobileFilters,
  setShowMobileFilters,
}) => {
  const {
    selectedCategory,
    setSelectedCategory,
    activeFilters,
    setActiveFilters,
    menuCategories,
  } = useMenuContext();

  const categories = ["All", ...(menuCategories || [])];

  const toggleFilter = (filter: keyof typeof activeFilters) => {
    setActiveFilters({
      ...activeFilters,
      [filter]: !activeFilters[filter],
    });
  };

  // Filter button with badge showing active filter count
  const filterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <>
      {/* Mobile Filter Button - Fixed */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed left-6 bottom-6 z-40 p-4 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-500 transition-all duration-300"
      >
        <Filter size={24} />
        {filterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold">
            {filterCount}
          </span>
        )}
      </motion.button>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setShowMobileFilters(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.6 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-deep-black border-t border-white/10 rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Menu Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-white mb-3">
                    Categories
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowMobileFilters(false);
                        }}
                        className={`px-4 py-3 rounded-lg text-center transition-all ${
                          selectedCategory === category
                            ? "bg-red-600 text-white"
                            : "bg-black/40 text-neutral-gray border border-white/10"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary Filters */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">
                    Dietary Preferences
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => toggleFilter("vegetarian")}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        activeFilters.vegetarian
                          ? "bg-gradient-to-r from-green-700 to-green-600 text-white"
                          : "bg-black/20 text-neutral-gray border border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <LeafyGreen className="w-5 h-5" />
                        <span>Vegetarian</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          activeFilters.vegetarian
                            ? "bg-white border-white"
                            : "border-neutral-gray"
                        }`}
                      >
                        {activeFilters.vegetarian && (
                          <svg
                            className="w-3 h-3 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => toggleFilter("spicy")}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        activeFilters.spicy
                          ? "bg-gradient-to-r from-orange-700 to-orange-600 text-white"
                          : "bg-black/20 text-neutral-gray border border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Thermometer className="w-5 h-5" />
                        <span>Spicy</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          activeFilters.spicy
                            ? "bg-white border-white"
                            : "border-neutral-gray"
                        }`}
                      >
                        {activeFilters.spicy && (
                          <svg
                            className="w-3 h-3 text-orange-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => toggleFilter("popular")}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        activeFilters.popular
                          ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white"
                          : "bg-black/20 text-neutral-gray border border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5" />
                        <span>Popular Items</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          activeFilters.popular
                            ? "bg-white border-white"
                            : "border-neutral-gray"
                        }`}
                      >
                        {activeFilters.popular && (
                          <svg
                            className="w-3 h-3 text-amber-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full mt-6 py-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileFilters;
