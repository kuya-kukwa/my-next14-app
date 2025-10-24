import React, { useState, useEffect } from "react";
import Hero from "@/components/sections/Hero";
import ValueCard from "@/components/ui/ValueCard";
import MovieCarousel from "@/components/ui/MovieCarousel";
import CTASection from "@/components/sections/CTASection";
import { movies, valueProps } from "@/data/movies";

export default function Home() {
  const [visibleSections, setVisibleSections] = useState({
    hero: true,
    valueProps: false,
    featured: false,
    cta: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      setVisibleSections({
        hero: true,
        valueProps: scrollY > windowHeight * 0.2,
        featured: true,
        cta: scrollY > windowHeight * 1.2,
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const topMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 15);

  return (
    <>
      {/* HERO SECTION */}
      <Hero
        title="Stream Without Limits"
        subtitle="Unlimited entertainment at your fingertips."
        primaryAction="▶ Start Watching"
      />

      {/* TOP MOVIES SECTION */}
      {visibleSections.featured && (
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#0a0a0a] animate-fadeInUp overflow-visible">
          <div className="container mx-auto px-2 sm:px-4 md:px-6 overflow-visible">
            <MovieCarousel movies={topMovies} title="Trending Now" />
          </div>
        </section>
      )}

      {/* VALUE PROPOSITION SECTION */}
      {visibleSections.valueProps && (
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[#0a0a0a] animate-fadeInUp">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 gradient-text">
                Why Join NextFlix?
              </h2>
              <p className="text-muted max-w-xs sm:max-w-xl mx-auto text-sm sm:text-base md:text-lg px-4">
                Everything you need for the ultimate streaming experience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {valueProps.map((item) => (
                <ValueCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      {visibleSections.cta && (
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-[#e50914]/20 to-black animate-fadeInUp">
          <CTASection />
        </section>
      )}
    </>
  );
}