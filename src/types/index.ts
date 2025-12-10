// Data Types
export interface Movie {
  id: string; // changed to string UUID for Appwrite
  title: string;
  category: string;
  genre: string;
  year: number;
  rating: number;
  image: string;
  thumbnail: string;
  description?: string;
  duration?: number; // duration in minutes
  contentRating?: string; // e.g., 'PG-13', '18+', 'R', etc.
}

// Value Proposition Types
export interface ValueProp {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Component Base Types
export interface ComponentBaseProps {
  className?: string;
  children?: React.ReactNode;
}