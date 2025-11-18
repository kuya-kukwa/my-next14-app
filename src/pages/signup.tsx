import React from "react";
import SignUpForm from "@/components/forms/SignUpForm.mui";
import { useThemeContext } from "@/contexts/ThemeContext";
import GeometricPattern from "@/components/ui/illustrations/GeometricPattern";
import CirclePattern from "@/components/ui/illustrations/CirclePattern";

export default function SignUpPage() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <section
      className="py-16 sm:py-20 md:py-16 lg:py-20 animate-fadeInUp relative min-h-screen flex items-center justify-center overflow-hidden px-4"
    >
      {/* Theme-aware gradient background */}
      <div 
        className="absolute inset-0 -z-10 w-screen min-h-screen transition-colors duration-500"
        style={{
          background: isDark 
            ? 'radial-gradient(circle at bottom left, #2a0a0e 0%, #141414 50%, #1f1f1f 100%)'
            : 'radial-gradient(circle at bottom left, #ffe5e7 0%, #f5f5f5 50%, #ffffff 100%)'
        }}
      />

      {/* SVG Illustrations */}
      <GeometricPattern />
      <CirclePattern />

      {/* Decorative gradient orbs */}
      <div 
        className="absolute top-32 left-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, #e50914 0%, transparent 70%)'
            : 'radial-gradient(circle, #ff1a1f 0%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-32 right-32 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, #b20710 0%, transparent 70%)'
            : 'radial-gradient(circle, #e50914 0%, transparent 70%)'
        }}
      />
      
      <SignUpForm />
    </section>
  );
}
