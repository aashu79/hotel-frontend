import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";

const MobileOrderButton = ({ isSidebarOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isSidebarOpen || !scrolled) {
    return null;
  }

  // Don't show button on these pages
  const hiddenRoutes = ["/menu", "/order-bill", "/checkout", "/cart"];
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  // Determine button action based on cart state
  const hasItems = state.items.length > 0;
  const buttonText = hasItems ? "View Cart" : "Order Now";
  const buttonRoute = hasItems ? "/order-bill" : "/menu";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(buttonRoute);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-center bg-red-600 text-white py-2.5 rounded-lg font-semibold shadow-lg relative"
        style={{
          boxShadow: "0 4px 15px rgba(217, 43, 43, 0.5)",
        }}
      >
        <FiShoppingBag className="mr-2 animate-bounce" />
        <span className="relative">
          {buttonText}
          {hasItems && (
            <span className="absolute -top-2 -right-6 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {state.items.length}
            </span>
          )}
          <span className="absolute inset-0 rounded-lg bg-white/20 animate-ping-slow" />
        </span>
      </button>
    </div>
  );
};

export default MobileOrderButton;
