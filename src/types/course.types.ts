export interface Course {
  id: number;
  title: string;
  description?: string; // FIXED: Made optional to match schema
  price: number;
  category: string;
  thumbnail: string;
  stock: number; // Represents available slots
  rating: number;
  // Audit Trail
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}