import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

const MobileOrderButton = ({ isSidebarOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // Get current route

  // Handle scroll effect
  useEffect(() => {
    // Don't show the button on the /menu page

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isSidebarOpen || !scrolled) {
    return null;
  }

  if (location.pathname === "/menu") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <Link
        to="/menu"
        className="flex items-center justify-center bg-red-600 text-white py-2.5 rounded-lg font-semibold shadow-lg"
        style={{
          boxShadow: "0 4px 15px rgba(217, 43, 43, 0.5)",
        }}
      >
        <FiShoppingBag className="mr-2 animate-bounce" />
        <span className="relative">
          Order Now
          <span className="absolute inset-0 rounded-lg bg-white/20 animate-ping-slow" />
        </span>
      </Link>
    </div>
  );
};

export default MobileOrderButton;
