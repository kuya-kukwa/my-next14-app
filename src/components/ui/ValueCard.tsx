import React from "react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/contexts/ThemeContext";

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const ValueCardComponent = React.forwardRef<HTMLDivElement, ValueCardProps>(({
  icon,
  title,
  description,
  className,
  ...props
}, ref) => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <Card
      ref={ref}
      variant="hover"
      padding="sm"
      className={cn("text-center group cq-text-sm cq-padding-xs transition-colors duration-500", className)}
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
      }}
      {...props}
    >
      <div className="text-3xl mb-2 transition-transform group-hover:scale-110 duration-300">
        {icon}
      </div>
      <h3 
        className="text-lg font-semibold mb-2 cq-text-base transition-colors duration-500"
        style={{
          color: isDark ? '#e50914' : '#b20710'
        }}
      >
        {title}
      </h3>
      <p 
        className="text-sm leading-relaxed cq-text-sm transition-colors duration-500"
        style={{
          color: isDark ? '#b3b3b3' : '#616161'
        }}
      >
        {description}
      </p>
    </Card>
  );
});

ValueCardComponent.displayName = "ValueCard";

export default React.memo(ValueCardComponent);
