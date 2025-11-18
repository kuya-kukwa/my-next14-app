import React from "react";
import { Container } from "../ui";
import CTASection from "./CTASection";
import { useThemeContext } from "@/contexts/ThemeContext";
import WaveBackground from "../ui/illustrations/WaveBackground";
import CirclePattern from "../ui/illustrations/CirclePattern";
import MovieIllustration from "../ui/illustrations/MovieIllustration";
import FloatingElements from "../ui/illustrations/FloatingElements";
import SpotlightEffect from "../ui/illustrations/SpotlightEffect";
import ParticleEffect from "../ui/illustrations/ParticleEffect";

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
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <section className="relative h-[100vh] sm:h-[110vh] md:min-h-screen flex items-center justify-center text-center overflow-hidden py-6 md:py-0">
      {/* Enhanced theme-aware gradient background */}
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 30%, #2a0a0e 70%, #1a0505 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 30%, #ffe5e7 70%, #ffd5d7 100%)'
        }}
      />

      {/* Spotlight and particle effects */}
      <SpotlightEffect />
      <ParticleEffect />

      {/* SVG Illustrations */}
      <WaveBackground />
      <CirclePattern />
      <MovieIllustration />
      <FloatingElements />

      {/* Animated gradient orbs for depth */}
      <div className="absolute top-20 left-20 w-80 h-80 rounded-full blur-3xl opacity-25 animate-blob"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(229, 9, 20, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 26, 31, 0.3) 0%, transparent 70%)'
        }}
      />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-25 animate-blob animation-delay-2000"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(178, 7, 16, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(229, 9, 20, 0.3) 0%, transparent 70%)'
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-15 animate-blob animation-delay-4000"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 140, 0, 0.2) 0%, transparent 70%)'
        }}
      />

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
