'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import MovieCard from '../ui/MovieCard';
import { Movie } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function MovieCarousel({
  movies,
  title,
}: {
  movies: Movie[];
  title: string;
}) {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const centerIndexRef = useRef<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const canScrollLeftRef = useRef<boolean>(false);
  const canScrollRightRef = useRef<boolean>(true);
  const lastUpdateRef = useRef<number>(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // --- layout helpers -------------------------------------------------

  const getIsMobile = useCallback(
    () => typeof window !== 'undefined' && window.innerWidth < 640,
    []
  );

  const getScale = useCallback(
    ({
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
    },
    []
  );

  const getOpacity = useCallback(
    ({ isMobile, distance }: { isMobile: boolean; distance: number }) => {
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
    },
    []
  );

  const getTranslateY = useCallback(
    ({
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
    },
    []
  );

  const getCardDimensions = useCallback(() => {
    if (typeof window === 'undefined') return { cardWidth: 260, gap: 8 };

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
  const dimensionsRef = useRef(dimensions);
  const containerWidthRef = useRef(containerWidth);

  // Hydration + dimension setup
  useEffect(() => {
    setIsHydrated(true);
    const d = getCardDimensions();
    setDimensions(d);
    dimensionsRef.current = d;

    const cw = scrollRef.current?.clientWidth ?? window.innerWidth;
    setContainerWidth(cw);
    containerWidthRef.current = cw;

    const handleResize = () => {
      const d = getCardDimensions();
      setDimensions(d);
      dimensionsRef.current = d;

      const cw = scrollRef.current?.clientWidth ?? window.innerWidth;
      setContainerWidth(cw);
      containerWidthRef.current = cw;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [getCardDimensions]);

  const updateCenterCard = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Use cached layout values (avoid repeated layout reads)
    const scrollLeft = el.scrollLeft;
    const clientWidth = containerWidthRef.current || el.clientWidth;
    const newCanScrollLeft = scrollLeft > 10;

    // Use an estimated scrollWidth based on card dimensions and padding
    const paddingLeft = clientWidth / 2 - dimensionsRef.current.cardWidth / 2;
    const step = dimensionsRef.current.cardWidth + dimensionsRef.current.gap;
    const estimatedScrollWidth = paddingLeft * 2 + movies.length * step;
    const newCanScrollRight =
      scrollLeft < estimatedScrollWidth - clientWidth - 10;

    // Calculate which card is closest to the center of the viewport using cached clientWidth
    const viewportCenter = scrollLeft + clientWidth / 2;

    // Compute closest index with O(1) arithmetic instead of looping all movies.
    // Solve cardCenterPosition(i) ~= viewportCenter => i ~= (viewportCenter - paddingLeft - cardWidth/2) / step
    const rawIndex = Math.round(
      (viewportCenter - paddingLeft - dimensionsRef.current.cardWidth / 2) /
        step
    );
    const closestIndex = Math.max(0, Math.min(movies.length - 1, rawIndex));

    // Rate-limit updates to reduce work during fast scrolling
    const now = Date.now();
    if (now - lastUpdateRef.current < 50) {
      // still update refs for scroll availability without triggering rerenders
      if (newCanScrollLeft !== canScrollLeftRef.current) {
        canScrollLeftRef.current = newCanScrollLeft;
      }
      if (newCanScrollRight !== canScrollRightRef.current) {
        canScrollRightRef.current = newCanScrollRight;
      }
      return;
    }

    lastUpdateRef.current = now;

    // Batch state updates to reduce re-renders
    let needsUpdate = false;
    const updates: (() => void)[] = [];

    if (newCanScrollLeft !== canScrollLeftRef.current) {
      canScrollLeftRef.current = newCanScrollLeft;
      updates.push(() => setCanScrollLeft(newCanScrollLeft));
      needsUpdate = true;
    }
    if (newCanScrollRight !== canScrollRightRef.current) {
      canScrollRightRef.current = newCanScrollRight;
      updates.push(() => setCanScrollRight(newCanScrollRight));
      needsUpdate = true;
    }
    if (closestIndex !== centerIndexRef.current) {
      centerIndexRef.current = closestIndex;
      updates.push(() => setCenterIndex(closestIndex));
      needsUpdate = true;
    }

    // Execute all updates in a microtask to batch them
    if (needsUpdate) {
      queueMicrotask(() => {
        updates.forEach((fn) => fn());
      });
    }
  }, [movies.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTimeoutRef: { current: NodeJS.Timeout | null } = {
      current: null,
    };
    let isScrolling = false;
    const rafRef: { current: number | null } = { current: null };

    const scheduleUpdate = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => updateCenterCard());
    };

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      isScrolling = true;
      // throttle expensive measurement to next animation frame
      scheduleUpdate();

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

      // read latest center index from ref to avoid effect dependency loops
      const currentCenter = centerIndexRef.current;
      const targetScrollLeft =
        currentCenter *
        (dimensionsRef.current.cardWidth + dimensionsRef.current.gap);

      const currentScroll = el.scrollLeft;
      const diff = Math.abs(currentScroll - targetScrollLeft);

      if (diff > 5) {
        el.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth',
        });
      }
    };

    updateCenterCard();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateCenterCard, { passive: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCenterCard);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [movies.length, updateCenterCard, getIsMobile]);
  // Keep ref in sync with state without forcing effect re-runs
  useEffect(() => {
    centerIndexRef.current = centerIndex;
  }, [centerIndex]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const step = dimensionsRef.current.cardWidth + dimensionsRef.current.gap;

    // Simple scroll: move by one card width
    const currentScroll = el.scrollLeft;
    const targetScrollLeft =
      dir === 'left' ? Math.max(0, currentScroll - step) : currentScroll + step;

    el.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
  };

  return (
    <section className="carousel-section" id="trending">
      <Container maxWidth="lg" sx={{ mb: { xs: 6, sm: 4 } }}>
        <Box sx={{ textAlign: 'center', mx: 'auto', maxWidth: '64rem' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: {
                xs: '1.75rem',
                sm: '2.25rem',
                md: '2.75rem',
                lg: '3.5rem',
              },
              fontWeight: 800,
              mx: 'auto',
              // Use a slightly softened white in dark mode for better visual balance
              color: isDark ? '#e6e6e6' : '#1a1a1a',
              transition: 'color 0.5s',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              color: isDark ? '#b3b3b3' : '#495057',
              mx: 'auto',
              maxWidth: '48rem',
              // Stronger top margin on xs to reliably push description lower on small viewports
              mt: { xs: 4, sm: 2 },
              lineHeight: 1.6,
              transition: 'color 0.5s',
            }}
          >
            Handpicked recommendations based on ratings and popularity
          </Typography>
        </Box>
      </Container>

      {/* Center-focused carousel container */}
      <div className="carousel-container">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`carousel-btn carousel-btn-left carousel-btn-size transition-all duration-500 ${
            !canScrollLeft ? 'carousel-btn-disabled' : ''
          }`}
          style={{
            backgroundColor: isDark
              ? 'rgba(0, 0, 0, 0.6)'
              : 'rgba(255, 255, 255, 0.95)',
            color: isDark ? '#ffffff' : '#1a1a1a',
            border: isDark ? 'none' : '1px solid #dee2e6',
            boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          aria-label="Previous movies"
        >
          <ChevronLeft
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            strokeWidth={3}
          />
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
            const edgePad = Math.max(
              12,
              Math.floor(containerWidth / 2 - dimensions.cardWidth / 2)
            );

            const style: React.CSSProperties = {
              ...(vars as React.CSSProperties),
            };
            if (isMobile) {
              style.paddingLeft = `${edgePad}px`;
              style.paddingRight = `${edgePad}px`;
            }
            return style;
          })()}
        >
          {movies.map((m, index) => {
            const isCenterCard = index === centerIndex;
            const distance = Math.abs(index - centerIndex);

            const isMobile = isHydrated && getIsMobile();

            const scale = getScale({ isMobile, isCenterCard, distance });
            const opacity = getOpacity({ isMobile, distance });
            const translateY = getTranslateY({
              isMobile,
              isCenterCard,
              distance,
            });

            // Only prioritize first 2 cards on initial load to minimize preload warnings
            const isPriority = !isHydrated && index < 2;

            return (
              <div
                key={m.id}
                className={`carousel-item ${
                  isCenterCard ? 'carousel-item-center' : ''
                }`}
                style={{
                  transform: `scale(${scale}) translateY(${translateY}px)`,
                  opacity: opacity,
                  zIndex: isCenterCard ? 30 : 20 - distance,
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                }}
              >
                <MovieCard
                  movie={m}
                  priority={isPriority}
                  className={
                    isCenterCard ? 'ring-2 ring-[var(--color-primary)]' : ''
                  }
                />
              </div>
            );
          })}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`carousel-btn carousel-btn-right carousel-btn-size transition-all duration-500 ${
            !canScrollRight ? 'carousel-btn-disabled' : ''
          }`}
          style={{
            backgroundColor: isDark
              ? 'rgba(0, 0, 0, 0.6)'
              : 'rgba(255, 255, 255, 0.95)',
            color: isDark ? '#ffffff' : '#1a1a1a',
            border: isDark ? 'none' : '1px solid #dee2e6',
            boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          aria-label="Next movies"
        >
          <ChevronRight
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            strokeWidth={3}
          />
        </button>

        {/* Gradient fade edges */}
        <div
          className="carousel-fade-left transition-colors duration-500"
          style={{
            background: isDark
              ? 'linear-gradient(to right, #0a0a0a 30%, #0a0a0a 50%, transparent)'
              : 'linear-gradient(to right, #fafafa 30%, #fafafa 50%, transparent)',
          }}
        ></div>
        <div
          className="carousel-fade-right transition-colors duration-500"
          style={{
            background: isDark
              ? 'linear-gradient(to left, #0a0a0a 30%, #0a0a0a 50%, transparent)'
              : 'linear-gradient(to left, #fafafa 30%, #fafafa 50%, transparent)',
          }}
        ></div>
      </div>
    </section>
  );
}
