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

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      className="relative h-screen min-h-[700px] flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${restImage})` }}
    >
      {/* Image color enhancement */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>

      {/* Light overlay to brighten the image */}
      <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Award badge */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full">
            <FiStar className="text-amber-400" />
            <span className="text-white text-sm font-medium">
              Acclaimed Nepali-Southern Fusion
            </span>
          </div>
        </motion.div>

        {/* Main heading with partial typing effect */}
        <motion.h1
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <span className="block text-red-400 text-xl md:text-2xl font-medium mb-3 font-display">
            <TypedText
              text="Himalayan Soul • Southern Heat"
              speed={40}
              delay={800}
            />
          </span>
          <span className="block text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
            <span className="text-white">Taste of the</span>{" "}
            <span className="text-amber-400 font-display italic">
              Himalayas
            </span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.div
          className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto text-center leading-relaxed"
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
          className="flex justify-center gap-8 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { name: "Momos", color: "bg-red-500" },
            { name: "Seafood Boil", color: "bg-amber-500" },
            { name: "Sekuwa", color: "bg-red-500" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 + index * 0.2, type: "spring" }}
            >
              <div className={`w-3 h-3 ${item.color} rounded-full mb-2`}></div>
              <span className="text-white text-sm font-light">{item.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <Link
            to="/order"
            className="group relative overflow-hidden bg-gradient-to-r from-red-700 to-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold uppercase tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30 hover:scale-105"
          >
            <span className="relative z-10 flex items-center">
              Order Online
              <FiArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/menu"
            className="group bg-black/40 backdrop-blur-sm border-2 border-amber-400/50 text-white px-8 py-4 rounded-lg text-lg font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-amber-400/10 hover:scale-105"
          >
            <span className="flex items-center">
              View Menu
              <svg
                className="ml-2 w-5 h-5 group-hover:rotate-45 transition-transform duration-300"
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
          {/* Add light burst effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 mix-blend-screen">
            <div className="absolute inset-0 bg-radial-gradient animate-pulse-slow"></div>
          </div>

          {/* Small decorative elements */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.5, 0],
                x: Math.random() * 20 - 10,
                y: Math.random() * 20 - 10,
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + Math.random() * 3,
                delay: Math.random() * 2,
                repeatType: "reverse",
              }}
              className="absolute w-1 h-1 bg-amber-400 rounded-full"
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
