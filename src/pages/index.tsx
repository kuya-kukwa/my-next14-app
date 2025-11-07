import React, { useState, useEffect } from "react";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import ValuePropositionSection from "@/components/sections/ValuePropositionSection";
import MovieCarousel from "@/components/sections/MovieCarousel";
import TeamSection from "@/components/sections/TeamSection";
import ContactSection from "@/components/sections/ContactSection";
import { movies } from "@/data/movies";

export default function Home() {
  const [visibleSections, setVisibleSections] = useState({
    hero: true,
    featured: false,
    valueProps: false,
    team: false,
    contact: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      setVisibleSections({
        hero: true,
        featured: true,
        valueProps: scrollY > windowHeight * 0.4,
        team: scrollY > windowHeight * 0.6,
        contact: scrollY > windowHeight * 0.8,
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
      <Hero/>

      {/* VALUE PROPOSITION, TEAM & CONTACT SECTIONS WITH SHARED BACKGROUND */}
      <div className="relative bg-[url('/images/signin/HOT_RED.png')] bg-cover bg-center bg-fixed">
        {/* Base dark overlay */}
        <div className="absolute inset-0 bg-black/70 z-0" />

        {/* TOP MOVIES SECTION */}
        {visibleSections.featured && (
          <section className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 bg-[#0a0a0a] animate-fadeInUp overflow-visible">
            <div className="container mx-auto px-2 sm:px-4 md:px-6 overflow-visible">
              <MovieCarousel movies={topMovies} title="Trending Now: Popular & Recommended" />
            </div>
          </section>
        )}

        {/* Content wrapper with gradient overlay */}
        <div className="relative z-20">
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
          
          <div className="relative z-10">
            {/* VALUE PROPOSITION SECTION */}
            <ValuePropositionSection visible={visibleSections.valueProps} />

            {/* TEAM SECTION */}
            {visibleSections.team && (
              <div className="animate-fadeInUp">
                <TeamSection />
              </div>
            )}

            {/* CONTACT SECTION */}
           
          </div>
        </div>
      </div>
    </>
  );
}