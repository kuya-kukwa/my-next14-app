import React from "react";
import { Container } from "../ui";
import CTASection from "./CTASection";
interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryAction?: string;
  secondaryAction?: string;
  children?: React.ReactNode;
}

export default function Hero({
 
  children,
}: HeroProps) {
  return (
    <section className="relative h-[100vh] sm:h-[110vh] md:min-h-screen flex items-center justify-center text-center overflow-hidden py-6 md:py-0">
      {/* Video background - using public/video/hero.mp4 */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src="/video/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster=""
        aria-hidden="true"
      />

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-primary/90" />
      <div className="absolute inset-0 bg-primary/8 mix-blend-overlay" />

      {/* Content (children takes priority) */}
      <Container className="relative z-10 text-center max-w-4xl px-4">
        {children ?? (
          <>
            
            <CTASection/>
          </>
        )}
      </Container>
    </section>
  );
}
