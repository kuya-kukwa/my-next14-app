import React from "react";
import { cn } from "@/lib/utils";
import { IconProps } from "@/types";

// Simple icon mapping - you can expand this with more icons
const iconMap = {
  play: "▶",
  pause: "⏸",
  star: "⭐",
  heart: "❤️",
  search: "🔍",
  menu: "☰",
  close: "✕",
  chevronLeft: "‹",
  chevronRight: "›",
  check: "✓",
  arrowRight: "→",
  eye : "👁",
};

const IconComponent = React.forwardRef<HTMLSpanElement, IconProps & React.HTMLAttributes<HTMLSpanElement>>(function IconComponent({
  name,
  size = "md",
  color,
  className,
  ...props
}, ref) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const iconChar = (iconMap as Record<string, string>)[name] || "?";

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center",
        sizeClasses[size],
        color && `text-${color}`,
        className
      )}
      {...props}
    >
      {iconChar}
    </span>
  );
});

IconComponent.displayName = "Icon";

export const Icon = React.memo(IconComponent);