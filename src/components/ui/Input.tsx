import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'filled',
      inputSize = 'md',
      leftIcon,
      rightIcon,
      className,
      id,
      type = "text",
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${props.name}`;

    // Base classes for all inputs
    const baseClasses = cn(
      "w-full rounded-lg transition-all duration-300",
      "focus:outline-none focus:ring-2",
      "placeholder:text-white/50",
      disabled && "opacity-50 cursor-not-allowed"
    );

    // Variant styles
    const variantClasses = {
      filled: cn(
        "bg-white/10 backdrop-blur-md border-2 border-white/40",
        "text-white",
        "hover:bg-white/15 hover:border-white/50",
        "focus:bg-white/15 focus:border-red-500 focus:ring-red-500/50",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/50"
      ),
      outlined: cn(
        "bg-white/95 border-2 border-gray-300 text-gray-900",
        "hover:border-gray-400",
        "focus:border-red-500 focus:ring-red-500/50",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/50"
      ),
    };

    // Size styles
    const sizeClasses = {
      sm: cn("px-3 py-2 text-sm", leftIcon && "pl-9", rightIcon && "pr-9"),
      md: cn("px-4 py-3 text-sm", leftIcon && "pl-10", rightIcon && "pr-10"),
      lg: cn("px-5 py-4 text-base", leftIcon && "pl-12", rightIcon && "pr-12"),
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 mb-2 ml-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[inputSize],
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div 
              className="absolute top-1/2 -translate-y-1/2 text-white/60 z-10"
              style={{ right: '12px', left: 'auto' }}
            >
              {rightIcon}
            </div>
          )}
        </div>


      </div>
    );
  }
);

Input.displayName = "Input";

// Password Input Component
export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        {...props}
        ref={ref}
        type={showPassword ? "text" : "password"}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-white/10 -mr-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        }
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
