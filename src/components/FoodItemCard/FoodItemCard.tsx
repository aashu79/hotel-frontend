import React from "react";
import { FiStar } from "react-icons/fi";
import { Plus, Minus, ShoppingCart, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  vegetarian?: boolean;
  popular?: boolean;
};

type FoodItemCardProps = {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onQuantityChange: (id: string, delta: number) => void;
  quantity: number;
};

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  onAddToCart,
  onQuantityChange,
  quantity,
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="group relative bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 shadow-xl transition-all duration-300 hover:scale-107 hover:shadow-2xl hover:shadow-red-600/10 w-[320px] h-[500px] sm:w-[320px] sm:h-[520px]"
    >
      {/* Dish Image */}
      <div className="relative h-72 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-800/20 to-amber-700/20 flex items-center justify-center">
            <Utensils className="w-10 h-10 text-white/60" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80"></div>

        {item.vegetarian && (
          <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            Vegetarian
          </span>
        )}

        {item.popular && (
          <div className="absolute top-4 right-4 flex items-center bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
            <FiStar className="text-amber-400 fill-amber-400 w-4 h-4 mr-1" />
            <span className="text-amber-400 text-xs font-medium">Popular</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-light-gold text-sm font-medium">
                {item.category}
              </span>
              <h3 className="text-xl font-bold text-white">{item.name}</h3>
            </div>
            <span className="text-white font-bold">${item.price}</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 relative z-10">
        <p className="text-neutral-gray mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3 bg-white/5 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
            <Button
              size="sm"
              onClick={() => onQuantityChange(item.id, -1)}
              className="w-8 h-8 rounded-full bg-white/10 border-0 hover:bg-red-600/30 hover:scale-110 text-white p-0 transition-all duration-300"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-bold min-w-[2rem] text-center text-light-gold">
              {quantity}
            </span>
            <Button
              size="sm"
              onClick={() => onQuantityChange(item.id, 1)}
              className="w-8 h-8 rounded-full bg-white/10 border-0 hover:bg-red-600/30 hover:scale-110 text-white p-0 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={() => onAddToCart(item)}
          className="w-full relative overflow-hidden bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-2xl hover:shadow-red-600/25 transform hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <span className="relative z-10 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 mr-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            Add to Cart
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </Button>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-amber-600/10 to-red-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </motion.div>
  );
};

export default FoodItemCard;
