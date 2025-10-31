// CTA Section Component
import React from "react";
import { EmailInput } from "@/components/ui/EmailInput";

function CTASection() {
  const handleSubmit = async (email: string) => {
    console.log("CTA email submitted:", email);
    await new Promise((res) => setTimeout(res, 300));
    alert(`Thanks — we'll send details to ${email}`);
  };

  return (
    <section className="relative min-h-[10vh] sm:min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* left blob (smaller on small screens) */}
        <div
          className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 opacity-12 blur-3xl
                     w-36 sm:w-48 md:w-64 lg:w-80 h-36 sm:h-48 md:h-64 lg:h-80"
          aria-hidden="true"
        />
        {/* right blob (smaller on small screens) */}
        <div
          className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 rounded-full bg-purple-600 opacity-12 blur-3xl
                     w-36 sm:w-48 md:w-64 lg:w-80 h-36 sm:h-48 md:h-64 lg:h-80 animate-delay-1s"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-red-400 bg-clip-text text-transparent leading-tight">
            Ready to Start?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
            Join millions of viewers worldwide. Start your free trial today with
            access to our entire library.
          </p>
        </div>

        <div className="flex justify-center animate-fade-in animate-delay-200ms">
          <EmailInput onSubmit={handleSubmit} />
        </div>

      </div>

    </section>
  );
}

export default CTASection;
