import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useMenuCategories } from "@/hooks/useMenuCategories";
import { useLocations } from "@/hooks/useLocations";
import { useDeliveryServices } from "@/hooks/useDeliveryServices";
import useAuthStore from "@/store/authStore";
import { message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronUp, FiSearch, FiMapPin } from "react-icons/fi";
import OrderTypeSelector from "../components/Menu/OrderTypeSelector";
import MenuSidebar from "../components/Menu/MenuSidebar";
import MobileFilters from "../components/Menu/MobileFilter";
import DeliveryServicesModal from "../components/Menu/DeliveryServicesModal";
import LocationSelectionModal from "../components/Menu/LocationSelectionModal";
import { Skeleton } from "@/components/ui/skeleton";
import { ref } from "process";
import MenuContent from "../components/Menu/MenuContent";
import { MenuProvider } from "../contexts/MenuContext";

export const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuCategories, setMenuCategories] = useState<
    { id: number; name: string }[]
  >([]);
  const [menuItems, setMenuItems] = useState<typeof menuItems>([]);
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
  const { dispatch, selectedLocationId, setSelectedLocationId } = useCart();

  // New state for modals
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Fetch real data from API
  const { data: mI = [], isLoading: itemsLoading } = useMenuItems({
    isAvailable: true,
  });
  const { data: mC = [], isLoading: categoriesLoading } = useMenuCategories();

  // Fetch locations and delivery services
  const { data: locationsData, isLoading: locationsLoading } =
    useLocations(true);
  const {
    data: deliveryServicesData,
    isLoading: deliveryServicesLoading,
    refetch: refetchDeliveryServices,
  } = useDeliveryServices(selectedLocationId || undefined, true);

  useEffect(() => {
    setMenuCategories(mC?.data);
  }, [categoriesLoading, mC]);

  useEffect(() => {
    if (showDeliveryModal) {
      refetchDeliveryServices();
    }
  }, [showDeliveryModal]);

  useEffect(() => {
    setMenuItems(mI?.data);
  }, [itemsLoading, mI]);

  // Handle order type change
  useEffect(() => {
    if (orderType === "delivery") {
      // Show delivery services modal when delivery is selected
      setShowDeliveryModal(true);
    }
    // Remove the auto-popup for pickup location selection
    // Users can now select from the dropdown in OrderTypeSelector
  }, [orderType]);

  const isLoading = itemsLoading || categoriesLoading;

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const addToCart = (item: (typeof menuItems)[0]) => {
    // Check if user is logged in
    if (!user) {
      message.error({
        content: "Please login to add items to cart",
        style: {
          marginTop: "80px",
        },
      });
      navigate("/signin");
      return;
    }

    // Check if location is selected for pickup
    if (orderType === "pickup" && !selectedLocationId) {
      message.warning({
        content: "Please select a pickup location from the dropdown",
        style: {
          marginTop: "80px",
        },
      });
      return;
    }

    const quantity = getItemQuantity(item.id.toString());

    // Convert API item to cart item format
    const cartItem = {
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.categoryId?.toString() || "Uncategorized",
      image: item.imageUrl,
      vegetarian: item.isVegetarian,
    };

    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_ITEM", payload: cartItem });
    }

    message.success({
      content: `${quantity}x ${item.name} added to your cart`,
      style: {
        marginTop: "80px",
      },
    });

    // Reset quantity after adding
    setQuantities((prev) => ({ ...prev, [item.id.toString()]: 1 }));
  };

  // Transform and filter items
  const filteredItems = menuItems
    ?.filter((item) => {
      // Filter by category
      const matchesCategory =
        selectedCategory === "All" ||
        item.categoryId?.toString() === selectedCategory ||
        menuCategories?.find((cat) => cat.id === item.categoryId)?.name ===
          selectedCategory;

      // Filter by search term
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by active filters
      const matchesVegetarian = activeFilters.vegetarian
        ? item.isVegetarian === true
        : true;
      const matchesPopular = activeFilters.popular
        ? item.isPopular === true
        : true;
      const matchesSpicy = activeFilters.spicy ? item.isSpicy === true : true;

      // Only show available items
      const isAvailable = item.isAvailable !== false;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesVegetarian &&
        matchesPopular &&
        matchesSpicy &&
        isAvailable
      );
    })
    .map((item) => ({
      // Transform API item to FoodItemCard format
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      category:
        menuCategories?.find((cat) => cat.id === item.categoryId)?.name ||
        "Uncategorized",
      image: item.imageUrl,
      vegetarian: item.isVegetarian,
      popular: item.isPopular,
      spicy: item.isSpicy,
    }));

  // Add menuCategories to the context value
  // Transform menuCategories from objects to just names for the sidebar
  const categoryNames = menuCategories?.map((cat) => cat.name) || [];

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
    menuCategories: categoryNames,
  };

  const locations = locationsData?.locations || [];
  const deliveryServices = deliveryServicesData?.deliveryServices || [];
  const selectedLocation = locations.find(
    (loc: any) => loc.id === selectedLocationId
  );

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
    message.success({
      content: "Pickup location selected",
      style: {
        marginTop: "80px",
      },
    });
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6 md:mt-8 pb-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar Filters - Hidden on mobile, sticky on desktop */}
            <aside className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
              <MenuSidebar />
            </aside>

            {/* Menu Content - Full width on mobile, flexible on desktop */}
            <main className="flex-1 min-w-0">
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
                filteredItems={filteredItems || []}
                quantities={quantities}
                updateQuantity={updateQuantity}
                addToCart={addToCart}
                getItemQuantity={getItemQuantity}
                isLoading={isLoading}
              />

              {/* Empty State - Shown when no items match filters */}
              {!isLoading && filteredItems?.length === 0 && (
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
            </main>
          </div>
        </div>

        {/* Location Info Banner - Show when location is selected for pickup */}
        {orderType === "pickup" && selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-600/10 to-green-500/10 border-y border-green-500/20"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-400">
                <FiMapPin size={18} />
                <span className="text-sm font-medium">
                  Pickup Location: {selectedLocation.name} -{" "}
                  {selectedLocation.address}
                </span>
              </div>
              <button
                onClick={() => setShowLocationModal(true)}
                className="text-sm text-green-400 hover:text-green-300 underline"
              >
                Change
              </button>
            </div>
          </motion.div>
        )}

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

        {/* Delivery Services Modal */}
        <DeliveryServicesModal
          isOpen={showDeliveryModal}
          onClose={() => {
            setShowDeliveryModal(false);
            // Reset to pickup if user closes without selecting delivery service
            if (orderType === "delivery") {
              setOrderType("pickup");
            }
          }}
          deliveryServices={deliveryServices}
          isLoading={deliveryServicesLoading}
        />

        {/* Location Selection Modal */}
        <LocationSelectionModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          locations={locations}
          selectedLocationId={selectedLocationId}
          onSelectLocation={handleLocationSelect}
          isLoading={locationsLoading}
        />
      </div>
    </MenuProvider>
  );
};

export default Menu;
