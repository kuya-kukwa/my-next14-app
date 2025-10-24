import React from "react";
import { cn } from "@/lib/utils";
import { ContainerProps } from "@/types";

const ContainerComponent = React.forwardRef<HTMLDivElement, ContainerProps & React.HTMLAttributes<HTMLDivElement>>(function ContainerComponent({
  maxWidth = "7xl",
  className,
  children,
  ...props
}, ref) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        maxWidthClasses[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ContainerComponent.displayName = "Container";

export const Container = React.memo(ContainerComponent);