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
      "Absolutely incredible authentic Nepali flavors! The momos are the best I've ever had.",
    rating: 5,
    image:
      "https://www.shutterstock.com/image-photo/happy-friendly-south-asian-indian-260nw-2250188167.jpg",
  },
  {
    name: "Aadit Dhariwal",
    review:
      "The atmosphere is amazing and the dhido combinations are truly unique. Highly recommend!",
    rating: 5,
    image:
      "https://www.shutterstock.com/image-photo/indian-young-family-four-eating-260nw-1801015375.jpg",
  },
  {
    name: "Shambhu Kumar Yadav",
    review:
      "Feels like home! The spices and traditional cooking methods are perfectly authentic.",
    rating: 5,
    image:
      "https://www.anokhilife.com/wp-content/uploads/AL-Blog-Featured-Image-73-1200x900.png",
  },
];

// Popular menu items
const menuItems = [
  {
    id: 1,
    name: "Signature Momo",
    category: "Appetizers",
    description:
      "Steamed dumplings filled with seasoned meat or vegetables, served with spicy tomato chutney.",
    price: 12.99,
    image: images.momo,
    popular: true,
    vegetarian: false,
  },
  {
    id: 2,
    name: "Seafood Dhido",
    category: "Mains",
    description:
      "Traditional buckwheat porridge fused with fresh seafood and Himalayan spices.",
    price: 18.99,
    image: images.seafood,
    popular: true,
    vegetarian: false,
  },
  {
    id: 3,
    name: "Thukpa",
    category: "Soups",
    description:
      "Hearty noodle soup with vegetables, meat, and aromatic spices.",
    price: 14.99,
    image: images.thukpa,
    popular: true,
    vegetarian: false,
  },
  {
    id: 4,
    name: "Sel Roti",
    category: "Bread & Rice",
    description: "Crispy rice doughnut, a sweet traditional Nepali snack.",
    price: 8.99,
    image: images.selRoti,
    popular: true,
    vegetarian: true,
  },
  {
    id: 5,
    name: "Signature Momo",
    category: "Appetizers",
    description:
      "Steamed dumplings filled with seasoned meat or vegetables, served with spicy tomato chutney.",
    price: 12.99,
    image: images.momo,
    popular: true,
    vegetarian: false,
  },
  {
    id: 33,
    name: "Thukpa",
    category: "Soups",
    description:
      "Hearty noodle soup with vegetables, meat, and aromatic spices.",
    price: 14.99,
    image: images.thukpa,
    popular: true,
    vegetarian: false,
  },
  {
    id: 10,
    name: "Seafood Dhido",
    category: "Mains",
    description:
      "Traditional buckwheat porridge fused with fresh seafood and Himalayan spices.",
    price: 18.99,
    image: images.seafood,
    popular: true,
    vegetarian: false,
  },
  {
    id: 8,
    name: "Signature Momo",
    category: "Appetizers",
    description:
      "Steamed dumplings filled with seasoned meat or vegetables, served with spicy tomato chutney.",
    price: 12.99,
    image: images.momo,
    popular: true,
    vegetarian: false,
  },
];

// Location data
const locations = {
  bedford: {
    name: "Bedford",
    address: "2400 Airport Fwy #120",
    city: "Bedford, TX 76022",
    phone: "(682) 503-6339",
    hours: "Opens at 11:00 AM CDT",
    mapUrl:
      "https://maps.google.com/?q=2400+Airport+Fwy+%23120+Bedford+TX+76022",
  },
  arlington: {
    name: "Arlington",
    address: "100 W Pioneer Pkwy",
    city: "Arlington, TX 76010",
    phone: "(555) 123-4567",
    hours: "Opens at 11:00 AM CDT",
    mapUrl: "https://maps.google.com/?q=100+W+Pioneer+Pkwy+Arlington+TX+76010",
  },
};

// Main component
export const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = React.useState(0);
  const [selectedLocation, setSelectedLocation] = React.useState("bedford");

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
      <MenuHighlightsSection menuItems={menuItems} />
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
