import React from "react";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const AnimatedSection = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const TestimonialsSection = ({
  testimonials,
  activeTestimonial,
  setActiveTestimonial,
}) => (
  <section className="py-24 px-4 bg-gradient-to-b from-black/90 to-deep-black">
    <div className="max-w-5xl mx-auto">
      <AnimatedSection className="text-center mb-16">
        <span className="text-light-gold font-display tracking-wider">
          GUEST EXPERIENCES
        </span>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            What Our Guests Say
          </h2>
          <p className="text-lg sm:text-xl text-red-400">
            Real experiences from our Dal-Bhat & Dhido lovers
          </p>
        </div>
        <p className="text-neutral-gray text-lg max-w-2xl mx-auto">
          Hear from our valued patrons about their dining experiences at
          Himalayan Fusion
        </p>
      </AnimatedSection>
      <AnimatedSection>
        <div className="relative py-8">
          <div className="absolute top-0 left-0 text-light-gold/5 pointer-events-none">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h10zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
            </svg>
          </div>
          <motion.div
            className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/5 shadow-xl"
            key={activeTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 mb-6 relative">
                <img
                  src={testimonials[activeTestimonial].image}
                  alt={testimonials[activeTestimonial].name}
                  className="w-full h-full object-cover rounded-full border-2 border-light-gold"
                />
                <div className="absolute -bottom-2 -right-2 bg-accent-red rounded-full p-1">
                  <FiStar className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
              <div className="flex mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map(
                  (_, i) => (
                    <FiStar
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-amber-400 mx-0.5"
                    />
                  )
                )}
              </div>
              <blockquote className="text-center mb-6">
                <p className="text-xl text-white italic leading-relaxed">
                  "{testimonials[activeTestimonial].review}"
                </p>
              </blockquote>
              <cite className="text-light-gold font-semibold not-italic">
                — {testimonials[activeTestimonial].name}
              </cite>
            </div>
          </motion.div>
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeTestimonial === index
                    ? "bg-light-gold scale-125"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default TestimonialsSection;
