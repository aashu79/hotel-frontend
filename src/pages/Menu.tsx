import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { menuItems, menuCategories } from "@/data/menu";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronUp, FiSearch } from "react-icons/fi";
import { MenuProvider } from "../contexts/MenuContext";
import OrderTypeSelector from "../components/Menu/OrderTypeSelector";
import MenuSidebar from "../components/Menu/MenuSidebar";
import MobileFilters from "../components/Menu/MobileFilter";
import MenuContent from "../components/Menu/MenuContent";

export const Menu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    vegetarian: boolean;
    spicy: boolean;
    popular: boolean;
  }>({
    vegetarian: false,
    spicy: false,
    popular: false,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { dispatch } = useCart();
  const { toast } = useToast();

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getItemQuantity = (itemId: string) => quantities[itemId] || 1;

  const updateQuantity = (itemId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change),
    }));
  };

  const addToCart = (item: any) => {
    const quantity = getItemQuantity(item.id);
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_ITEM", payload: item });
    }

    toast({
      title: "Added to Cart!",
      description: `${quantity}x ${item.name} added to your cart`,
      className: "glass-medium border-red-400/50",
    });

    // Reset quantity after adding
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVegetarian = activeFilters.vegetarian
      ? item.vegetarian === true
      : true;
    const matchesPopular = activeFilters.popular ? item.popular === true : true;
    const matchesSpicy = activeFilters.spicy ? item.spicy === true : true;

    return (
      matchesCategory &&
      matchesSearch &&
      matchesVegetarian &&
      matchesPopular &&
      matchesSpicy
    );
  });

  // Add menuCategories to the context value
  const menuContextValue = {
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    orderType,
    setOrderType,
    activeFilters,
    setActiveFilters,
    filteredItems,
    isLoading,
    menuCategories,
  };

  return (
    <MenuProvider value={menuContextValue}>
      <div className="min-h-screen bg-deep-black pt-16 pb-24">
        {/* Simplified Header with Search */}
        <div className="bg-gradient-to-b from-black to-transparent">
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Title - simple and elegant */}
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-white font-display"
              >
                Our Menu
              </motion.h1>

              {/* Search Input - Modern and minimal */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative w-full md:max-w-xs"
              >
                <input
                  type="text"
                  placeholder="Search our menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-800/60 border border-zinc-700/50 rounded-xl py-3 px-4 pl-10 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                />
                <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Order Type Selector - Simplified */}
        <div className="border-y border-zinc-800 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto">
            <OrderTypeSelector />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6 md:mt-8">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Sidebar Filters - Hidden on mobile */}
            <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
              <MenuSidebar />
            </div>

            {/* Menu Content */}
            <div className="lg:w-3/4 xl:w-4/5">
              <div className="lg:hidden mb-6">
                {selectedCategory !== "All" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-800/60 rounded-lg px-4 py-3 text-white flex items-center justify-between"
                  >
                    <span className="font-medium">
                      Category: {selectedCategory}
                    </span>
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="text-zinc-400 hover:text-white p-1"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}
              </div>
              <MenuContent
                filteredItems={filteredItems}
                quantities={quantities}
                updateQuantity={updateQuantity}
                addToCart={addToCart}
                getItemQuantity={getItemQuantity}
                isLoading={isLoading}
              />

              {/* Empty State - Shown when no items match filters */}
              {!isLoading && filteredItems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 px-4"
                >
                  <div className="inline-block p-3 rounded-full bg-zinc-800/60 mb-4">
                    <FiSearch size={32} className="text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">
                    No items found
                  </h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    We couldn't find any items that match your search or
                    filters. Try adjusting your search or clearing some filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setActiveFilters({
                        vegetarian: false,
                        spicy: false,
                        popular: false,
                      });
                    }}
                    className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="fixed right-6 bottom-20 z-40 p-3 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-500 transition-all duration-300 hover:scale-110"
              aria-label="Scroll to top"
            >
              <FiChevronUp size={22} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mobile Filter Button */}
        <MobileFilters
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
        />
      </div>
    </MenuProvider>
  );
};

export default Menu;
