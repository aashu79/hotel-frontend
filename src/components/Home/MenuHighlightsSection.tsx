import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, useMotionValue, PanInfo } from "framer-motion";
import FoodItemCard from "../FoodItemCard/FoodItemCard";

// Optional: Define item type
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  vegetarian?: boolean;
  popular?: boolean;
};

interface MenuHighlightsSectionProps {
  menuItems: MenuItem[];
  // Optional: for cart functionality
  onAddToCart?: (item: MenuItem) => void;
  onQuantityChange?: (id: string, delta: number) => void;
  getItemQuantity?: (id: string) => number;
}

const MenuHighlightsSection: React.FC<MenuHighlightsSectionProps> = ({
  menuItems,
  onAddToCart,
  onQuantityChange,
  getItemQuantity,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxIndex = Math.max(0, menuItems.length - visibleItems);
  const x = useMotionValue(0);

  // Update visible items and carousel width based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let itemsToShow = 1;

      if (width < 640) {
        itemsToShow = 1;
      } else if (width < 1024) {
        itemsToShow = 2;
      } else if (width < 1280) {
        itemsToShow = 3;
      } else {
        itemsToShow = 4; // Show 4 items on larger screens
      }

      setVisibleItems(itemsToShow);

      // Ensure current index is valid after resize
      setCurrentIndex((prev) =>
        Math.min(prev, Math.max(0, menuItems.length - itemsToShow))
      );

      // Update carousel width
      if (carouselRef.current && containerRef.current) {
        setCarouselWidth(carouselRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuItems.length]);

  // Update x position when current index changes
  useEffect(() => {
    const itemWidth = carouselWidth / visibleItems;
    const newPosition = -currentIndex * itemWidth;
    x.set(newPosition);
  }, [currentIndex, carouselWidth, visibleItems, x]);

  // Navigation functions
  const nextSlide = () => {
    if (!isDragging) {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    }
  };

  const prevSlide = () => {
    if (!isDragging) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const goToSlide = (index: number) => {
    if (!isDragging) {
      setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
    }
  };

  // Handle drag gestures
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    const itemWidth = carouselWidth / visibleItems;
    const threshold = itemWidth * 0.2; // 20% of item width

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentIndex > 0) {
        prevSlide();
      } else if (info.offset.x < 0 && currentIndex < maxIndex) {
        nextSlide();
      } else {
        // Snap back to current position
        const newPosition = -currentIndex * itemWidth;
        x.set(newPosition);
      }
    } else {
      // If dragged less than threshold, snap back
      const newPosition = -currentIndex * itemWidth;
      x.set(newPosition);
    }
  };

  // Auto-advance the carousel (disabled during drag)
  useEffect(() => {
    if (isDragging) return;

    const timer = setTimeout(() => {
      if (currentIndex < maxIndex) {
        nextSlide();
      } else {
        setCurrentIndex(0);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentIndex, maxIndex, isDragging]);

  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-deep-black to-black/90">
      <div ref={containerRef} className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-light-gold font-display tracking-wider">
            SIGNATURE DISHES
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4 sm:mb-6">
            Menu Highlights
          </h2>
          <p className="text-neutral-gray text-base sm:text-lg max-w-2xl mx-auto">
            Experience our chef's carefully crafted specialties, blending
            authentic Himalayan flavors with modern culinary techniques
          </p>
        </div>

        <div className="relative">
          {/* Mobile View - Single Card Display */}
          <div className="block md:hidden relative">
            <motion.div
              className="relative overflow-hidden"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="w-full"
                  initial={{ opacity: 1, x: 0 }}
                  animate={{
                    opacity: index === currentIndex ? 1 : 0,
                    x: index === currentIndex ? 0 : 100,
                    position: index === currentIndex ? "relative" : "absolute",
                    zIndex: index === currentIndex ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {index === currentIndex && (
                    <div className="px-4 sm:px-8">
                      <FoodItemCard
                        item={item}
                        onAddToCart={onAddToCart}
                        onQuantityChange={onQuantityChange}
                        quantity={
                          getItemQuantity ? getItemQuantity(item.id) : 1
                        }
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Desktop View - Carousel */}
          <div
            ref={carouselRef}
            className="hidden md:block relative overflow-hidden"
          >
            <motion.div
              className="flex"
              style={{ x }}
              drag="x"
              dragConstraints={{
                left: -carouselWidth * (maxIndex / visibleItems),
                right: 0,
              }}
              dragElastic={0.1}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {menuItems.map((item, index) => {
                const cardWidth = `${100 / visibleItems}%`;

                return (
                  <motion.div
                    key={item.id}
                    style={{
                      width: cardWidth,
                      paddingRight: "1rem",
                    }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <FoodItemCard
                      item={item}
                      onAddToCart={onAddToCart}
                      onQuantityChange={onQuantityChange}
                      quantity={getItemQuantity ? getItemQuantity(item.id) : 1}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Navigation Controls - Both Mobile & Desktop */}
          <div className="flex flex-col items-center mt-8 gap-4">
            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`transition-all duration-300 w-2.5 h-2.5 rounded-full ${
                    i === currentIndex
                      ? "bg-light-gold"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Next/prev buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`p-3 rounded-full ${
                  currentIndex === 0
                    ? "text-neutral-gray bg-white/5"
                    : "text-white bg-red-700 hover:bg-red-600"
                } transition-all duration-300`}
                aria-label="Previous slide"
              >
                <FiChevronLeft size={24} />
              </button>

              <button
                onClick={nextSlide}
                disabled={currentIndex === maxIndex}
                className={`p-3 rounded-full ${
                  currentIndex === maxIndex
                    ? "text-neutral-gray bg-white/5"
                    : "text-white bg-red-700 hover:bg-red-600"
                } transition-all duration-300`}
                aria-label="Next slide"
              >
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <Link
            to="/menu"
            className="group inline-flex items-center justify-center bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md transition-all duration-300 font-semibold"
          >
            View Complete Menu
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuHighlightsSection;
