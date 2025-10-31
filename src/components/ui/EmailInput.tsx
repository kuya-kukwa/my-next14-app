import React from "react";

export type EmailInputProps = {
  id?: string;
  ariaLabel?: string;
  label?: React.ReactNode;
  buttonText?: React.ReactNode;
  className?: string;
  onSubmit?: (email: string) => void;
};

const EmailInput = React.forwardRef<HTMLDivElement, EmailInputProps>(
  (
    {
      id = "hero-email-form",
      ariaLabel = "Email capture",
      label = "you@example.com",
      buttonText = "Get Started",
      className = "",
      onSubmit,
    },
    ref
  ) => {
    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const validate = (value: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    };

    const handleSubmit = async () => {
      const val = email.trim();
      if (!validate(val)) {
        setError("Please enter a valid email address.");
        return;
      }
      setError(null);
      setIsSubmitting(true);
      try {
        await (onSubmit ? onSubmit(val) : Promise.resolve());
        setEmail("");
      } catch {
        setError("Submission failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    const clear = () => {
      setEmail("");
      setError(null);
    };

    return (
      <div
        ref={ref}
        id={id}
        aria-label={ariaLabel}
        className={`w-full max-w-md ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 backdrop-blur-sm bg-white/5 p-2 rounded-xl border border-white/10 shadow-2xl">
          <label htmlFor={`${id}-input`} className="sr-only">
            {typeof label === "string" ? label : "Email address"}
          </label>

          <div className="flex-1 relative">
            <input
              id={`${id}-input`}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-lg border-2 border-transparent px-4 py-3 text-sm bg-white/10 text-white transition-all duration-200 focus:outline-none focus:border-red-500 focus:bg-white/15 placeholder:text-white/50 backdrop-blur-md"
              placeholder={typeof label === "string" ? label : "Enter your email"}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
            />

            {email && (
              <button
                type="button"
                aria-label="Clear email"
                onClick={clear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xl font-light transition-colors"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-red-600/30 hover:shadow-red-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⟳</span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>{buttonText}</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="m15.59 12-7.3 7.3 1.42 1.4 8-8a1 1 0 0 0 0-1.4l-8-8-1.42 1.4z" fill="currentColor" />
                </svg>
              </>
            )}
          </button>
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="mt-3 text-sm text-red-400 text-center animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);

export { EmailInput };

EmailInput.displayName = "EmailInput";