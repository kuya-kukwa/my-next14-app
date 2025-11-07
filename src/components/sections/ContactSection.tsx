import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactSection() {
  return (
  <Section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-transparent">
      <Container>
        {/* Gradient overlay - positioned inside container for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 pointer-events-none -z-10" />
        
        <div className="relative z-10 text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 gradient-text">
            Get In Touch
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Have a question or need help? We're here to assist you.
          </p>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border-3 border-red-500/80 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
