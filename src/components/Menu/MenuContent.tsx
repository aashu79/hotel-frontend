import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenuContext } from "../../contexts/MenuContext";
import FoodItemCard from "../FoodItemCard/FoodItemCard";
import CategoryNav from "./CategoryNav";

interface MenuContentProps {
  filteredItems: any[];
  quantities: Record<string, number>;
  updateQuantity: (itemId: string, change: number) => void;
  addToCart: (item: any) => void;
  getItemQuantity: (itemId: string) => number;
  isLoading: boolean;
}

const MenuContent: React.FC<MenuContentProps> = ({
  filteredItems,
  quantities,
  updateQuantity,
  addToCart,
  getItemQuantity,
  isLoading,
}) => {
  const { selectedCategory, menuCategories, setSelectedCategory } =
    useMenuContext();

  // Group items by category
  const itemsByCategory =
    filteredItems?.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, any[]>) || {};

  // Get unique categories from filtered items
  const categories = Object.keys(itemsByCategory).sort();

  return (
    <div className="space-y-12">
      {/* Mobile Category Navigation - Horizontal Scrolling */}
      <div className="lg:hidden">
        <CategoryNav
          categories={["All", ...menuCategories]}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-2xl font-display font-bold text-white">
          {selectedCategory === "All" ? "All Items" : selectedCategory}
          <span className="ml-2 text-lg text-neutral-gray">
            ({filteredItems?.length || 0} items)
          </span>
        </h2>

        {/* Sort dropdown could be added here */}
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden bg-black/40 border border-white/5"
            >
              <Skeleton className="h-64 bg-gradient-to-br from-red-900/20 to-red-800/10" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4 bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/5" />
                <Skeleton className="h-4 w-2/3 bg-white/5" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-10 w-24 rounded-full bg-white/10" />
                  <Skeleton className="h-10 w-32 rounded-lg bg-red-900/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {!filteredItems || filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">
                No items found
              </h3>
              <p className="text-neutral-gray mb-6">
                Try adjusting your filters or search criteria
              </p>
              <Button
                onClick={() => setSelectedCategory("All")}
                className="bg-red-600 hover:bg-red-500 text-white font-medium"
              >
                View All Items
              </Button>
            </motion.div>
          ) : (
            <>
              {selectedCategory === "All" ? (
                // Show items grouped by category
                <>
                  {categories.map((category) => (
                    <div key={category} className="mb-16">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="mb-6"
                      >
                        <h2 className="text-2xl font-display font-bold text-white border-b border-red-800/30 pb-3">
                          {category}
                          <span className="ml-2 text-lg text-neutral-gray">
                            ({itemsByCategory[category].length})
                          </span>
                        </h2>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {itemsByCategory[category].map((item) => (
                          <FoodItemCard
                            key={item.id}
                            item={item}
                            quantity={getItemQuantity(item.id)}
                            onQuantityChange={updateQuantity}
                            onAddToCart={addToCart}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                // Show items of selected category without grouping
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <FoodItemCard
                      key={item.id}
                      item={item}
                      quantity={getItemQuantity(item.id)}
                      onQuantityChange={updateQuantity}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MenuContent;
