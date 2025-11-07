import React from "react";

export type TextInputProps = {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url";
  error?: string;
  className?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      name,
      label,
      placeholder,
      type = "text",
      error,
      className = "",
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${name}`;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-lg border-2 px-4 py-3 text-sm bg-white/10 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white/15 placeholder:text-white/50 backdrop-blur-md ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
              : "border-white/40 hover:border-white/50 focus:border-red-500 focus:ring-red-500/50"
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
