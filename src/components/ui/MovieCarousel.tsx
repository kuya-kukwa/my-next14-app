"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import MovieCard from "./MovieCard";
import { Movie } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MovieCarousel({
  movies,
  title,
}: {
  movies: Movie[];
  title: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);


  // Responsive card sizing
  const getCardDimensions = useCallback(() => {
    if (typeof window === 'undefined') return { cardWidth: 280, gap: 16 };
    const width = window.innerWidth;
    
    if (width < 640) {
      // Mobile: smaller cards
      return { cardWidth: 160, gap: 12 };
    } else if (width < 1024) {
      // Tablet: medium cards
      return { cardWidth: 220, gap: 16 };
    }
    // Desktop: full size
    return { cardWidth: 280, gap: 16 };
  }, []);

  const [dimensions, setDimensions] = useState(getCardDimensions());

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getCardDimensions());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getCardDimensions]);

  const updateCenterCard = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate which card is closest to the center of the viewport
    const viewportCenter = scrollLeft + clientWidth / 2;
    const paddingLeft = clientWidth / 2 - dimensions.cardWidth / 2;
    
    // Position of each card's center
    const cardCenterPosition = (index: number) => 
      paddingLeft + index * (dimensions.cardWidth + dimensions.gap) + dimensions.cardWidth / 2;
    
    // Find the card closest to viewport center
    let closestIndex = 0;
    let minDistance = Infinity;
    
    for (let i = 0; i < movies.length; i++) {
      const distance = Math.abs(cardCenterPosition(i) - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    setCenterIndex(closestIndex);
  }, [movies.length, dimensions]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      isScrollingRef.current = true;
      updateCenterCard();
      
      // Set new timeout to detect scroll end
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        
        // Snap to center card after scroll ends
        if (!isScrollingRef.current) {
          snapToCenter();
        }
      }, 150);
    };
    
    const snapToCenter = () => {
      const el = scrollRef.current;
      if (!el) return;
      
      const paddingLeft = el.clientWidth / 2 - dimensions.cardWidth / 2;
      const targetScrollLeft = centerIndex * (dimensions.cardWidth + dimensions.gap);
      
      // Only snap if not already close enough
      const currentScroll = el.scrollLeft;
      const diff = Math.abs(currentScroll - targetScrollLeft);
      
      if (diff > 5) {
        el.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    };
    
    updateCenterCard();
    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateCenterCard);
    
    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCenterCard);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [movies.length, centerIndex, updateCenterCard]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    
    isScrollingRef.current = true;
    
    // Calculate the next center index
    const nextIndex = dir === "left" 
      ? Math.max(0, centerIndex - 1)
      : Math.min(movies.length - 1, centerIndex + 1);
    
    // Scroll to position that centers the target card
    const targetScrollLeft = nextIndex * (dimensions.cardWidth + dimensions.gap);
    
    el.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
    
    // Update center index immediately for smoother state updates
    setCenterIndex(nextIndex);
  };

  return (
    <section style={{ marginBottom: 'clamp(var(--space-8), 4vw, var(--space-16))', width: '100%' }}>
      <div style={{ marginBottom: 'clamp(var(--space-4), 2vw, var(--space-8))', padding: '0 var(--space-4)', textAlign: 'center' }}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mx-auto max-w-3xl">
          {title}
        </h2>
      </div>

      {/* Center-focused carousel container */}
      <div style={{ position: 'relative', width: '100%', padding: 'var(--space-2) 0' }}>
        {/* Left scroll button */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="carousel-btn"
          style={{
            left: 'var(--space-2)',
            opacity: canScrollLeft ? 1 : 0.4,
            cursor: canScrollLeft ? 'pointer' : 'not-allowed',
            width: 'clamp(36px, 8vw, 48px)',
            height: 'clamp(36px, 8vw, 48px)',
          }}
          aria-label="Previous movies"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={3} />
        </button>

        {/* Scrollable container with center focus */}
        <div
          ref={scrollRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: `${dimensions.gap}px`,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
            paddingLeft: `calc(50% - ${dimensions.cardWidth / 2}px)`,
            paddingRight: `calc(50% - ${dimensions.cardWidth / 2}px)`,
            paddingTop: 'clamp(var(--space-8), 4vw, var(--space-12))',
            paddingBottom: 'clamp(var(--space-8), 4vw, var(--space-12))',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {movies.slice(0, 15).map((m, index) => {
            const isCenterCard = index === centerIndex;
            const distance = Math.abs(index - centerIndex);
            
            // Mobile: less aggressive scaling
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
            const scale = isCenterCard ? (isMobile ? 1.1 : 1.15) : 
                         distance === 1 ? (isMobile ? 0.95 : 0.9) : 
                         distance === 2 ? (isMobile ? 0.85 : 0.75) : (isMobile ? 0.75 : 0.6);
            const opacity = distance > 2 ? 0.4 : 
                           distance === 2 ? 0.6 : 
                           distance === 1 ? 0.85 : 1;
            const translateY = isCenterCard ? (isMobile ? -4 : -8) : 
                              distance === 1 ? (isMobile ? 2 : 4) : (isMobile ? 4 : 8);

            return (
              <div
                key={m.id}
                style={{
                  flexShrink: 0,
                  width: `${dimensions.cardWidth}px`,
                  scrollSnapAlign: 'center',
                  transform: `scale(${scale}) translateY(${translateY}px)`,
                  opacity: opacity,
                  transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: isCenterCard ? 30 : 20 - distance,
                  willChange: 'transform, opacity',
                }}
              >
                <MovieCard 
                  movie={m}
                  priority={index < 3}
                  className={isCenterCard ? 'ring-2 ring-[var(--color-primary)]' : ''}
                />
              </div>
            );
          })}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="carousel-btn"
          style={{
            right: 'var(--space-2)',
            opacity: canScrollRight ? 1 : 0.4,
            cursor: canScrollRight ? 'pointer' : 'not-allowed',
            width: 'clamp(36px, 8vw, 48px)',
            height: 'clamp(36px, 8vw, 48px)',
          }}
          aria-label="Next movies"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={3} />
        </button>

        {/* Gradient fade edges */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 'clamp(var(--space-16), 10vw, var(--space-32))',
            background: 'linear-gradient(to right, var(--color-bg-primary) 30%, var(--color-bg-primary) 50%, transparent)',
            pointerEvents: 'none',
            zIndex: 'var(--z-dropdown)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 'clamp(var(--space-16), 10vw, var(--space-32))',
            background: 'linear-gradient(to left, var(--color-bg-primary) 30%, var(--color-bg-primary) 50%, transparent)',
            pointerEvents: 'none',
            zIndex: 'var(--z-dropdown)',
          }}
        />
      </div>
    </section>
  );
}