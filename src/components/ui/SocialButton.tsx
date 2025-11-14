import React from "react";
import { cn } from "@/lib/utils";

export interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "google" | "facebook" | "apple" | "github";
  children?: React.ReactNode;
}

const providerConfig = {
  google: {
    label: "Continue with Google",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24"
        height="24"
        className="flex-shrink-0"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
    ),
  },
  facebook: {
    label: "Continue with Facebook",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
          fill="#1877F2"
        />
      </svg>
    ),
  },
  apple: {
    label: "Continue with Apple",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
  },
  github: {
    label: "Continue with GitHub",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
};

/**
 * SocialButton - Consistent button for social authentication
 * Supports Google, Facebook, Apple, and GitHub
 */
export const SocialButton = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ provider, children, className, ...props }, ref) => {
    const config = providerConfig[provider];

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          // Base styles
          "w-full flex justify-center items-center gap-3",
          "rounded-xl font-medium text-sm",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black",
          // Dark theme consistency
          "bg-black/50 border-2 border-white/20",
          "text-white",
          "shadow-md",
          // Padding
          "px-6 py-4",
          // Hover effects
          "hover:bg-black/70 hover:border-white/30 hover:shadow-lg",
          "hover:scale-[1.02] active:scale-[0.98]",
          // Group for icon animation
          "group",
          className
        )}
        {...props}
      >
        <span className="group-hover:scale-110 transition-transform duration-200">
          {config.icon}
        </span>
        <span className="font-semibold">{children || config.label}</span>
      </button>
    );
  }
);

SocialButton.displayName = "SocialButton";
