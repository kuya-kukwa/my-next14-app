// Data Types
export interface Movie {
  id: number;
  title: string;
  category: string;
  genre: string;
  year: number;
  rating: number;
  image: string;
  thumbnail: string;
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

// Button Component Types
export interface ButtonProps extends ComponentBaseProps {
  variant?: 'cta' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

// Section Component Types
export interface SectionProps extends ComponentBaseProps {
  padding?: 'sm' | 'md' | 'lg';
  background?: 'primary' | 'secondary' | 'gradient';
  container?: boolean;
}

// Container Component Types
export interface ContainerProps extends ComponentBaseProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
}

// Card Component Types
export interface CardProps extends ComponentBaseProps {
  variant?: 'default' | 'hover' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
}

// Icon Component Types
export interface IconProps extends ComponentBaseProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

// Form Component Types
export interface InputProps extends ComponentBaseProps {
  type?: 'text' | 'email' | 'password' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}
 
// Team Member Types
export interface TeamMember extends ComponentBaseProps {
    id: number;
    name: string;
    role: string;
    avatar: string;
    bio: string;
  /** Optional CSS object-position value to control focal point of avatar images (e.g. 'center 30%') */
  objectPosition?: string;
  
}