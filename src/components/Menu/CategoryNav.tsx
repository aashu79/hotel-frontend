import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      if (direction === "left") {
        scrollContainerRef.current.scrollLeft -= scrollAmount;
      } else {
        scrollContainerRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div className="relative mb-6">
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
        <button
          onClick={() => scroll("left")}
          className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white shadow-lg hover:bg-red-600 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <motion.div
        ref={scrollContainerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex overflow-x-auto py-2 px-8 scrollbar-hide snap-x"
      >
        <div className="flex gap-3 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-red-600 text-white font-medium shadow-lg"
                  : "bg-black/40 backdrop-blur-sm text-neutral-gray hover:bg-black/60 border border-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center">
        <button
          onClick={() => scroll("right")}
          className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white shadow-lg hover:bg-red-600 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Fade edges */}
      <div className="absolute left-8 top-0 bottom-0 w-12 bg-gradient-to-r from-deep-black to-transparent pointer-events-none"></div>
      <div className="absolute right-8 top-0 bottom-0 w-12 bg-gradient-to-l from-deep-black to-transparent pointer-events-none"></div>
    </div>
  );
};

export default CategoryNav;
