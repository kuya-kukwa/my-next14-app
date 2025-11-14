"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import MovieCard from "../ui/MovieCard";
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
  const [isHydrated, setIsHydrated] = useState(false);

  // --- layout helpers -------------------------------------------------

  const getIsMobile = () =>
    typeof window !== "undefined" && window.innerWidth < 640;

  const getScale = ({
    isMobile,
    isCenterCard,
    distance,
  }: {
    isMobile: boolean;
    isCenterCard: boolean;
    distance: number;
  }) => {
    if (isMobile) {
      // Keep 3 cards visible with subtle emphasis on the center card
      if (isCenterCard) return 1.0;
      if (distance === 1) return 0.95;
      return 0.9;
    }

    if (isCenterCard) return 1.15;
    if (distance === 1) return 0.9;
    if (distance === 2) return 0.75;
    return 0.6;
  };

  const getOpacity = ({
    isMobile,
    distance,
  }: {
    isMobile: boolean;
    distance: number;
  }) => {
    if (isMobile) {
      if (distance === 0) return 1;
      if (distance === 1) return 0.95;
      if (distance === 2) return 0.85;
      return 0.7;
    }

    if (distance === 0) return 1;
    if (distance === 1) return 0.85;
    if (distance === 2) return 0.6;
    return 0.4;
  };

  const getTranslateY = ({
    isMobile,
    isCenterCard,
    distance,
  }: {
    isMobile: boolean;
    isCenterCard: boolean;
    distance: number;
  }) => {
    if (isCenterCard) return isMobile ? -2 : -8;
    if (distance === 1) return isMobile ? 1 : 4;
    return isMobile ? 2 : 8;
  };

  const getCardDimensions = useCallback(() => {
    if (typeof window === "undefined") return { cardWidth: 260, gap: 8 };

    const width = window.innerWidth;

    // Always show 3 cards on mobile: compute width from viewport - padding - gaps
    if (width < 640) {
      const sidePadding = 12 * 2; // 12px each side on real device (≈ space-3)
      const gaps = 6 * 2; // 2 gaps between 3 cards
      const available = width - sidePadding - gaps;

      const rawWidth = Math.floor(available / 3);
      const cardWidth = Math.max(96, Math.min(rawWidth, 130));

      return { cardWidth, gap: 6 };
    }

    if (width < 1024) {
      return { cardWidth: 220, gap: 12 };
    }

    return { cardWidth: 260, gap: 14 };
  }, []);

  // Start with server-safe defaults to match SSR
  const [dimensions, setDimensions] = useState({ cardWidth: 280, gap: 16 });
  const [containerWidth, setContainerWidth] = useState(0);

  // Hydration + dimension setup
  useEffect(() => {
    setIsHydrated(true);
    setDimensions(getCardDimensions());
    setContainerWidth(scrollRef.current?.clientWidth ?? window.innerWidth);

    const handleResize = () => {
      setDimensions(getCardDimensions());
      setContainerWidth(scrollRef.current?.clientWidth ?? window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getCardDimensions]);

  const updateCenterCard = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, clientWidth, scrollWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate which card is closest to the center of the viewport.
    const viewportCenter = scrollLeft + clientWidth / 2;

    // Use a uniform padding formula so first/last can center on all screens
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

    const scrollTimeoutRef: { current: NodeJS.Timeout | null } = { current: null };
    let isScrolling = false;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      isScrolling = true;
      updateCenterCard();

      scrollTimeoutRef.current = setTimeout(() => {
        isScrolling = false;

        // On small screens: don't auto-snap, let the user keep their scroll position
        if (getIsMobile()) {
          return;
        }

        // Snap to center card after scroll ends on larger screens only
        if (!isScrolling) {
          snapToCenter();
        }
      }, 150);
    };

    const snapToCenter = () => {
      const el = scrollRef.current;
      if (!el) return;

      const targetScrollLeft =
        centerIndex * (dimensions.cardWidth + dimensions.gap);

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
  }, [movies.length, centerIndex, updateCenterCard, dimensions]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const step = dimensions.cardWidth + dimensions.gap;

    // Derive current index from actual scroll position to avoid skipping
    const currentIndex = Math.round(el.scrollLeft / step);

    const nextIndex =
      dir === "left"
        ? Math.max(0, currentIndex - 1)
        : Math.min(movies.length - 1, currentIndex + 1);

    const targetScrollLeft = nextIndex * step;

    el.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });

    setCenterIndex(nextIndex);
  };

  return (
    <section className="carousel-section">
      <div className="carousel-title-container">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mx-auto max-w-3xl">
          {title}
        </h2>
      </div>

      {/* Center-focused carousel container */}
      <div className="carousel-container">
        {/* Left scroll button */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`carousel-btn carousel-btn-left carousel-btn-size ${!canScrollLeft ? 'carousel-btn-disabled' : ''}`}
          aria-label="Previous movies"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={3} />
        </button>

        {/* Scrollable container with center focus */}
        <div
          ref={scrollRef}
          className="no-scrollbar carousel-scrollable"
          style={((): React.CSSProperties => {
            // set CSS variables once so individual items don't need width inline
            const vars: Record<string, string> = {
              ['--card-width']: `${dimensions.cardWidth}px`,
              ['--gap']: `${dimensions.gap}px`,
            };
            const isMobile = isHydrated && getIsMobile();
            // Dynamic edge padding so first/last can be centered on small screens
            const edgePad = Math.max(12, Math.floor(containerWidth / 2 - dimensions.cardWidth / 2));

            const style: React.CSSProperties = { ...(vars as React.CSSProperties) };
            if (isMobile) {
              style.paddingLeft = `${edgePad}px`;
              style.paddingRight = `${edgePad}px`;
            }
            return style;
          })()}
        >
          {movies.slice(0, 15).map((m, index) => {
            const isCenterCard = index === centerIndex;
            const distance = Math.abs(index - centerIndex);

            const isMobile = isHydrated && getIsMobile();

            const scale = getScale({ isMobile, isCenterCard, distance });
            const opacity = getOpacity({ isMobile, distance });
            const translateY = getTranslateY({ isMobile, isCenterCard, distance });

            return (
              <div
                key={m.id}
                className={`carousel-item ${isCenterCard ? 'carousel-item-center' : ''}`}
                style={{
                  transform: `scale(${scale}) translateY(${translateY}px)`,
                  opacity: opacity,
                  zIndex: isCenterCard ? 30 : 20 - distance,
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
          className={`carousel-btn carousel-btn-right carousel-btn-size ${!canScrollRight ? 'carousel-btn-disabled' : ''}`}
          aria-label="Next movies"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={3} />
        </button>

        {/* Gradient fade edges */}
        <div className="carousel-fade-left"></div>
        <div className="carousel-fade-right"></div>
      </div>
    </section>
  );
}