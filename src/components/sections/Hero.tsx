import React from "react";
import { Container } from "../ui";
import Button from "../ui/Button";

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryAction?: string;
  secondaryAction?: string;
  children?: React.ReactNode;
}

export default function Hero({
  title,
  subtitle,
  primaryAction = "Get Started",
  secondaryAction = "Learn More",
  children,
}: HeroProps) {
  return (
    <section className="relative h-[100vh] sm:h-[110vh] md:min-h-screen flex items-center justify-center text-center overflow-hidden py-6 md:py-0 animate-fadeInUp">
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
      <Container className="relative z-10 animate-fadeInUp text-center max-w-4xl px-4">
        {children ?? (
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 gradient-text leading-tight">
              {title ?? "🎬 Stream Without Limits"}
            </h1>

            <p className="text-gray-300 max-w-xs sm:max-w-md md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8 lg:mb-10 px-2">
              {subtitle ?? "Unlimited entertainment at your fingertips. Watch thousands of movies and shows, anytime, anywhere."}
            </p>

            <div className="flex flex-row flex-nowrap gap-3 sm:gap-4 md:gap-6 justify-center items-center px-4">
              <Button variant="cta" size="sm" className="min-w-[110px] sm:min-w-[140px] md:min-w-[160px]">{primaryAction}</Button>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
