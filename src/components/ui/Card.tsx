import React from "react";
import { cn } from "@/lib/utils";
import { CardProps } from "@/types";
import { useThemeContext } from "@/contexts/ThemeContext";

const CardComponent = React.forwardRef<HTMLDivElement, CardProps & React.HTMLAttributes<HTMLDivElement>>(function CardComponent({
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}, ref) {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  
  const variantClasses = {
    default: "card-hover",
    hover: "card-hover",
    elevated: "card-hover shadow-lg",
  };

  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "container-query rounded-md border backdrop-blur-sm transition-all duration-500",
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      style={{
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.7)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }}
      {...props}
    >
      {children}
    </div>
  );
});

CardComponent.displayName = "Card";

export const Card = React.memo(CardComponent);