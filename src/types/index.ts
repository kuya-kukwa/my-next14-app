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
  trailerKey?: string; // YouTube video ID
  trailerUrl?: string; // Full YouTube watch URL
  trailerEmbedUrl?: string; // YouTube embed URL
  trailerName?: string; // Trailer title
}

export interface User {
  $id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string | null;
  avatarFileId?: string | null;
  bio?: string | null;
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