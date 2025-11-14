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
      className = "",
      onSubmit,
    },
    ref
  ) => {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

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
      try {
        await (onSubmit ? onSubmit(val) : Promise.resolve());
        setEmail("");
      } catch {
        setError("Submission failed. Please try again.");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    return (
      <div
        ref={ref}
        id={id}
        aria-label={ariaLabel}
        className={`w-full max-w-md ${className}`}
      >
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 backdrop-blur-sm bg-white/5 p-2 rounded-md border-2 border-red-500/60 shadow-2xl">
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
  className="
    w-full 
    rounded-xl
    border-2 border-red-500/60 
    hover:border-red-500/70 
    focus:border-red-500  
    focus:ring-2 focus:ring-red-500/40
    px-4 py-3 pr-10 
    text-sm 
    bg-white/10 text-white 
    transition-all duration-300 
    focus:outline-none 
    focus:bg-white/15 
    placeholder:text-white/50 
    backdrop-blur-md
  "
  placeholder={typeof label === "string" ? label : "Enter your email"}
  aria-invalid={!!error}
  aria-describedby={error ? `${id}-error` : undefined}
/
>

            
          </div>
        </div>
      </div>
    );
  }
);

export { EmailInput };

EmailInput.displayName = "EmailInput";