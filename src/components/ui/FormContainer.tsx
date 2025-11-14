import React from "react";
import { cn } from "@/lib/utils";

export interface FormContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FormContainer - Shared container for authentication forms
 * Provides consistent background effects, borders, and animations
 */
export const FormContainer = React.forwardRef<HTMLDivElement, FormContainerProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles with responsive width constraints
          "relative w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto",
          // Reduced border radius for cinema streaming aesthetic
          "rounded-xl",
          // Border with glass effect - modern 2px border
          "border-2 border-red-500/60",
          // Softer shadows for natural depth
          "shadow-xl shadow-black/30",
          // Responsive Padding
          "p-4 sm:p-6 md:p-8 lg:p-10",
          // Smooth transitions
          "transition-all duration-500",
          // Glass effect - increased opacity for better readability
          "bg-white/[0.08] backdrop-blur-[20px]",
          className
        )}
      >
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-40 w-80 h-80 bg-red-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-red-950/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(229,9,20,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

          {/* Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,9,20,0.15),transparent_50%)]" />
        </div>

        {/* Content */}
        <div className="relative z-20">{children}</div>
      </div>
    );
  }
);

FormContainer.displayName = "FormContainer";

export interface FormHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

/**
 * FormHeader - Consistent header for authentication forms
 */
export const FormHeader = React.forwardRef<HTMLDivElement, FormHeaderProps>(
  ({ title, subtitle, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3 mb-8", className)}>
        <h2 className="font-bold text-4xl md:text-5xl text-white tracking-tight">
          {title}
        </h2>
        <p className="text-base text-gray-400">{subtitle}</p>
      </div>
    );
  }
);

FormHeader.displayName = "FormHeader";

export interface FormImageSectionProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  className?: string;
}
