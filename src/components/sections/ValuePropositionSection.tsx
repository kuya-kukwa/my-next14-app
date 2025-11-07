import React from "react";
import ValueCard from "@/components/ui/ValueCard";
import { valueProps } from "@/data/values";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type Props = {
  visible?: boolean;
};

export default function ValuePropositionSection({ visible = false }: Props) {
  return (
  <Section className={`py-8 sm:py-12 md:py-16 lg:py-20 bg-transparent ${visible ? "animate-fadeInUp" : ""}`}>
      <Container>
        {/* Gradient overlay - positioned inside container for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 pointer-events-none -z-10" />
        
        <div className="relative z-10 text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 gradient-text">
            Why Choose NextFlix?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Various reasons make NextFlix the best choice for your streaming needs
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {valueProps.map((item) => (
            <ValueCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
