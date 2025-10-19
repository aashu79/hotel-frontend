import React from "react";
import { motion } from "framer-motion";
import {
  Utensils,
  Beef,
  Fish,
  Wheat,
  Coffee,
  Cookie,
  Salad,
  Soup,
  Flame,
  Sparkles,
  LeafyGreen,
  Thermometer,
  Star,
} from "lucide-react";
import { useMenu } from "../../contexts/MenuContext";

const MenuSidebar: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    activeFilters,
    setActiveFilters,
    menuCategories,
  } = useMenu();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Appetizers":
        return <Utensils className="w-5 h-5 flex-shrink-0" />;
      case "Chicken":
        return <Beef className="w-5 h-5 flex-shrink-0" />;
      case "Seafood":
        return <Fish className="w-5 h-5 flex-shrink-0" />;
      case "Special Dhido":
        return <Wheat className="w-5 h-5 flex-shrink-0" />;
      case "Nepali Entrées":
        return <Flame className="w-5 h-5 flex-shrink-0" />;
      case "Naan":
        return <Cookie className="w-5 h-5 flex-shrink-0" />;
      case "Salad":
        return <Salad className="w-5 h-5 flex-shrink-0" />;
      case "Soup":
        return <Soup className="w-5 h-5 flex-shrink-0" />;
      case "Beverages":
        return <Coffee className="w-5 h-5 flex-shrink-0" />;
      case "Dessert":
        return <Cookie className="w-5 h-5 flex-shrink-0" />;
      case "Sides":
        return <Sparkles className="w-5 h-5 flex-shrink-0" />;
      case "Tandoor Specialties":
        return <Flame className="w-5 h-5 flex-shrink-0" />;
      default:
        return <Utensils className="w-5 h-5 flex-shrink-0" />;
    }
  };

  const categories = ["All", ...(menuCategories || [])];

  const toggleFilter = (filter: keyof typeof activeFilters) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 space-y-8 pb-6 min-w-[220px] w-full"
    >
      {/* Categories Section */}
      <div>
        <h2 className="text-xl font-display font-bold mb-4 text-white relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-600 before:rounded-full">
          Categories
        </h2>

        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-red-700 to-red-600 text-white font-medium"
                  : "hover:bg-black/40 text-neutral-gray"
              }`}
            >
              <div className="flex-shrink-0">
                {category === "All" ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  getCategoryIcon(category)
                )}
              </div>
              <span className="whitespace-normal text-left text-sm leading-tight">
                {category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div>
        <h2 className="text-xl font-display font-bold mb-4 text-white relative pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-600 before:rounded-full">
          Dietary Filters
        </h2>

        <div className="space-y-3">
          <button
            onClick={() => toggleFilter("vegetarian")}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all ${
              activeFilters.vegetarian
                ? "bg-gradient-to-r from-green-700 to-green-600 text-white"
                : "bg-black/20 text-neutral-gray hover:bg-black/40"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <LeafyGreen className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm whitespace-normal leading-tight">
                Vegetarian
              </span>
            </div>
            <div
              className={`ml-2 w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 ${
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
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all ${
              activeFilters.spicy
                ? "bg-gradient-to-r from-orange-700 to-orange-600 text-white"
                : "bg-black/20 text-neutral-gray hover:bg-black/40"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Thermometer className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm whitespace-normal leading-tight">
                Spicy
              </span>
            </div>
            <div
              className={`ml-2 w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 ${
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
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all ${
              activeFilters.popular
                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white"
                : "bg-black/20 text-neutral-gray hover:bg-black/40"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Star className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm whitespace-normal leading-tight">
                Popular Items
              </span>
            </div>
            <div
              className={`ml-2 w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 ${
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

      {/* Help Box */}
      <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-5 rounded-xl border border-red-900/30">
        <h3 className="font-display font-bold text-lg mb-2 text-white">
          Need Help?
        </h3>
        <p className="text-xs text-neutral-gray mb-4">
          Have questions about our menu or special dietary requirements?
        </p>
        <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm">
          Contact Us
        </button>
      </div>
    </motion.div>
  );
};

export default MenuSidebar;
