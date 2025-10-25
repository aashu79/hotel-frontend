import React from "react";
import { Link } from "react-router-dom";
import { GiKnifeFork } from "react-icons/gi";
import { FiArrowRight, FiAward, FiUsers } from "react-icons/fi";
import { motion, useAnimation, useInView } from "framer-motion";
import { GiChiliPepper } from "react-icons/gi";

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

const ExperienceSection = ({ images }) => (
  <section className="py-24 px-4">
    <div className="max-w-7xl mx-auto">
      <AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <span className="text-light-gold font-display tracking-wider">
              HIMALAYAN FLAVORS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
              Authentic Nepali & Seafood Grill
            </h2>
            <p className="text-neutral-gray text-lg leading-relaxed mb-6">
              Nestled in the heart of Arlington, Himalayan Seafood Dhido offers
              a bold fusion of traditional Nepali dishes, Himalayan specialties
              like Sukuti and Sekuwa, and fresh Gulf seafood—all grilled to
              perfection.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
                <div className="w-14 h-14 rounded-full bg-light-gold/20 flex items-center justify-center mb-3">
                  <GiChiliPepper className="w-6 h-6 text-light-gold" />
                </div>
                <h3 className="text-white font-semibold mb-1">
                  Nepali Classics
                </h3>
                <p className="text-neutral-gray text-sm">
                  Thali, Momo, Chowmein & more
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
                <div className="w-14 h-14 rounded-full bg-light-gold/20 flex items-center justify-center mb-3">
                  <GiKnifeFork className="w-6 h-6 text-light-gold" />
                </div>
                <h3 className="text-white font-semibold mb-1">Seafood Grill</h3>
                <p className="text-neutral-gray text-sm">
                  Crawfish, shrimp, crab & lobster
                </p>
              </div>
            </div>
            <Link
              to="/reservations"
              className="inline-flex items-center justify-center border-2 border-light-gold text-white hover:bg-light-gold/10 px-6 py-3 rounded-md transition-all duration-300 font-medium"
            >
              Reserve Your Table
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="lg:col-span-3 grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-7">
              <img
                src={images.interior}
                alt="Himalayan Seafood Dhido interior"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="col-span-6 md:col-span-5">
              <img
                src={images.chefSpecial}
                alt="Nepali momo and grilled seafood"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="col-span-6 md:col-span-5">
              <div className="bg-light-gold/90 h-full rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <FiAward className="w-10 h-10 text-deep-black mx-auto mb-2" />
                  <p className="text-deep-black font-bold text-lg">
                    Himalayan & Southern Fusion
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-7">
              <div className="bg-white/5 h-full rounded-lg p-6 flex items-center">
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">
                    Taste the Himalayas
                  </h3>
                  <p className="text-neutral-gray">
                    From smoky Sukuti to buttery Garlic Naan and boil pots of
                    Gulf seafood—every dish tells a story of mountain and coast.
                  </p>
                  <Link
                    to="/menu"
                    className="text-light-gold inline-flex items-center mt-3 group"
                  >
                    <span className="group-hover:underline">
                      View Full Menu
                    </span>
                    <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Authentic Nepali & Fusion Flavors
          </h2>
          <p className="text-lg sm:text-xl text-red-400">
            Your One Stop for Dhido, Dal-Bhat, and Good Vibes!
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white/5 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Traditional Dal-Bhat Experience
              </h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Indulge in our authentic Dal-Bhat sets - a complete Nepali meal
                featuring perfectly cooked lentils, fluffy rice, seasonal
                vegetables, and traditional accompaniments. Experience the soul
                of Nepali cuisine with our signature Dhido, handcrafted Momos,
                aromatic Biryani, and fusion delicacies that bring the flavors
                of the Himalayas to Arlington.
              </p>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Each dish is prepared using time-honored recipes, authentic
                Nepali spices, and the freshest ingredients to ensure every bite
                transports you to the mountains of Nepal.
              </p>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center bg-light-gold text-deep-black hover:bg-light-gold/90 px-6 py-3 rounded-md transition-all duration-300 font-medium"
            >
              Explore Our Menu
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="bg-white/5 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Join Our Community
              </h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Be a part of our family! Enjoy exclusive offers, updates, and
                insider access to events and specials. Sign up for our
                newsletter and follow us on social media.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="flex-1 inline-flex items-center justify-center bg-light-gold text-deep-black hover:bg-light-gold/90 px-6 py-3 rounded-md transition-all duration-300 font-medium"
              >
                Sign Up
                <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/contact"
                className="flex-1 inline-flex items-center justify-center border-2 border-light-gold text-white hover:bg-light-gold/10 px-6 py-3 rounded-md transition-all duration-300 font-medium"
              >
                Contact Us
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default ExperienceSection;
