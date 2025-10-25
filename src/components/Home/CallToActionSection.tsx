import React from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";

const AnimatedSection = ({ children, className = "" }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const CallToActionSection = () => (
  <section className="py-24 px-4 bg-gradient-radial from-light-gold/20 to-transparent">
    <div className="max-w-4xl mx-auto text-center">
      <AnimatedSection>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
          Craving Authentic Dal-Bhat?
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 text-gray-300">
          Visit 1 Stop Dhido Restaurant - Your one stop for Dhido, Dal-Bhat, and
          Good Vibes!
        </p>
        <p className="text-base sm:text-lg mb-8 text-red-400">
          Dine-In or Take Out - Authentic Nepali & Fusion Flavors Await! 🍜😊🍛
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/menu"
            className="bg-red-700 hover:bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105 text-center"
          >
            Order Now
          </a>
          <a
            href="tel:6822524066"
            className="bg-transparent border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all transform hover:scale-105 text-center"
          >
            Call Us: (682) 252-4066
          </a>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default CallToActionSection;
