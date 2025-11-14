import React from "react";
import Image from "next/image";
import SignUpForm from "@/components/forms/SignUpForm";

type SignUpData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const handleSignUp = async (data: SignUpData) => {
    // Add your API call here
    console.log("Sign Up Data:", data);
    alert("Account created successfully! Check console for data.");
  };

  return (
    <section
      className="py-16 sm:py-20 md:py-16 lg:py-20 animate-fadeInUp relative min-h-screen flex items-center justify-center overflow-hidden px-4"
    >
      {/* Background image handled by Next/Image for optimization */}
      <div className="absolute inset-0 -z-10 w-screen min-h-screen">
        <Image
          src="/images/signin/Untitled_design.png"
          alt="Sign up background"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1200px"
          priority
        />
      </div>

      {/* Enhanced overlay for better readability and reduced background competition */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/60 pointer-events-none" />
      
      <SignUpForm onSubmit={handleSignUp} />
    </section>
  );
}
