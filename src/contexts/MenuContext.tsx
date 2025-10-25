import React, { createContext, useContext } from "react";

interface MenuContextType {
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
  setActiveFilters: (filters: {
    vegetarian: boolean;
    spicy: boolean;
    popular: boolean;
  }) => void;
  filteredItems: any[];
  isLoading: boolean;
  menuCategories: string[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{
  children: React.ReactNode;
  value: MenuContextType;
}> = ({ children, value }) => {
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
};
