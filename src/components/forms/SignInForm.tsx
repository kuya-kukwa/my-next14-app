"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Input, PasswordInput } from "../ui/Input";
import { FormFields, FormField, FormActions, FormDivider } from "../ui/FormField";
import { FormContainer } from "../ui/FormContainer";
import { SocialButton } from "../ui/SocialButton";
import Button from "../ui/Button";

type SignInFormData = {
  email: string;
  password: string;
};

export type SignInFormProps = {
  onSubmit?: (data: SignInFormData) => void | Promise<void>;
  className?: string;
};

export default function SignInForm({ onSubmit, className = "" }: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>();

  const handleFormSubmit = async (data: SignInFormData) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      console.log("Sign In Data:", data);
    }
  };

  return (
    <div className={className}>
      {/* Form Header */}
      <div className="mb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text leading-tight">
          Welcome Back
        </h1>
        <p className="text-lg text-gray-300">
          Sign in to continue your cinematic journey
        </p>
      </div>

      <FormContainer>
          
          {/* Form Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
              
              <FormFields>
                {/* Email */}
                <FormField>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    label="Email Address"
                    type="email"
                    placeholder="your.email@example.com"
                    error={errors.email?.message}
                    required
                  />
                </FormField>

                {/* Password */}
                <FormField>
                  <PasswordInput
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    required
                  />
                </FormField>
              </FormFields>

              {/* Forgot Password */}
              <div className="flex justify-end -mt-3">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-200 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <FormActions className="pt-2">
                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </FormActions>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <FormDivider text="Or continue with" />
            </div>

            {/* Google Sign In */}
            <div className="mt-4">
              <SocialButton provider="google" />
            </div>

            {/* Register Link */}
            <div className="mt-10 pt-8 border-t border-gray-700/30 text-center space-y-4">
              <p className="text-gray-300 text-sm">
                Don't have an account yet?
              </p>

              <Link href="/signup" className="block">
                <Button type="button" variant="outline" size="lg" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
      </FormContainer>
    </div>
  );
}
