import React from "react";
import Hero from "@/components/sections/Hero";
import ValuePropositionSection from "@/components/sections/ValuePropositionSection";
import MovieCarousel from "@/components/sections/MovieCarousel";
import TeamSection from "@/components/sections/TeamSection";
import { movies } from "@/data/movies";

export default function Home() {
  const topMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 15);

  return (
    <>
      {/* HERO SECTION */}
      <Hero/>

        {/* Base dark overlay */}
        <div className="absolute inset-0 bg-black/70 z-0" />

        {/* TOP MOVIES SECTION */}
        <section className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 bg-[#0a0a0a] animate-fadeInUp overflow-visible">
          <div className="container mx-auto px-2 sm:px-4 md:px-6 overflow-visible">
            <MovieCarousel movies={topMovies} title="Trending Now: Popular & Recommended" />
          </div>
        </section>

        {/* Content wrapper with gradient overlay */}
        <div className="relative z-20">
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
          
          <div className="relative z-10">
            {/* VALUE PROPOSITION SECTION */}
            <ValuePropositionSection visible={true} />

            {/* TEAM SECTION */}
            <div className="animate-fadeInUp">
              <TeamSection />
            </div>

            {/* CONTACT SECTION */}
           
          </div>
        </div>
    </>
  );
}