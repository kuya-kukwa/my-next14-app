import { useState, forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  hideHelperWhenValid?: boolean; // hide helper when field is filled and has no error
  showHelperOnFocusOnly?: boolean; // show helper only when input is focused (minimalist)
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
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
      hideHelperWhenValid = true,
      showHelperOnFocusOnly = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState<boolean>(
      String((props.value as unknown as string | number | undefined) ?? (props.defaultValue as unknown as string | number | undefined) ?? '').length > 0
    );
    const inputId = id || `input-${props.name}`;

    // Base classes for all inputs
    // use a small radius by default and keep a small radius on focus so the
    // focus border looks tighter (less rounded)
    const baseClasses = cn(
      "w-full rounded-sm focus:rounded-sm transition-all duration-300",
      "focus:outline-none focus:ring-2",
      "placeholder:text-white/50",
      disabled && "opacity-50 cursor-not-allowed"
    );

    // Variant styles
    const variantClasses = {
      filled: cn(
        "bg-white/10 backdrop-blur-md border-2 border-red-500/60",
        "text-white",
        "hover:bg-white/15 hover:border-red-500/70",
        "focus:bg-white/15 focus:border-red-500 focus:ring-2 focus:ring-red-600",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/50"
      ),
      outlined: cn(
        "bg-white/95 border-2 border-gray-300 text-gray-900",
        "hover:border-gray-400",
        "focus:border-primary focus:ring-2 focus:ring-red-600",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
        isFocused && !error && "border-primary ring-2 ring-red-600"
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
            className="block text-sm font-medium text-white/90 mb-2 ml-1"
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
            onChange={(e) => {
              setHasContent((e.target as HTMLInputElement).value?.length > 0);
              props.onChange?.(e);
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

        {/* Error Message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-[13px] text-red-400 flex items-start gap-2"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {(() => {
          // Show helper when:
          // - there's helperText
          // - no error
          // - if showHelperOnFocusOnly => only when focused
          // - hideHelperWhenValid hides when filled, BUT NOT while focused
          const passesFocusRule = showHelperOnFocusOnly ? isFocused : true;
          const passesHideWhenValidRule = hideHelperWhenValid ? (!hasContent || isFocused) : true;
          const shouldShowHelper = Boolean(helperText) && !error && passesFocusRule && passesHideWhenValidRule;

          if (!shouldShowHelper) return null;

          return (
            <p
              id={`${inputId}-helper`}
              className={cn(
                "mt-1.5 text-[12px] transition-colors",
                isFocused ? "text-white/85" : "text-white/70"
              )}
              role="note"
              aria-live="polite"
            >
              {helperText}
            </p>
          );
        })()}

      </div>
    );
  }
);

Input.displayName = "Input";


// Password Input Component
export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showStrength?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = false, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [pwdValue, setPwdValue] = useState("");

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      setPwdValue(e.target.value ?? "");
      onChange?.(e);
    };

    const scorePassword = (value: string) => {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[a-z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      return Math.min(score, 5);
    };

    const strength = scorePassword(pwdValue);
    const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][
      Math.max(0, strength - 1)
    ] || "Very weak";
    const strengthColor = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-emerald-500",
    ][Math.max(0, strength - 1)] || "bg-red-500";

    return (
      <div className="w-full">
        <Input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          onChange={handleChange}
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

        {showStrength && (
          <div className="mt-2" aria-live="polite">
            <div className="h-1 w-full bg-white/10 rounded">
              <div
                className={`h-1 rounded ${strengthColor}`}
                style={{ width: `${(strength / 5) * 100}%` }}
                aria-hidden
              />
            </div>
            <p className="mt-1.5 text-[12px] text-white/70">Password strength: {strengthLabel}</p>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

