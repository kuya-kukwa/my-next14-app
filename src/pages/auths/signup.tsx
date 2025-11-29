import React from 'react';
import SignUpForm from '@/components/forms/SignUpForm';

export default function SignUpPage() {
  return (
    <section className="py-16 sm:py-20 md:py-16 lg:py-20 animate-fadeInUp relative flex items-center justify-center overflow-hidden px-4">
      {/* Theme-aware gradient background */}
      <div className="absolute inset-0 -z-10 w-screen transition-colors duration-500 auth-gradient-bg" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-32 left-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none orb-gradient" />
      <div className="absolute bottom-32 right-32 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none orb-gradient" />

      <SignUpForm />
    </section>
  );
}
