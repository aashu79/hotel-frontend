export interface MenuCategory {
  id: number;
  name: string;
  description?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
