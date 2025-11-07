import React from "react";
import Image from "next/image";
import SignUpForm from "@/components/forms/SignUpForm";

export default function SignUpPage() {
  const handleSignUp = async (data: any) => {
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
        />
      </div>

      {/* Blurred overlay for better readability */}
      <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-black/70 via-black/50 to-red-950/60 pointer-events-none" />
      
      {/* Animated blob background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 opacity-12 blur-3xl w-36 sm:w-48 md:w-64 lg:w-80 h-36 sm:h-48 md:h-64 lg:h-80" 
          aria-hidden="true"
        />
      </div>
      
      <SignUpForm onSubmit={handleSignUp} />
    </section>
  );
}
