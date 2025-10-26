import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Carousel } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import FoodItemCard from "../FoodItemCard/FoodItemCard";
import { useMenuItems } from "../../hooks/useMenuItems";
import { useMenuCategories } from "../../hooks/useMenuCategories";
import { useCart } from "../../contexts/CartContext";
import useAuthStore from "../../store/authStore";
import { message } from "antd";
import { Skeleton } from "../ui/skeleton";

const MenuHighlightsSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { dispatch } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [allMenuItems, setAllMenuItems] = useState<typeof menuItems>([]);
  const [menuCategories, setMenuCategories] = useState<
    { id: number; name: string }[]
  >([]);
  const carouselRef = useRef<CarouselRef>(null);

  // Fetch popular menu items and categories from API
  const { data: menu = [], isLoading: itemsLoading } = useMenuItems({
    isAvailable: true,
  });
  const { data: categories = [], isLoading: categoriesLoading } =
    useMenuCategories();

  useEffect(() => {
    setAllMenuItems(menu?.data || []);
  }, [itemsLoading, menu]);

  useEffect(() => {
    setMenuCategories(categories?.data || []);
  }, [categoriesLoading, categories]);

  const isLoading = itemsLoading || categoriesLoading;

  // Filter for popular items
  const menuItems = allMenuItems;

  const getItemQuantity = (itemId: string) => quantities[itemId] || 1;

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }));
  };

  const handleAddToCart = (item: (typeof menuItems)[0]) => {
    // Check if user is logged in
    if (!user) {
      message.error({
        content: "Please login to add items to cart",
        style: { marginTop: "80px" },
      });
      navigate("/signin");
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
      style: { marginTop: "80px" },
    });

    // Reset quantity after adding
    setQuantities((prev) => ({ ...prev, [item.id.toString()]: 1 }));
  };

  // Navigation handlers
  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: menuItems.length > 4,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    swipeToSlide: true,
    arrows: false, // Disable default arrows, use custom buttons
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-deep-black to-black/90">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-light-gold font-display tracking-wider text-sm sm:text-base">
              SIGNATURE DISHES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-2 mb-4 sm:mb-6">
              Menu Highlights
            </h2>
            <p className="text-neutral-gray text-base sm:text-lg max-w-2xl mx-auto">
              Experience our chef's carefully crafted specialties, blending
              authentic Himalayan flavors with modern culinary techniques
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (menuItems.length === 0) {
    return (
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-deep-black to-black/90">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-light-gold font-display tracking-wider text-sm sm:text-base">
              SIGNATURE DISHES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-2 mb-4 sm:mb-6">
              Menu Highlights
            </h2>
            <p className="text-neutral-gray text-base sm:text-lg max-w-2xl mx-auto">
              Check back soon for our popular dishes!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-deep-black to-black/90 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-light-gold font-display tracking-wider text-sm sm:text-base uppercase">
            Signature Dishes
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mt-3 mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Our Special Menu
          </h2>
          <p className="text-lg sm:text-xl text-red-400 mb-3 font-medium">
            Authentic Nepali & Fusion Flavors
          </p>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            From traditional Dal-Bhat to handcrafted Momos, steaming Biryani to
            authentic Dhido - every dish is prepared with authentic spices and
            traditional methods
          </p>
        </div>

        {/* Carousel with Navigation Buttons */}
        <div className="relative">
          {/* Left Navigation Button */}
          <button
            onClick={handlePrev}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Navigation Button */}
          <button
            onClick={handleNext}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel */}
          <div className="px-2 sm:px-4">
            <Carousel
              ref={carouselRef}
              {...carouselSettings}
              className="menu-carousel"
            >
              {menuItems?.map((item) => (
                <div key={item.id} className="px-3 py-4">
                  <FoodItemCard
                    item={{
                      ...item,
                      id: item.id.toString(),
                      category:
                        menuCategories?.find(
                          (cat) => cat.id === item.categoryId
                        )?.name || "Uncategorized",
                      image: item.imageUrl,
                      vegetarian: item.isVegetarian,
                      popular: item.isPopular,
                    }}
                    onAddToCart={() => handleAddToCart(item)}
                    onQuantityChange={(id, delta) => updateQuantity(id, delta)}
                    quantity={getItemQuantity(item.id.toString())}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {/* Mobile Navigation Buttons (Below carousel) */}
        <div className="flex lg:hidden items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* View Complete Menu Button */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            to="/menu"
            className="group inline-flex items-center justify-center bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:shadow-red-600/20 transform hover:scale-105"
          >
            View Complete Menu
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Custom Carousel Styles */}
      <style jsx global>{`
        .menu-carousel .slick-slide {
          padding: 0 8px;
        }

        .menu-carousel .slick-list {
          margin: 0 -8px;
          padding: 20px 0;
        }

        .menu-carousel .slick-dots {
          bottom: -40px;
        }

        .menu-carousel .slick-dots li {
          width: 12px;
          height: 12px;
          margin: 0 6px;
        }

        .menu-carousel .slick-dots li button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .menu-carousel .slick-dots li button:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: scale(1.2);
        }

        .menu-carousel .slick-dots li button:before {
          display: none;
        }

        .menu-carousel .slick-dots li.slick-active button {
          background: #fbbf24;
          width: 32px;
          border-radius: 6px;
        }

        .menu-carousel .slick-track {
          display: flex;
          align-items: stretch;
        }

        .menu-carousel .slick-slide > div {
          height: 100%;
        }

        @media (max-width: 1024px) {
          .menu-carousel .slick-dots {
            bottom: -50px;
          }
        }
      `}</style>
    </section>
  );
};

export default MenuHighlightsSection;
