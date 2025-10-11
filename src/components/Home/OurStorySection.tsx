import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
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

const OurStorySection = ({ chefSpecialImg }) => (
  <section className="py-24 px-4">
    <div className="max-w-7xl mx-auto">
      <AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-light-gold font-display tracking-wider">
              OUR STORY
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
              Authentic Himalayan Heritage
            </h2>
            <p className="text-neutral-gray text-lg leading-relaxed mb-6">
              Our journey began in the heart of Nepal, where our founder
              mastered the art of Himalayan cuisine under the guidance of
              traditional chefs. Bringing those authentic flavors to Texas was a
              dream realized through passion and dedication.
            </p>
            <p className="text-neutral-gray text-lg leading-relaxed mb-8">
              At Himalayan Fusion, we blend time-honored recipes with
              contemporary techniques to create unforgettable dining experiences
              that honor our culinary heritage while embracing innovation.
            </p>
            <Link to="/about" className="inline-flex items-center group">
              <span className="text-light-gold font-semibold mr-2 group-hover:underline">
                Learn more about our journey
              </span>
              <FiArrowRight className="text-light-gold group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10">
              <img
                src={chefSpecialImg}
                alt="Chef preparing special dish"
                className="rounded-lg shadow-2xl w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            <div className="absolute top-8 -right-8 w-full h-full border-4 border-light-gold rounded-lg -z-10 hidden lg:block"></div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default OurStorySection;
