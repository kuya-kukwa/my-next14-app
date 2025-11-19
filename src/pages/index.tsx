import React from "react";
import Hero from "@/components/sections/Hero";
import ValuePropositionSection from "@/components/sections/ValuePropositionSection";
import MovieCarousel from "@/components/sections/MovieCarousel";
import TeamSection from "@/components/sections/TeamSection";
import { movies } from "@/data/movies";
import { useThemeContext } from "@/contexts/ThemeContext";

export default function Home() {
  const topMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 15);
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <>
      {/* HERO SECTION */}
      <Hero/>

      {/* TOP MOVIES SECTION */}
      <section 
        className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 animate-fadeInUp overflow-visible transition-colors duration-500"
        style={{
          backgroundColor: isDark ? '#0a0a0a' : '#e8e8e8'
        }}
      >
        <div className="container mx-auto px-2 sm:px-4 md:px-6 overflow-visible">
          <MovieCarousel movies={topMovies} title="Top Picks Just for You" />
        </div>
      </section>

      {/* Content wrapper */}
      <div className="relative z-20">
        <div className="relative z-10">
          {/* VALUE PROPOSITION SECTION */}
          <ValuePropositionSection visible={true} />

          {/* TEAM SECTION */}
          <div className="animate-fadeInUp">
            <TeamSection />
          </div>
        </div>
      </div>
    </>
  );
}