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
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Experience Authentic Himalayan Fusion Cuisine
        </h2>
        <p className="text-xl text-neutral-gray mb-10 max-w-2xl mx-auto">
          Join us for an unforgettable dining experience that brings the flavors
          of the Himalayas to Texas
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/reservations"
            className="bg-accent-red hover:bg-accent-red/90 text-white px-8 py-4 rounded-md font-semibold transition-all duration-300"
          >
            Make a Reservation
          </Link>
          <Link
            to="/menu"
            className="border-2 border-light-gold text-white hover:bg-light-gold/10 px-8 py-4 rounded-md font-semibold transition-all duration-300"
          >
            Browse Our Menu
          </Link>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default CallToActionSection;
