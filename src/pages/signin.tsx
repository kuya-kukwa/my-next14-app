import React from "react";
import SignInForm from "@/components/forms/SignInForm.mui";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function SignInPage() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <section
      className="animate-fadeInUp relative min-h-screen flex items-center justify-center overflow-hidden px-4"
    >
      {/* Theme-aware gradient background */}
      <div 
        className="absolute inset-0 -z-10 w-screen min-h-screen transition-colors duration-500"
        style={{
          background: isDark 
            ? 'radial-gradient(circle at bottom left, #2a0a0e 0%, #141414 50%, #1f1f1f 100%)'
            : 'radial-gradient(circle at bottom left, #fff5f5 0%, #f8f9fa 50%, #ffffff 100%)'
        }}
      />


      {/* Decorative gradient orbs */}
      <div 
        className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, #e50914 0%, transparent 70%)'
            : 'radial-gradient(circle, #ff1a1f 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, #b20710 0%, transparent 70%)'
            : 'radial-gradient(circle, #e50914 0%, transparent 70%)'
        }}
      />

      <SignInForm />
    </section>
  );
}