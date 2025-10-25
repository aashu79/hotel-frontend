import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiPhone,
  FiClock,
  FiMapPin,
  FiChevronDown,
  FiUser,
  FiShoppingCart,
} from "react-icons/fi";
import AuthButtons from "../Auth/AuthButtons";
import useAuthStore from "../../store/authStore";
import { useCart } from "../../contexts/CartContext";

const Navbar = ({
  onMenuToggle,
}: {
  onMenuToggle: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { state: cartState } = useCart();

  const cartItemCount = cartState.items.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    onMenuToggle(false);
  }, [location, onMenuToggle]);

  // Check if route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Main navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/90 backdrop-blur-md shadow-xl shadow-black/20 py-3"
            : "bg-gradient-to-b from-black/70 to-transparent py-5"
        } ${isMenuOpen ? "lg:bg-transparent" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              className="text-white hover:text-red-400 transition-colors duration-200 focus:outline-none"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                onMenuToggle(!isMenuOpen);
              }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="w-7 h-7" />
              ) : (
                <FiMenu className="w-7 h-7" />
              )}
            </button>
          </div>

          {/* Left side navigation links - Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" isActive={isActive("/")} label="Home" />
            <NavLink to="/menu" isActive={isActive("/menu")} label="Menu" />

            {/* About dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() =>
                  setShowDropdown(showDropdown === "about" ? null : "about")
                }
                className={`flex items-center px-4 py-2 text-white hover:text-red-400 transition-colors rounded-md ${
                  isActive("/about") || isActive("/story") || isActive("/team")
                    ? "text-red-400"
                    : ""
                }`}
              >
                <span>About</span>
                <FiChevronDown
                  className={`ml-1 w-4 h-4 transition-transform ${
                    showDropdown === "about" ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showDropdown === "about" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-md shadow-xl overflow-hidden"
                  >
                    <Link
                      to="/about"
                      className="block px-4 py-3 text-white hover:bg-red-600 transition-colors"
                    >
                      Our Story
                    </Link>
                    <Link
                      to="/team"
                      className="block px-4 py-3 text-white hover:bg-red-600 transition-colors"
                    >
                      Our Team
                    </Link>
                    <Link
                      to="/gallery"
                      className="block px-4 py-3 text-white hover:bg-red-600 transition-colors"
                    >
                      Gallery
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink
              to="/specials"
              isActive={isActive("/specials")}
              label="Specials"
            />

            {/* Phone info integrated into navbar */}
            <div className="flex items-center ml-4 pl-4 border-l border-white/20">
              <FiPhone className="mr-2 text-red-400" />
              <a
                href="tel:+16822524066"
                className="text-white text-sm hover:text-red-400 transition-colors"
              >
                (682) 252-4066
              </a>
            </div>
          </div>

          {/* Logo - Centered */}
          <Link to="/" className="flex-shrink-0">
            <div className="text-center">
              <h1
                className={`font-display font-bold tracking-wide transition-all duration-300 ${
                  scrolled ? "text-2xl" : "text-3xl"
                } bg-gradient-to-r from-red-400 via-red-500 to-amber-400 bg-clip-text text-transparent`}
              >
                1 STOP DHIDO
                <span className="block text-white text-sm font-normal tracking-widest">
                  RESTAURANT
                </span>
              </h1>
            </div>
          </Link>

          {/* Right side navigation links - Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavLink
              to="/contact"
              isActive={isActive("/contact")}
              label="Contact"
            />

            {/* Auth Buttons */}
            <AuthButtons />

            {/* Cart Button (if user is authenticated) */}
            {isAuthenticated ? (
              <Link
                to="/order-bill"
                className="relative bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium ml-4 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-700/30 flex items-center gap-2"
              >
                <FiShoppingCart className="w-5 h-5" />
                View Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to="/menu"
                className="bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium ml-4 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-700/30"
              >
                Order Now
              </Link>
            )}
          </div>

          {/* Mobile cart/order button */}
          <div className="lg:hidden">
            {isAuthenticated ? (
              <Link
                to="/order-bill"
                className="relative bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-300 flex items-center gap-2"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to="/menu"
                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-300"
              >
                Order
              </Link>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu slide-in panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-lg pt-20 w-3/4 max-w-sm"
          >
            <div className="flex flex-col h-full">
              <div className="overflow-y-auto flex-grow px-8 py-6">
                {/* Menu Links */}
                <ul className="space-y-6">
                  <MobileNavLink
                    to="/"
                    label="Home"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink
                    to="/menu"
                    label="Menu"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink
                    to="/contact"
                    label="Contact"
                    onClick={() => setIsMenuOpen(false)}
                  />

                  {/* Conditional Auth Links */}
                  {isAuthenticated ? (
                    <>
                      <MobileNavLink
                        to="/order-bill"
                        label="My Cart"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <MobileNavLink
                        to="/my-orders"
                        label="My Orders"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <MobileNavLink
                        to="/profile"
                        label="My Profile"
                        onClick={() => setIsMenuOpen(false)}
                      />
                    </>
                  ) : (
                    <>
                      <MobileNavLink
                        to="/signin"
                        label="Sign In"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <MobileNavLink
                        to="/signup"
                        label="Sign Up"
                        onClick={() => setIsMenuOpen(false)}
                      />
                    </>
                  )}
                </ul>

                {/* Divider */}
                <div className="border-t border-white/10 my-8"></div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center text-neutral-gray">
                    <FiPhone className="mr-3 text-red-400" />
                    <a href="tel:+16822524066">(682) 252-4066</a>
                  </div>
                  <div className="flex items-center text-neutral-gray">
                    <FiClock className="mr-3 text-red-400" />
                    <span>11:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex items-center text-neutral-gray">
                    <FiMapPin className="mr-3 text-red-400" />
                    <span>Arlington, TX</span>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-4 mt-8">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="p-6 border-t border-white/10 mt-auto">
                <Link
                  to="/menu"
                  className="block w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-md font-semibold text-center transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Order Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu backdrop - for clicking outside to close */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

// Desktop Nav Link Component
const NavLink = ({
  to,
  label,
  isActive,
}: {
  to: string;
  label: string;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`relative px-4 py-2 font-medium transition-colors hover:text-red-400 ${
      isActive ? "text-red-400" : "text-white"
    }`}
  >
    <span>{label}</span>
    {isActive && (
      <motion.span
        layoutId="navbar-active-indicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"
      />
    )}
  </Link>
);

// Mobile Nav Link Component
const MobileNavLink = ({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick: () => void;
}) => (
  <li>
    <Link
      to={to}
      className="text-xl font-display text-white hover:text-red-400 transition-colors flex items-center"
      onClick={onClick}
    >
      {label}
      <motion.span
        initial={{ x: -8, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="ml-2 opacity-0 group-hover:opacity-100"
      >
        →
      </motion.span>
    </Link>
  </li>
);

export default Navbar;
