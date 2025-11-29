import React, { useState, useEffect } from "react";
import Hero from "@/components/sections/Hero";
import ValuePropositionSection from "@/components/sections/ValuePropositionSection";
import MovieCarousel from "@/components/sections/MovieCarousel";
import ContactSection from "@/components/sections/ContactSection";
import type { Movie } from "@/types";

export default function Home() {
  const [topMovies, setTopMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // Fetch top movies from local data or API
    async function fetchTopMovies() {
      try {
        const response = await fetch('/api/movies?top=true');
        const data = await response.json();
        setTopMovies(data.movies);
      } catch (error) {
        console.error('Error fetching top movies:', error);
      }
    }
    fetchTopMovies();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <Hero/>

      {/* TOP MOVIES SECTION */}
      <section 
        className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 animate-fadeInUp overflow-visible transition-colors duration-500 bg-primary"
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

          {/* CONTACT SECTION */}
          <div className="animate-fadeInUp">
            <ContactSection />
          </div>
        </div>
      </div>
    </>
  );
}