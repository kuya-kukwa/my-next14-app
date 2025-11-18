import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import Button from "../ui/Button";
import { contactSchema, type ContactInput } from "@/lib/validation";

export type ContactFormProps = {
  onSubmit?: (data: ContactInput) => void | Promise<void>;
  className?: string;
};

export default function ContactForm({ onSubmit, className = "" }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), mode: "onChange" });

  const [serverError, setServerError] = useState<string | null>(null);

  const handleFormSubmit = async (data: ContactInput) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      setServerError(null);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ? JSON.stringify(body.error) : "Failed to send message");
        }
      } catch (e: any) {
        setServerError(e?.message ?? "Something went wrong");
        return;
      }
    }
    reset(); // Clear form after successful submission
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`space-y-6 w-full max-w-xl mx-auto ${className}`}
    >
      {serverError && (
        <div className="p-4 rounded-md bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
          {serverError}
        </div>
      )}
      {isSubmitSuccessful && (
        <div className="p-4 rounded-md bg-green-500/20 border border-green-500/50 text-green-400 text-sm">
          ✓ Thank you! Your message has been sent successfully. We&rsquo;ll get back to you soon.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" },
          })}
          label="Full Name"
          placeholder="Enter your full name"
          autoComplete="name"
          error={errors.name?.message}
          required
        />

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
          error={errors.email?.message}
          required
        />
      </div>

      <Input
        {...register("subject", {
          required: "Subject is required",
          minLength: { value: 3, message: "Subject must be at least 3 characters" },
        })}
        label="Subject"
        placeholder="Enter message subject"
        autoComplete="off"
        error={errors.subject?.message}
        required
      />

      <TextArea
        {...register("message", {
          required: "Message is required",
          minLength: { value: 10, message: "Message must be at least 10 characters" },
        })}
        label="Message"
        placeholder="Tell us how we can help you..."
        rows={6}
        error={errors.message?.message}
        required
      />

      <Button
        type="submit"
        variant="cta"
        size="md"
        className="w-full md:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
