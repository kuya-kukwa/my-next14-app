// CTA Section Component
import React from "react";
import Button from "../ui/Button";
import { useThemeContext } from "@/contexts/ThemeContext";

function CTASection() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <section 
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden transition-all duration-500"
    >
      {/* Background Effects */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)'
        }}
      />

      {/* Animated decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-2xl animate-pulse" 
        style={{
          background: isDark ? 'rgba(229, 9, 20, 0.15)' : 'rgba(255, 26, 31, 0.1)'
        }}
      />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-2xl animate-pulse animation-delay-2000"
        style={{
          background: isDark ? 'rgba(229, 9, 20, 0.15)' : 'rgba(255, 26, 31, 0.1)'
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float"
            style={{
              backgroundColor: isDark ? 'rgba(229, 9, 20, 0.3)' : 'rgba(255, 26, 31, 0.25)'
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Radial glow effects */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-3xl animate-glow"
        style={{
          background: isDark ? 'rgba(229, 9, 20, 0.08)' : 'rgba(255, 26, 31, 0.06)'
        }}
      />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl animate-glow animation-delay-2000"
        style={{
          background: isDark ? 'rgba(229, 9, 20, 0.08)' : 'rgba(255, 26, 31, 0.06)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in animate-delay-200ms">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 drop-shadow-lg"
            style={{
              color: isDark ? '#ffffff' : '#0a0a0a'
            }}
          >
            Ready to Start?
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed drop-shadow-md"
            style={{
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 10, 10, 0.8)'
            }}
          >
            Join millions of viewers worldwide. Start your nonstop streaming today with
            access to our entire library.
          </p>
        </div>

        <div className="animate-fade-in animate-delay-400ms flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => console.log("Get Started clicked")}
            className="transform hover:scale-105 transition-transform duration-300 shadow-2xl"
          >
            Get Started
          </Button>
          <button
            className="px-8 py-3 font-semibold border-2 rounded-lg transition-all duration-300 backdrop-blur-sm"
            style={{
              color: isDark ? '#ffffff' : '#0a0a0a',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(10, 10, 10, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(229, 9, 20, 0.1)';
              e.currentTarget.style.borderColor = isDark ? '#ffffff' : '#e50914';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(10, 10, 10, 0.3)';
            }}
            onClick={() => console.log("Learn More clicked")}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
