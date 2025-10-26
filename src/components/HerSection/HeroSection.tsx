import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import restImage from "../../assets/images/rest.jpg";
import { FiArrowRight, FiStar, FiMapPin } from "react-icons/fi";

// Typing animation component
const TypedText = ({
  text,
  delay = 0,
  speed = 50,
}: {
  text: string;
  delay?: number;
  speed?: number;
}) => {
  const controls = useAnimationControls();
  const [displayedText, setDisplayedText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startTyping = async () => {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      let i = 0;
      intervalRef.current = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i === text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, speed);
    };

    startTyping();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay, speed]);

  return (
    <span>
      {displayedText}
      <span className="animate-pulse text-amber-400">|</span>
    </span>
  );
};

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const food = [
    {
      name: "Momos",
      color: "from-red-500 to-rose-600",
      icon: "🥟",
    },
    {
      name: "Sekuwa",
      color: "from-amber-500 to-orange-600",
      icon: "🍖",
    },
    {
      name: "Dal Bhat",
      color: "from-red-600 to-rose-700",
      icon: "🍛",
    },
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden pt-24 sm:pt-28 md:pt-32 lg:pt-20"
      style={{ backgroundImage: `url(${restImage})` }}
    >
      {/* Pure Black Overlay - Clean and Elegant */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-50"></div>

      {/* Content Container with proper top padding */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto text-center">
          {/* Award Badge with Location */}
          <motion.div
            className="mb-6 sm:mb-7 md:mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-black/40 backdrop-blur-lg border border-amber-500/50 rounded-full hover:border-amber-400 hover:bg-black/50 transition-all duration-300 shadow-lg shadow-amber-500/20">
              <FiStar className="text-amber-400 text-sm sm:text-base md:text-lg animate-pulse" />
              <span className="text-white text-xs sm:text-sm md:text-base font-bold tracking-wide">
                Award-Winning Fusion Cuisine
              </span>
            </div>

            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 bg-black/40 backdrop-blur-lg border border-red-500/50 rounded-full hover:border-red-400 hover:bg-black/50 transition-all duration-300 shadow-lg shadow-red-500/20">
              <FiMapPin className="text-red-400 text-sm sm:text-base md:text-lg" />
              <span className="text-white text-xs sm:text-sm md:text-base font-bold tracking-wide">
                Arlington, TX
              </span>
            </div>
          </motion.div>

          {/* Main Heading - Ultra Premium Typography */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-5 sm:mb-6 md:mb-8 lg:mb-10"
          >
            <h1 className="font-black leading-[0.95] tracking-tight mb-3 sm:mb-4">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.3)]">
                1 Stop Dhido
              </span>
              <span className="block mt-2 sm:mt-3 md:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-amber-400 via-red-500 to-rose-600 bg-clip-text text-transparent filter drop-shadow-[0_0_40px_rgba(251,191,36,0.4)]">
                Restaurant Arlington
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-5 md:mb-6 text-gray-200 font-semibold tracking-wide max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Authentic Nepali & Southern Fusion Flavors
          </motion.p>

          {/* Tagline */}
          <motion.div
            className="mb-5 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="inline-block px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-red-600/20 to-amber-600/20 backdrop-blur-md border-2 border-amber-500/40 rounded-full shadow-xl shadow-amber-500/20">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-amber-300 tracking-wide">
                Your one stop for Dhido, Dal-Bhat, and Good Vibes! 🍜😊🍛
              </p>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mb-8 sm:mb-10 md:mb-12 lg:mb-14 text-gray-300 max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Experience traditional Nepali comfort food with our signature
            Dal-Bhat sets, authentic Dhido, handcrafted Momos, and aromatic
            Biryani - all served with love and passion!
          </motion.p>

          {/* Special Dishes - Premium Cards */}
          <motion.div
            className="flex justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-10 sm:mb-12 md:mb-14 lg:mb-16 flex-wrap px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            {food.map((item, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 1.2 + index * 0.15,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                whileHover={{ scale: 1.08, y: -8 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative bg-black/60 backdrop-blur-xl border-2 border-white/20 rounded-2xl sm:rounded-3xl px-5 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5 md:py-6 lg:py-7 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 overflow-hidden">
                  {/* Animated gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  ></div>

                  {/* Glow effect */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`}
                  ></div>

                  <div className="relative flex flex-col items-center gap-2 sm:gap-3">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-1 sm:mb-2 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                      {item.icon}
                    </div>
                    <div
                      className={`w-10 sm:w-12 md:w-14 lg:w-16 h-1 sm:h-1.5 bg-gradient-to-r ${item.color} rounded-full shadow-lg`}
                    ></div>
                    <span className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wider mt-1">
                      {item.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons - Refined Design */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 justify-center items-center px-4 mb-10 sm:mb-12 md:mb-14"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
            transition={{ duration: 0.7, delay: 1.5, ease: "easeOut" }}
          >
            <Link
              to="/menu"
              className="group relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white px-8 sm:px-10 md:px-12 lg:px-14 py-4 sm:py-4.5 md:py-5 lg:py-6 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/60 hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              {/* Animated background layer */}
              <span className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>

              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">
                Order Online Now
                <FiArrowRight className="text-lg sm:text-xl md:text-2xl group-hover:translate-x-2 transition-transform duration-300" />
              </span>

              {/* Shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            </Link>

            <Link
              to="/menu"
              className="group relative overflow-hidden bg-black/40 backdrop-blur-xl border-2 border-amber-500/60 text-white px-8 sm:px-10 md:px-12 lg:px-14 py-4 sm:py-4.5 md:py-5 lg:py-6 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-wider transition-all duration-300 hover:bg-black/60 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">
                View Full Menu
                <svg
                  className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 group-hover:rotate-90 transition-transform duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 text-gray-300 text-xs sm:text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 1.7 }}
          >
            <div className="flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-md px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-full border border-white/10">
              <div className="flex -space-x-2 sm:-space-x-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 to-red-500 border-2 sm:border-3 border-black flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg"
                  >
                    ⭐
                  </div>
                ))}
              </div>
              <span className="font-bold text-white">500+ Happy Customers</span>
            </div>

            <div className="hidden sm:block h-8 w-px bg-gray-600"></div>

            <div className="flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-md px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-full border border-white/10">
              <span className="text-2xl sm:text-3xl">🏆</span>
              <span className="font-bold text-white">
                Top Rated in Arlington
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Elegant Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Ambient light orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.3, 1],
              x: [0, Math.random() * 40 - 20, 0],
              y: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 10 + Math.random() * 5,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
            className={`absolute rounded-full blur-3xl ${
              i % 2 === 0 ? "bg-amber-500/30" : "bg-red-500/30"
            }`}
            style={{
              width: `${150 + Math.random() * 150}px`,
              height: `${150 + Math.random() * 150}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Sparkle particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};

export default HeroSection;
