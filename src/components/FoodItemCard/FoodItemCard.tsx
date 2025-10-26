import React, { useState } from "react";
import { FiStar } from "react-icons/fi";
import { Plus, Minus, ShoppingCart, Utensils, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "antd";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onClick={showModal}
        className="group relative bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-600/20 w-full min-w-[300px] max-w-[450px] sm:max-w-[500px] lg:max-w-[550px] xl:max-w-[600px] mx-auto flex flex-col cursor-pointer"
      >
        {/* Dish Image */}
        <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden flex-shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              crossOrigin="anonymous"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-800/20 to-amber-700/20 flex items-center justify-center">
              <Utensils className="w-16 h-16 text-white/60 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
            {item.vegetarian && (
              <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-lg">
                🌱 Veg
              </span>
            )}

            {item.popular && (
              <div className="flex items-center bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/20 shadow-lg ml-auto">
                <FiStar className="text-amber-400 fill-amber-400 w-3.5 h-3.5 mr-1" />
                <span className="text-amber-400 text-xs">Popular</span>
              </div>
            )}
          </div>

          {/* Item Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex justify-between items-end gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-amber-400/90 text-xs uppercase tracking-wider block mb-1">
                  {item.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-white line-clamp-1">
                  {item.name}
                </h3>
              </div>
              <div className="flex-shrink-0 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                <span className="text-white font-semibold text-lg whitespace-nowrap">
                  ${item.price}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 sm:p-5 relative z-10 flex flex-col flex-grow">
          {/* Fixed Height Description */}
          <div
            className="text-gray-300 text-sm leading-relaxed mb-4 h-10 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: item.description }}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          />

          {/* Quantity Controls & Add to Cart */}
          <div className="flex items-center gap-3 mt-auto">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-2 backdrop-blur-sm border border-white/10">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange(item.id, -1);
                }}
                disabled={quantity === 0}
                className="w-7 h-7 rounded-md bg-white/10 border-0 hover:bg-red-600/30 text-white p-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="min-w-[1.5rem] text-center text-amber-400 text-sm font-medium">
                {quantity}
              </span>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange(item.id, 1);
                }}
                className="w-7 h-7 rounded-md bg-white/10 border-0 hover:bg-red-600/30 text-white p-0 transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              className="flex-1 relative overflow-hidden bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </span>
            </Button>
          </div>
        </div>

        {/* Subtle Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-amber-600/5 to-red-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </motion.div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        width={700}
        centered
        closeIcon={<X className="w-5 h-5 text-white" />}
        className="food-item-modal"
        styles={{
          content: {
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            padding: 0,
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          header: {
            background: "transparent",
            borderBottom: "none",
          },
          body: {
            padding: 0,
          },
        }}
      >
        <div className="relative">
          {/* Modal Image */}
          <div className="relative h-80 overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-800/20 to-amber-700/20 flex items-center justify-center">
                <Utensils className="w-24 h-24 text-white/60" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              {item.vegetarian && (
                <span className="bg-green-500 text-white text-sm px-3 py-1.5 rounded-full font-medium shadow-lg">
                  🌱 Vegetarian
                </span>
              )}
              {item.popular && (
                <div className="flex items-center bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/30 shadow-lg">
                  <FiStar className="text-amber-400 fill-amber-400 w-4 h-4 mr-1.5" />
                  <span className="text-amber-400 text-sm">Popular Choice</span>
                </div>
              )}
            </div>

            {/* Title & Price */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-amber-400 text-sm uppercase tracking-wider block mb-2">
                {item.category}
              </span>
              <div className="flex justify-between items-end gap-4">
                <h2 className="text-3xl font-semibold text-white">
                  {item.name}
                </h2>
                <div className="bg-red-600 px-4 py-2 rounded-lg shadow-lg">
                  <span className="text-white font-semibold text-2xl">
                    ${item.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 bg-gradient-to-b from-black/40 to-black/60">
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-white text-lg font-medium mb-3">
                Description
              </h3>
              <div
                className="text-gray-300 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              {/* Quantity Controls */}
              <div className="flex items-center space-x-3 bg-white/5 rounded-lg px-4 py-2.5 backdrop-blur-sm border border-white/10">
                <Button
                  size="sm"
                  onClick={() => onQuantityChange(item.id, -1)}
                  disabled={quantity === 0}
                  className="w-8 h-8 rounded-md bg-white/10 border-0 hover:bg-red-600/30 text-white p-0 transition-all duration-200 disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="min-w-[2rem] text-center text-amber-400 text-lg font-medium">
                  {quantity}
                </span>
                <Button
                  size="sm"
                  onClick={() => onQuantityChange(item.id, 1)}
                  className="w-8 h-8 rounded-md bg-white/10 border-0 hover:bg-red-600/30 text-white p-0 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={() => {
                  onAddToCart(item);
                  handleClose();
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .food-item-modal .ant-modal-content {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }
        .food-item-modal .ant-modal-close {
          color: white;
        }
        .food-item-modal .ant-modal-close:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  );
};

export default FoodItemCard;
