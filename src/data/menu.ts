import { MenuItem } from "@/contexts/CartContext"; // or define inline

export const menuCategories = [
  "Starters",
  "Chowmein",
  "Biryani",
  "Curry / Rice / Naan",
  "Thali",
  "Fried Rice",
  "Momo / Dumplings",
  "Sekuwa / Sukuti",
  "Sides",
  "Fried Seafood",
  "Boiled Seafood",
  "Drinks",
];

export const menuItems: MenuItem[] = [
  // === STARTERS ===
  {
    id: "1",
    name: "Hush Puppies (8)",
    category: "Starters",
    description: "Southern-style corn fritters",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1598516802417-8d17e0f53b29?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "2",
    name: "Fries",
    category: "Starters",
    description: "Crispy golden fries",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1576107232684-3a2b2f9e5cc2?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "3",
    name: "Wings (6)",
    category: "Starters",
    description: "Spicy or mild chicken wings",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1569058242253-92d274b317f3?auto=format&fit=crop&w=600",
  },
  {
    id: "4",
    name: "Fried Chicken Gizzard",
    category: "Starters",
    description: "Crispy fried chicken gizzards",
    price: 16.95,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
  },
  {
    id: "5",
    name: "Fried Crawfish",
    category: "Starters",
    description: "Crispy fried whole crawfish",
    price: 18.95,
    image:
      "https://images.unsplash.com/photo-1625940131218-5b7f0d7c6b6c?auto=format&fit=crop&w=600",
  },
  {
    id: "6",
    name: "Mozzarella Half Moon Sticks",
    category: "Starters",
    description: "Mozzarella cheese in a crispy half-moon shell",
    price: 13.95,
    image:
      "https://images.unsplash.com/photo-1595777457586-2e678b908829?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "7",
    name: "Aloo Chop",
    category: "Starters",
    description: "Spiced potato fritters",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d0ebb2a?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "8",
    name: "Chatpate",
    category: "Starters",
    description: "Nepali street snack with puffed rice and spices",
    price: 8.99,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "9",
    name: "Sukuti",
    category: "Starters",
    description: "Traditional Nepali dried spiced meat",
    price: 18.99,
    image:
      "https://images.unsplash.com/photo-1605557618425-0b28c3f83b44?auto=format&fit=crop&w=600",
  },

  // === CHOWMEIN ===
  {
    id: "10",
    name: "Chicken Chowmein",
    category: "Chowmein",
    description: "Stir-fried noodles with chicken",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1585032226651-1b08d57c42ab?auto=format&fit=crop&w=600",
  },
  {
    id: "11",
    name: "Pork Chowmein",
    category: "Chowmein",
    description: "Stir-fried noodles with pork",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1585032226651-1b08d57c42ab?auto=format&fit=crop&w=600",
  },
  {
    id: "12",
    name: "Mutton Chowmein",
    category: "Chowmein",
    description: "Stir-fried noodles with mutton",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1585032226651-1b08d57c42ab?auto=format&fit=crop&w=600",
  },
  {
    id: "13",
    name: "Veggie Chowmein",
    category: "Chowmein",
    description: "Stir-fried noodles with mixed vegetables",
    price: 10.99,
    image:
      "https://images.unsplash.com/photo-1585032226651-1b08d57c42ab?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "14",
    name: "Shrimp Chowmein",
    category: "Chowmein",
    description: "Stir-fried noodles with shrimp",
    price: 17.99,
    image:
      "https://images.unsplash.com/photo-1585032226651-1b08d57c42ab?auto=format&fit=crop&w=600",
  },
  {
    id: "15",
    name: "Seafood Mix Chowmein",
    category: "Chowmein",
    description: "Stir-fried noodles with mixed seafood",
    price: 21.99,
    image:
      "https://images.unsplash.com/photo-1585032226651-1b08d57c42ab?auto=format&fit=crop&w=600",
  },

  // === BIRYANI ===
  {
    id: "16",
    name: "Chicken Biryani",
    category: "Biryani",
    description: "Fragrant basmati rice with chicken and spices",
    price: 10.99,
    image:
      "https://images.unsplash.com/photo-1566554273541-81a6d2e79c13?auto=format&fit=crop&w=600",
  },
  {
    id: "17",
    name: "Mutton Biryani",
    category: "Biryani",
    description: "Fragrant basmati rice with mutton and spices",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1566554273541-81a6d2e79c13?auto=format&fit=crop&w=600",
  },
  {
    id: "18",
    name: "Veggie Biryani",
    category: "Biryani",
    description: "Fragrant basmati rice with mixed vegetables",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1566554273541-81a6d2e79c13?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "19",
    name: "Shrimp Biryani",
    category: "Biryani",
    description: "Fragrant basmati rice with shrimp and spices",
    price: 17.99,
    image:
      "https://images.unsplash.com/photo-1566554273541-81a6d2e79c13?auto=format&fit=crop&w=600",
  },
  {
    id: "20",
    name: "Seafood Mix Biryani",
    category: "Biryani",
    description: "Fragrant basmati rice with shrimp, crawfish, and fish",
    price: 18.99,
    image:
      "https://images.unsplash.com/photo-1566554273541-81a6d2e79c13?auto=format&fit=crop&w=600",
  },

  // === CURRY / RICE / NAAN ===
  {
    id: "21",
    name: "Chicken Curry",
    category: "Curry / Rice / Naan",
    description: "Chicken in traditional Nepali curry sauce",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600",
  },
  {
    id: "22",
    name: "Goat Curry",
    category: "Curry / Rice / Naan",
    description: "Goat meat in rich curry sauce",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600",
  },
  {
    id: "23",
    name: "Pork Curry",
    category: "Curry / Rice / Naan",
    description: "Pork in savory curry sauce",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600",
  },
  {
    id: "24",
    name: "Fish Curry",
    category: "Curry / Rice / Naan",
    description: "Fish in aromatic curry sauce",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600",
  },
  {
    id: "25",
    name: "Chicken Tikka Masala",
    category: "Curry / Rice / Naan",
    description: "Grilled chicken in creamy tomato sauce",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1590955256719-d4a44a4a864f?auto=format&fit=crop&w=600",
  },
  {
    id: "26",
    name: "Butter Chicken Masala",
    category: "Curry / Rice / Naan",
    description: "Chicken in rich buttery tomato sauce",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600",
  },

  // === THALI ===
  {
    id: "27",
    name: "Chicken Thali",
    category: "Thali",
    description:
      "Complete Nepali meal with chicken curry, rice, dal, and sides",
    price: 14.59,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
  },
  {
    id: "28",
    name: "Local Chicken Thali",
    category: "Thali",
    description: "Complete Nepali meal with local chicken curry",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
  },
  {
    id: "29",
    name: "Mutton Thali",
    category: "Thali",
    description: "Complete Nepali meal with mutton curry",
    price: 14.59,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
  },
  {
    id: "30",
    name: "Pork Thali",
    category: "Thali",
    description: "Complete Nepali meal with pork curry",
    price: 14.59,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
  },
  {
    id: "31",
    name: "Veggie Thali",
    category: "Thali",
    description: "Complete vegetarian Nepali meal",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "32",
    name: "Shrimp Thali",
    category: "Thali",
    description: "Complete Nepali meal with shrimp curry",
    price: 18.99,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
  },
  {
    id: "33",
    name: "Fish Thali",
    category: "Thali",
    description: "Complete Nepali meal with fish curry",
    price: 14.59,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
  },
  {
    id: "34",
    name: "Seafood Mix Thali",
    category: "Thali",
    description: "Complete Nepali meal with mixed seafood curry",
    price: 21.99,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
  },
  {
    id: "35",
    name: "Sukuti Thali",
    category: "Thali",
    description: "Complete Nepali meal with Sukuti curry",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
  },
  {
    id: "36",
    name: "Sukuti 2 Thali",
    category: "Thali",
    description: "Premium complete Nepali meal with Sukuti 2 curry",
    price: 21.99,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
  },

  // === FRIED RICE ===
  {
    id: "37",
    name: "Chicken Fried Rice",
    category: "Fried Rice",
    description: "Fried rice with chicken",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f1e9f5c43?auto=format&fit=crop&w=600",
  },
  {
    id: "38",
    name: "Shrimp Fried Rice",
    category: "Fried Rice",
    description: "Fried rice with shrimp",
    price: 17.99,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f1e9f5c43?auto=format&fit=crop&w=600",
  },
  {
    id: "39",
    name: "Sukuti Fried Rice",
    category: "Fried Rice",
    description: "Fried rice with Sukuti",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f1e9f5c43?auto=format&fit=crop&w=600",
  },
  {
    id: "40",
    name: "Sukuti 2 Fried Rice",
    category: "Fried Rice",
    description: "Fried rice with Sukuti 2",
    price: 21.99,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f1e9f5c43?auto=format&fit=crop&w=600",
  },
  {
    id: "41",
    name: "Seafood Mix Fried Rice",
    category: "Fried Rice",
    description: "Fried rice with mixed seafood",
    price: 21.99,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f1e9f5c43?auto=format&fit=crop&w=600",
  },

  // === MOMO / DUMPLINGS ===
  {
    id: "42",
    name: "Chicken Momo (Steam/Kothey)",
    category: "Momo / Dumplings",
    description: "Steamed or fried chicken dumplings",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
  },
  {
    id: "43",
    name: "Veg Momo (Steam/Kothey)",
    category: "Momo / Dumplings",
    description: "Steamed or fried vegetable dumplings",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "44",
    name: "Pork Momo (Steam/Kothey)",
    category: "Momo / Dumplings",
    description: "Steamed or fried pork dumplings",
    price: 10.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
  },
  {
    id: "45",
    name: "Mutton Momo (Steam/Kothey)",
    category: "Momo / Dumplings",
    description: "Steamed or fried mutton dumplings",
    price: 10.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
  },
  {
    id: "46",
    name: "Veg Jhol Momo",
    category: "Momo / Dumplings",
    description: "Vegetable momo in spicy tomato broth",
    price: 10.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "47",
    name: "Chicken Jhol Momo",
    category: "Momo / Dumplings",
    description: "Chicken momo in spicy tomato broth",
    price: 10.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
  },
  {
    id: "48",
    name: "Pork Jhol Momo",
    category: "Momo / Dumplings",
    description: "Pork momo in spicy tomato broth",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
  },
  {
    id: "49",
    name: "Mutton Jhol Momo",
    category: "Momo / Dumplings",
    description: "Mutton momo in spicy tomato broth",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
  },
  {
    id: "50",
    name: "Veg Tikka Fried Momo Masala",
    category: "Momo / Dumplings",
    description: "Fried vegetable momo in tikka masala sauce",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "51",
    name: "Chicken Tikka Fried Momo Masala",
    category: "Momo / Dumplings",
    description: "Fried chicken momo in tikka masala sauce",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
  },
  {
    id: "52",
    name: "Pressure Cooker Momo",
    category: "Momo / Dumplings",
    description: "Momo cooked in a pressure cooker for a unique texture",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1598515213619-733c16b3e2e8?auto=format&fit=crop&w=600",
  },

  // === SEKUWA / SUKUTI ===
  {
    id: "53",
    name: "Pork Sekuwa",
    category: "Sekuwa / Sukuti",
    description: "Grilled marinated pork skewers",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600",
  },
  {
    id: "54",
    name: "Chicken Sekuwa",
    category: "Sekuwa / Sukuti",
    description: "Grilled marinated chicken skewers",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600",
  },
  {
    id: "55",
    name: "Mutton Sekuwa",
    category: "Sekuwa / Sukuti",
    description: "Grilled marinated mutton skewers",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600",
  },
  {
    id: "56",
    name: "Mutton Sukuti",
    category: "Sekuwa / Sukuti",
    description: "Dried spiced mutton",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1605557618425-0b28c3f83b44?auto=format&fit=crop&w=600",
  },
  {
    id: "57",
    name: "Mutton Sukuti 2",
    category: "Sekuwa / Sukuti",
    description: "Premium dried spiced mutton",
    price: 21.99,
    image:
      "https://images.unsplash.com/photo-1605557618425-0b28c3f83b44?auto=format&fit=crop&w=600",
  },
  {
    id: "58",
    name: "Mutton Taas",
    category: "Sekuwa / Sukuti",
    description: "Crispy fried mutton pieces",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1605557618425-0b28c3f83b44?auto=format&fit=crop&w=600",
  },

  // === SIDES ===
  {
    id: "59",
    name: "Garlic Naan",
    category: "Sides",
    description: "Naan bread topped with garlic",
    price: 2.99,
    image:
      "https://images.unsplash.com/photo-1598791274739-22e91220e7cb?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "60",
    name: "Butter Naan",
    category: "Sides",
    description: "Naan bread brushed with butter",
    price: 2.99,
    image:
      "https://images.unsplash.com/photo-1598791274739-22e91220e7cb?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "61",
    name: "Plain Naan",
    category: "Sides",
    description: "Classic plain naan bread",
    price: 1.99,
    image:
      "https://images.unsplash.com/photo-1598791274739-22e91220e7cb?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "62",
    name: "Plain Rice",
    category: "Sides",
    description: "Steamed basmati rice",
    price: 1.99,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f1e9f5c43?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "63",
    name: "Garlic Butter",
    category: "Sides",
    description: "Served with sides",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "64",
    name: "Boiled Egg (3) w/ Garlic Butter",
    category: "Sides",
    description: "Three boiled eggs served with garlic butter",
    price: 7.99,
    image:
      "https://images.unsplash.com/photo-1583238879926-7da2d403b4f7?auto=format&fit=crop&w=600",
  },
  {
    id: "65",
    name: "Corn Cob (3) w/ Garlic Butter",
    category: "Sides",
    description: "Three corn cobs served with garlic butter",
    price: 7.99,
    image:
      "https://images.unsplash.com/photo-1593106938146-1f6f9e4c0d1e?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "66",
    name: "Potatoes (3) w/ Garlic Butter",
    category: "Sides",
    description: "Three potatoes served with garlic butter",
    price: 7.99,
    image:
      "https://images.unsplash.com/photo-1593106938146-1f6f9e4c0d1e?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "67",
    name: "Grilled Sausage (10)",
    category: "Sides",
    description: "Ten grilled sausages",
    price: 8.99,
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600",
  },

  // === FRIED SEAFOOD ===
  {
    id: "68",
    name: "Chicken Tenders (5)",
    category: "Fried Seafood",
    description: "Five crispy chicken tenders",
    price: 15.95,
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600",
  },
  {
    id: "69",
    name: "Fish & Chips (2)",
    category: "Fried Seafood",
    description: "Two pieces of fried fish with fries",
    price: 17.95,
    image:
      "https://images.unsplash.com/photo-1579208575652-8c6b8f6304b4?auto=format&fit=crop&w=600",
  },
  {
    id: "70",
    name: "Shrimp (8)",
    category: "Fried Seafood",
    description: "Eight pieces of fried shrimp",
    price: 17.95,
    image:
      "https://images.unsplash.com/photo-1560942465-6d5abd727db7?auto=format&fit=crop&w=600",
  },
  {
    id: "71",
    name: "Catfish Filet (1)",
    category: "Fried Seafood",
    description: "One piece of fried catfish fillet",
    price: 14.95,
    image:
      "https://images.unsplash.com/photo-1625940131218-5b7f0d7c6b6c?auto=format&fit=crop&w=600",
  },
  {
    id: "72",
    name: "Catfish Filet (2)",
    category: "Fried Seafood",
    description: "Two pieces of fried catfish fillet",
    price: 23.95,
    image:
      "https://images.unsplash.com/photo-1625940131218-5b7f0d7c6b6c?auto=format&fit=crop&w=600",
  },

  // === BOILED SEAFOOD ===
  {
    id: "73",
    name: "Snow Crab Clusters (2)",
    category: "Boiled Seafood",
    description: "Two clusters of snow crab, boiled",
    price: 39.95,
    image:
      "https://images.unsplash.com/photo-1607669558422-7b1b379c2f00?auto=format&fit=crop&w=600",
  },
  {
    id: "74",
    name: "Lobster Tail (2)",
    category: "Boiled Seafood",
    description: "Two lobster tails, boiled",
    price: 42.95,
    image:
      "https://images.unsplash.com/photo-1607669558422-7b1b379c2f00?auto=format&fit=crop&w=600",
  },
  {
    id: "75",
    name: "Shrimp (10) Peeled or Head On",
    category: "Boiled Seafood",
    description: "Ten boiled shrimp, peeled or with head on",
    price: 19.95,
    image:
      "https://images.unsplash.com/photo-1560942465-6d5abd727db7?auto=format&fit=crop&w=600",
  },
  {
    id: "76",
    name: "Half Shell Green Mussel (1lb)",
    category: "Boiled Seafood",
    description: "One pound of green mussels, boiled",
    price: 17.95,
    image:
      "https://images.unsplash.com/photo-1607669558422-7b1b379c2f00?auto=format&fit=crop&w=600",
  },
  {
    id: "77",
    name: "Black Mussel (1lb)",
    category: "Boiled Seafood",
    description: "One pound of black mussels, boiled",
    price: 17.95,
    image:
      "https://images.unsplash.com/photo-1607669558422-7b1b379c2f00?auto=format&fit=crop&w=600",
  },
  {
    id: "78",
    name: "Clams (1lb)",
    category: "Boiled Seafood",
    description: "One pound of clams, boiled",
    price: 17.95,
    image:
      "https://images.unsplash.com/photo-1607669558422-7b1b379c2f00?auto=format&fit=crop&w=600",
  },
  {
    id: "79",
    name: "Boiled Combo 1",
    category: "Boiled Seafood",
    description: "Assorted boiled seafood platter",
    price: 62.95,
    image:
      "https://images.unsplash.com/photo-1607669558422-7b1b379c2f00?auto=format&fit=crop&w=600",
  },
  {
    id: "80",
    name: "Boiled Combo 2",
    category: "Boiled Seafood",
    description: "Large assorted boiled seafood platter",
    price: 109.95,
    image:
      "https://images.unsplash.com/photo-1607669558422-7b1b379c2f00?auto=format&fit=crop&w=600",
  },

  // === DRINKS ===
  {
    id: "81",
    name: "Juju Dhau Lassi",
    category: "Drinks",
    description: "Traditional Nepali yogurt drink",
    price: 5.99,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "82",
    name: "Mango Lassi",
    category: "Drinks",
    description: "Creamy mango yogurt drink",
    price: 3.99,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd68c5d5c8f?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "83",
    name: "Coke Bottle",
    category: "Drinks",
    description: "20oz Coca-Cola",
    price: 3.99,
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "84",
    name: "Fanta Bottle",
    category: "Drinks",
    description: "20oz Fanta",
    price: 3.99,
    image:
      "https://images.unsplash.com/photo-1592496431122-23633a8d7b34?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "85",
    name: "Sprite Bottle",
    category: "Drinks",
    description: "20oz Sprite",
    price: 3.99,
    image:
      "https://images.unsplash.com/photo-1592496431122-23633a8d7b34?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "86",
    name: "Water Bottle",
    category: "Drinks",
    description: "Bottled water",
    price: 1.99,
    image:
      "https://images.unsplash.com/photo-1563551409-8f29354c371e?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "87",
    name: "Can Drinks",
    category: "Drinks",
    description: "12oz can of soda",
    price: 2.49,
    image:
      "https://images.unsplash.com/photo-1592496431122-23633a8d7b34?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "88",
    name: "Milk Tea",
    category: "Drinks",
    description: "Classic milk tea",
    price: 2.49,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c0056bc?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
  {
    id: "89",
    name: "Black Tea",
    category: "Drinks",
    description: "Hot black tea",
    price: 1.99,
    image:
      "https://images.unsplash.com/photo-1571931468259-8d83e9b7e1b6?auto=format&fit=crop&w=600",
    vegetarian: true,
  },
];

// Mark popular items based on menu prominence
export const popularItems = menuItems.filter((item) =>
  [
    "Chicken Momo (Steam/Kothey)",
    "Veg Momo (Steam/Kothey)",
    "Chicken Sekuwa",
    "Sukuti",
    "Shrimp Thali",
    "Boiled Combo 1",
    "Mango Lassi",
  ].includes(item.name)
);
