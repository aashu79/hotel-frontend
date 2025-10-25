import React, { useEffect } from "react";
import HeroSection from "../components/HerSection/HeroSection";
import OurStorySection from "../components/Home/OurStorySection";
import MenuHighlightsSection from "../components/Home/MenuHighlightsSection";
import ExperienceSection from "../components/Home/ExperienceSection";
import TestimonialsSection from "../components/Home/TestimonialsSection";
import LocationSection from "../components/Home/LocationSection";
import CallToActionSection from "../components/Home/CallToActionSection";

// Import images for better performance and loading
const images = {
  momo: "https://media.istockphoto.com/id/176634379/photo/vegetarian-nepalese-momo.jpg?s=612x612&w=0&k=20&c=eF7-5UTXLVWPDFnJDvhanZ_gjifzmlOz-_0bmIodNCs=",
  seafood:
    "https://guides.brit.co/media-library/image.jpg?id=22450921&width=1200&height=1200&coordinates=61%2C0%2C61%2C0",
  thukpa:
    "https://junifoods.com/wp-content/uploads/2024/05/The-Best-Chicken-Thukpa-Tibetan-Noodle-Soup-%E0%A4%95%E0%A5%81%E0%A4%96%E0%A5%81%E0%A4%B0%E0%A4%BE%E0%A4%95%E0%A5%8B-%E0%A4%A5%E0%A5%81%E0%A4%95%E0%A5%8D%E0%A4%AA%E0%A4%BE--500x375.jpg",
  selRoti:
    "https://washburnreview.org/wp-content/uploads/2023/03/sel-roti.jpeg",
  chefSpecial:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop",
  interior:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
};

// Testimonials data
const testimonials = [
  {
    name: "Abhishek Sharma",
    review:
      "The Dal-Bhat here is absolutely incredible! Authentic Nepali flavors that remind me of home. The momos are perfectly steamed!",
    rating: 5,
    image:
      "https://www.shutterstock.com/image-photo/happy-friendly-south-asian-indian-260nw-2250188167.jpg",
  },
  {
    name: "Aadit Dhariwal",
    review:
      "Best Dhido in Arlington! The atmosphere is amazing and the traditional preparations are spot-on. The biryani is a must-try!",
    rating: 5,
    image:
      "https://www.shutterstock.com/image-photo/indian-young-family-four-eating-260nw-1801015375.jpg",
  },
  {
    name: "Shambhu Kumar Yadav",
    review:
      "Feels like home! The Dal-Bhat set is complete with all traditional sides. Authentic spices and cooking methods - truly a one-stop for good vibes!",
    rating: 5,
    image:
      "https://www.anokhilife.com/wp-content/uploads/AL-Blog-Featured-Image-73-1200x900.png",
  },
];

// Location data
const locations = {
  arlington: {
    name: "Arlington",
    address: "100 W Pioneer Pkwy, Suite 158",
    city: "Arlington, TX 76010",
    phone: "(682) 252-4066",
    hours: "11:00 AM - 10:00 PM",
    mapUrl:
      "https://maps.google.com/?q=100+W+Pioneer+Pkwy+Suite+158+Arlington+TX+76010",
  },
};

// Main component
export const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = React.useState(0);
  const [selectedLocation, setSelectedLocation] = React.useState("arlington");

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-deep-black text-white">
      <HeroSection />
      {/* <OurStorySection chefSpecialImg={images.chefSpecial} /> */}
      <MenuHighlightsSection />
      <ExperienceSection
        images={{ interior: images.interior, chefSpecial: images.chefSpecial }}
      />
      <TestimonialsSection
        testimonials={testimonials}
        activeTestimonial={activeTestimonial}
        setActiveTestimonial={setActiveTestimonial}
      />
      <LocationSection
        locations={locations}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
      <CallToActionSection />
    </div>
  );
};

export default Home;
