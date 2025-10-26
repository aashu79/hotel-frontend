export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  locationId?: string; // Add this
  createdAt: string;
  updatedAt: string;
}

// ...existing code...
