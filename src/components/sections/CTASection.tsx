// CTA Section Component
import React from "react";
import Button from "../ui/Button";

function CTASection() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-primary via-red-800 to-red-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in animate-delay-200ms">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 gradient-text">
            Ready to Start?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
            Join millions of viewers worldwide. Start your nonstop streaming today with
            access to our entire library.
          </p>
        </div>

        <div className="animate-fade-in animate-delay-400ms">
          <Button
            size="lg"
            onClick={() => console.log("Get Started clicked")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
