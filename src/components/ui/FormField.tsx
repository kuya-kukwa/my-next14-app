import React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

/**
 * FormField - Consistent spacing wrapper for form inputs
 * Ensures uniform vertical spacing between form fields
 */
export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, className, spacing = 'md' }, ref) => {
    const spacingClasses = {
      sm: 'mb-4',
      md: 'mb-6',
      lg: 'mb-8',
    };

    return (
      <div ref={ref} className={cn(spacingClasses[spacing], className)}>
        {children}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export interface FormFieldsProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FormFields - Container for multiple form fields
 * Provides consistent spacing between field groups
 */
export const FormFields = React.forwardRef<HTMLDivElement, FormFieldsProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-6", className)}>
        {children}
      </div>
    );
  }
);

FormFields.displayName = "FormFields";

export interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'stretch';
}

/**
 * FormActions - Container for form action buttons
 * Provides consistent spacing and alignment for form buttons
 */
export const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ children, className, align = 'stretch' }, ref) => {
    const alignClasses = {
      left: 'flex justify-start',
      center: 'flex justify-center',
      right: 'flex justify-end',
      stretch: 'flex flex-col',
    };

    return (
      <div ref={ref} className={cn("mt-8 gap-3", alignClasses[align], className)}>
        {children}
      </div>
    );
  }
);

FormActions.displayName = "FormActions";

export interface FormDividerProps {
  text?: string;
  className?: string;
}

/**
 * FormDivider - Consistent divider with optional text
 * Used to separate form sections (e.g., "Or continue with")
 */
export const FormDivider = React.forwardRef<HTMLDivElement, FormDividerProps>(
  ({ text, className }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-4 my-8", className)}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        {text && (
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider px-2">
            {text}
          </span>
        )}
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
      </div>
    );
  }
);

FormDivider.displayName = "FormDivider";
