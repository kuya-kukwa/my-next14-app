import React from "react";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/types";


const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(function ButtonComponent({
  variant = "cta",
  size = "md",
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}, ref) {
  const baseClasses = "btn font-semibold transition-all duration-300 rounded-sm inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black";

  const variantClasses = {
    cta: "btn-cta",
    ghost: "btn-ghost",
    outline: "btn-outline",
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs sm:text-sm min-w-[88px] sm:min-w-[120px]",
    md: "px-3.5 sm:px-5 py-2 sm:py-3 text-sm sm:text-base min-w-[104px] sm:min-w-[160px]",
    lg: "px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-w-[140px] sm:min-w-[200px]",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loading && "opacity-50 cursor-not-allowed",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={isDisabled}
      aria-label={props["aria-label"] || (loading ? "Loading..." : undefined)}
      aria-disabled={isDisabled ? "true" : "false"}
      {...props}
    >
      {loading && (
        <span
          className="animate-spin"
          aria-hidden="true"
          role="status"
        >
          ⟳
        </span>
      )}
      <span className={loading ? "opacity-70" : ""}>
        {children}
      </span>
    </button>
  );
});

ButtonComponent.displayName = "Button";

export default React.memo(ButtonComponent);
