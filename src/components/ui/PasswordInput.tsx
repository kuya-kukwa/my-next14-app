import { useState, forwardRef, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

export type PasswordInputProps = {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id,
      name,
      label,
      placeholder = "Password",
      error,
      className = "",
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${name}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white/90 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={`w-full rounded-xl border-2 px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 ${className} ${
              error 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/50" 
                : "border-red-500/60 hover:border-red-500/70 focus:border-red-500 focus:ring-red-500/50"
            }`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
            
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-200/50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";