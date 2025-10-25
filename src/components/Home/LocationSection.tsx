import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiClock } from "react-icons/fi";
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

const LocationSection = ({
  locations,
  selectedLocation,
  setSelectedLocation,
}) => (
  <section className="py-24 px-4">
    <div className="max-w-7xl mx-auto">
      <AnimatedSection className="text-center mb-16">
        <span className="text-light-gold font-display tracking-wider">
          FIND US
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
          Our Locations
        </h2>
        <p className="text-neutral-gray text-lg max-w-2xl mx-auto">
          Visit us at our convenient locations in Bedford and Arlington
        </p>
      </AnimatedSection>
      <AnimatedSection>
        <div className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 shadow-xl">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setSelectedLocation("bedford")}
              className={`flex-1 py-4 text-center font-medium transition-all ${
                selectedLocation === "bedford"
                  ? "text-light-gold border-b-2 border-light-gold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Bedford
            </button>
            <button
              onClick={() => setSelectedLocation("arlington")}
              className={`flex-1 py-4 text-center font-medium transition-all ${
                selectedLocation === "arlington"
                  ? "text-light-gold border-b-2 border-light-gold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Arlington
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-[400px] lg:h-auto">
              <iframe
                title="Restaurant Location"
                src={`${locations[selectedLocation].mapUrl}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6">
                Himalayan Fusion {locations[selectedLocation].name}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-light-gold/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <FiMapPin className="w-5 h-5 text-light-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Address</h4>
                    <p className="text-neutral-gray">
                      {locations[selectedLocation].address}
                      <br />
                      {locations[selectedLocation].city}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-light-gold/20 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <FiClock className="w-5 h-5 text-light-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Hours</h4>
                    <p className="text-neutral-gray">
                      {locations[selectedLocation].hours}
                    </p>
                    <p className="text-neutral-gray">
                      Monday - Thursday: 11am - 9pm
                      <br />
                      Friday - Saturday: 11am - 10pm
                      <br />
                      Sunday: 12pm - 8pm
                    </p>
                  </div>
                </div>
                <div className="flex items-center mt-8 space-x-4">
                  <Link
                    to={`/locations/${selectedLocation}`}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded text-center transition-all duration-300"
                  >
                    Location Details
                  </Link>
                  <Link
                    to="/reservations"
                    className="flex-1 bg-accent-red hover:bg-accent-red/90 text-white py-3 px-6 rounded text-center transition-all duration-300"
                  >
                    Reserve a Table
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Visit Us
        </h2>
        <p className="text-lg sm:text-xl text-red-400">
          Find us in Arlington, Texas
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-neutral-800/50 p-6 md:p-8 rounded-lg backdrop-blur-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-red-400 mb-6">
            1 Stop Dhido Restaurant - Arlington
          </h3>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <div className="mb-4">
                <h4 className="text-red-400 font-semibold mb-2 text-sm sm:text-base">
                  Address
                </h4>
                <p className="text-sm sm:text-base">
                  {locations[selectedLocation].address}
                </p>
                <p className="text-sm sm:text-base">
                  {locations[selectedLocation].city}
                </p>
              </div>
              <div className="mb-4">
                <h4 className="text-red-400 font-semibold mb-2 text-sm sm:text-base">
                  Phone
                </h4>
                <a
                  href={`tel:${locations[selectedLocation].phone.replace(
                    /\D/g,
                    ""
                  )}`}
                  className="hover:text-red-400 transition-colors text-sm sm:text-base"
                >
                  {locations[selectedLocation].phone}
                </a>
              </div>
              <div className="mb-4">
                <h4 className="text-red-400 font-semibold mb-2 text-sm sm:text-base">
                  Hours
                </h4>
                <p className="text-sm sm:text-base">
                  {locations[selectedLocation].hours}
                </p>
              </div>
              <a
                href={locations[selectedLocation].mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Get Directions
              </a>
            </div>
            <div className="h-64 md:h-auto rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.123!2d-97.1088!3d32.7357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDQ0JzA4LjUiTiA5N8KwMDYnMzEuNyJX!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default LocationSection;
