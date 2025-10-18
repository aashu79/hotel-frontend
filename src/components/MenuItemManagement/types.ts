export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  prepTimeMins?: number;
  sortOrder?: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: number;
  name: string;
}

export interface MenuItemFormData {
  name: string;
  description?: string | null;
  price: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  prepTimeMins?: number | null;
  sortOrder?: number | null;
  categoryId: number;
  image?: File;
}
