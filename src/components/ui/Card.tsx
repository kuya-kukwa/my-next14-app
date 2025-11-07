import React from "react";
import { cn } from "@/lib/utils";
import { CardProps } from "@/types";

const CardComponent = React.forwardRef<HTMLDivElement, CardProps & React.HTMLAttributes<HTMLDivElement>>(function CardComponent({
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}, ref) {
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
        "container-query rounded-md border border-white/10 bg-black/30 backdrop-blur-sm",
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardComponent.displayName = "Card";

export const Card = React.memo(CardComponent);