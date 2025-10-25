import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import restImage from "../../assets/images/rest.jpg";
import { FiArrowRight, FiStar } from "react-icons/fi";

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
      <span className="animate-pulse">|</span>
    </span>
  );
};

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const food = [
    {
      name: "Momos",
      color: "bg-red-500",
    },
    {
      name: "Seafood Boil",
      color: "bg-amber-500",
    },
    {
      name: "Sekuwa",
      color: "bg-red-500",
    },
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      className="relative h-screen min-h-[600px] md:min-h-[700px] flex items-center justify-center bg-cover bg-center overflow-hidden pt-20 md:pt-0"
      style={{ backgroundImage: `url(${restImage})` }}
    >
      {/* Darker overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

      {/* Additional darkening layer */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto w-full">
        {/* Award badge */}
        <motion.div
          className="mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-black/40 backdrop-blur-md border border-amber-400/30 rounded-full hover:border-amber-400/60 transition-all duration-300">
            <FiStar className="text-amber-400 text-sm md:text-base" />
            <span className="text-white text-xs md:text-sm font-medium">
              Acclaimed Nepali-Southern Fusion
            </span>
          </div>
        </motion.div>

        {/* Main heading with partial typing effect */}
        <motion.h1
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <span className="block text-amber-400 text-base md:text-xl lg:text-2xl font-medium mb-2 md:mb-3 font-display tracking-widest uppercase letter-spacing">
            <TypedText
              text="Himalayan Soul • Southern Heat"
              speed={40}
              delay={800}
            />
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight md:leading-none">
            <span className="text-white drop-shadow-lg">Taste of the</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-red-500 font-display italic drop-shadow-lg">
              Himalayas
            </span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.div
          className="text-white text-sm md:text-lg lg:text-xl mb-8 md:mb-10 max-w-2xl mx-auto text-center leading-relaxed font-light drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <TypedText
            text="Where bold Himalayan flavors meet Texas-sized seafood boils, wood-fired sekuwa, and handmade momo — all crafted with authentic spices."
            speed={15}
            delay={1600}
          />
        </motion.div>

        {/* Special dishes highlight */}
        <motion.div
          className="flex justify-center gap-4 md:gap-8 mb-8 md:mb-10 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {food.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 + index * 0.2, type: "spring" }}
            >
              <div
                className={`w-2 h-2 md:w-3 md:h-3 ${item.color} rounded-full mb-2`}
              ></div>
              <span className="text-white text-xs md:text-sm font-light">
                {item.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <Link
            to="/menu"
            className="group relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-lg font-semibold uppercase tracking-wide transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/50 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
              Order Online
              <FiArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/menu"
            className="group bg-white/10 backdrop-blur-md border-2 border-amber-400/60 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-lg font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-amber-400/20 hover:border-amber-400 hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center whitespace-nowrap">
              View Menu
              <svg
                className="ml-2 w-4 md:w-5 h-4 md:h-5 group-hover:rotate-45 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </span>
          </Link>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Small decorative elements */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                x: Math.random() * 15 - 7.5,
                y: Math.random() * 15 - 7.5,
              }}
              transition={{
                repeat: Infinity,
                duration: 4 + Math.random() * 2,
                delay: Math.random() * 2,
                repeatType: "reverse",
              }}
              className="absolute w-1 h-1 bg-amber-300 rounded-full blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
