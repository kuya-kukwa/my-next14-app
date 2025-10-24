import React from "react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

interface ValueCardProps {
  icon: string;
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
  return (
    <Card
      ref={ref}
      variant="hover"
      padding="sm"
      className={cn("text-center group cq-text-sm cq-padding-xs", className)}
      {...props}
    >
      <div className="text-3xl mb-2 transition-transform group-hover:scale-110 duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-accent mb-2 cq-text-base">{title}</h3>
      <p className="text-muted text-sm leading-relaxed cq-text-sm">{description}</p>
    </Card>
  );
});

ValueCardComponent.displayName = "ValueCard";

export default React.memo(ValueCardComponent);
