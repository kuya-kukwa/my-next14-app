import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input, PasswordInput } from "../ui/Input";
import { FormFields, FormField, FormActions } from "../ui/FormField";
import { FormContainer } from "../ui/FormContainer";
import Button from "../ui/Button";

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpFormProps = {
  onSubmit?: (data: SignUpFormData) => void | Promise<void>;
  className?: string;
};

export default function SignUpForm({ onSubmit, className = "" }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({ mode: "onChange" });

  const password = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const passwordsMatch = !!password && !!confirmPasswordValue && password === confirmPasswordValue;

  const handleFormSubmit = async (data: SignUpFormData) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      console.log("Sign Up Data:", data);
      // Default behavior - you can add API call here
    }
  };

  return (
    <div className={className}>
      {/* Form Header - Outside Container */}
      <div className="mb-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 gradient-text leading-tight">
          Join Us Today
        </h1>
        <p className="text-base sm:text-lg text-gray-300">
          Create your account and start your cinematic journey
        </p>
      </div>

      <FormContainer>
          {/* Form Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-0">
              <FormFields>
                <FormField>
                  <Input
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 4, message: "Name must be at least 4 characters" },
                    })}
                    label="Full Name"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    autoCapitalize="words"
                    autoCorrect="on"
                    spellCheck={true}
                    helperText="At least 4 characters."
                    error={errors.name?.message}
                    variant="filled"
                    required
                  />
                </FormField>

                <FormField>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    helperText="Use a valid email."
                    error={errors.email?.message}
                    variant="filled"
                    required
                  />
                </FormField>

                <FormField>
                  <PasswordInput
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Password must contain uppercase, lowercase, and number",
                      },
                    })}
                    label="Password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    showStrength
                    helperText="8+ chars with upper, lower, number."
                    error={errors.password?.message}
                    variant="filled"
                    required
                  />
                </FormField>

                <FormField>
                  <PasswordInput
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    helperText={passwordsMatch ? undefined : "Must match password."}
                    error={errors.confirmPassword?.message}
                    variant="filled"
                    required
                  />
                </FormField>
              </FormFields>

              <FormActions>
                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Creating Account..." : "Sign Up"}
                </Button>
              </FormActions>

            <div className="mt-10 text-center space-y-4">
              <p className="text-gray-300 text-sm">
                Already have an account?
              </p>
              <Link href="/signin" className="block">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </form>
          </div>
      </FormContainer>
    </div>
  );
}
