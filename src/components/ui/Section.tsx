import React from "react";
import { cn } from "@/lib/utils";
import { SectionProps } from "@/types";

const paddingMap = {
  sm: "py-8 sm:py-12",
  md: "py-12 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-20 lg:py-24",
};

const backgroundMap = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  gradient: "bg-gradient-to-br from-primary/20 to-black",
};

const SectionComponent = React.forwardRef<HTMLElement, SectionProps & { container?: boolean } & React.HTMLAttributes<HTMLElement>>(function SectionComponent({
  padding = "md",
  background = "primary",
  container = true,
  className,
  children,
  ...props
}, ref) {
  const SectionContent = (
    <div
      className={cn(
        paddingMap[padding],
        backgroundMap[background],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  if (container) {
    return (
      <section ref={ref}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {SectionContent}
        </div>
      </section>
    );
  }

  return <section ref={ref}>{SectionContent}</section>;
});

SectionComponent.displayName = "Section";

export const Section = React.memo(SectionComponent);