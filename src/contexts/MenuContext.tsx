import React, { createContext, useContext } from "react";

type MenuContextType = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  orderType: "pickup" | "delivery";
  setOrderType: (type: "pickup" | "delivery") => void;
  activeFilters: {
    vegetarian: boolean;
    spicy: boolean;
    popular: boolean;
  };
  setActiveFilters: React.Dispatch<
    React.SetStateAction<{
      vegetarian: boolean;
      spicy: boolean;
      popular: boolean;
    }>
  >;
  filteredItems: any[];
  isLoading: boolean;
  // Add the missing property
  menuCategories: string[];
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{
  children: React.ReactNode;
  value: MenuContextType;
}> = ({ children, value }) => {
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
