import React from "react";
import Image from "next/image";
import SignInForm from "@/components/forms/SignInForm";

export default function SignInPage() {
  const handleSignIn = async (data: any) => {
    // Add your API call here
    console.log("Sign In Data:", data);
    alert("Sign in successful! Check console for data.");
  };

  return (
    <section
      className="py-16 sm:py-20 md:py-16 lg:py-20 animate-fadeInUp relative min-h-screen flex items-center justify-center overflow-hidden px-4"
    >
      {/* Background image handled by Next/Image for optimization */}
      <div className="absolute inset-0 -z-10 w-screen min-h-screen">
        <Image
          src="/images/signin/Untitled_design.png"
          alt="Sign in background"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1200px"
        />
      </div>

      {/* Enhanced overlay for better readability and reduced background competition */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/60 pointer-events-none" />

      <SignInForm onSubmit={handleSignIn} />
    </section>
  );
}