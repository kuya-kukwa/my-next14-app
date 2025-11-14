import React from "react";

export type TextAreaProps = {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      id,
      name,
      label,
      placeholder,
      error,
      className = "",
      required = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${name}`;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-white/90 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          placeholder={placeholder}
          className={`w-full rounded-sm focus:rounded-sm border-2 px-4 py-3 text-sm bg-white/10 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-white/15 placeholder:text-white/50 backdrop-blur-md resize-none ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
              : "border-red-500/60 hover:border-red-500/70 focus:border-red-500 focus:ring-red-500/50"
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        
        {/* Error Message */}
        {error && (
          <p id={`${textareaId}-error`} className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
