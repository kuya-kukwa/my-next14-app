"use client";

import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useThemeContext } from "@/contexts/ThemeContext";
import useIdle from '@/lib/useIdle';

type Props = {
  visible?: boolean;
};

interface StatCardProps {
  endValue: number;
  suffix: string;
  label: string;
  duration?: number;
}

// Slightly slower default duration so the counting animation is more visible
function StatCard({ endValue, suffix, label, duration = 3500 }: StatCardProps) {
  const { isDark } = useThemeContext();
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const node = cardRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let lastSet = 0;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      // Throttle state updates to ~20fps to make the counting more noticeable
      if (currentTime - lastSet > 50 || progress >= 1) {
        if (progress >= 1) {
          setCount(endValue);
        } else {
          setCount(Math.floor(easeOutQuart * endValue));
        }
        lastSet = currentTime;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, endValue, duration]);

  return (
    <Box
      ref={cardRef}
      sx={{
        textAlign: 'center',
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        background: 'transparent',
        transition: 'color 0.3s ease',
        position: 'relative'
      }}
    >
      <Typography
        className="stat-number"
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3.5rem' },
          fontWeight: 800,
          background: 'linear-gradient(135deg, #e50914 0%, #ff1a1f 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: { xs: 0.25, sm: 0.5 },
          letterSpacing: '-0.02em',
          lineHeight: 1.1
        }}
      >
        {count.toLocaleString()}{suffix}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.95rem', md: '1.125rem', lg: '1.25rem' },
          fontWeight: 700,
          // Tone down label color in dark mode for better color hierarchy
          color: isDark ? '#d1d1d1' : '#212121',
          mb: 0.75,
          lineHeight: 1.2
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
          color: isDark ? '#b3b3b3' : '#616161',
          lineHeight: 1.6,
        }}
      >
      </Typography>
    </Box>
  );
}

export default function ValuePropositionSection({ visible = false }: Props) {
  const { isDark } = useThemeContext();
  const isIdle = useIdle(600);

  const stats = [
    {
      endValue: 50,
      suffix: 'M+',
      label: 'Active Users',
    },
    {
      endValue: 10,
      suffix: 'K+',
      label: 'Movies & Shows',
    },
    {
      endValue: 98,
      suffix: '%',
      label: 'Satisfaction Rate',
    },
  ];

  return (
    <Box 
      component="section"
      id="value-proposition"
      sx={{
        py: { xs: 6, sm: 8, md: 10, lg: 12 },
        minHeight: 'auto',
        alignItems: 'flex-start',
        background: isDark 
          ? 'linear-gradient(180deg, transparent 0%, rgba(20, 20, 20, 0.5) 50%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(245, 245, 245, 0.8) 50%, rgba(255, 255, 255, 0.5) 100%)',
        transition: 'background 0.5s',
        animation: visible ? 'fadeInUp 0.6s ease-out' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background elements (render after idle to avoid heavy paint) */}
      {isIdle && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '-10%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(229, 9, 20, 0.15) 0%, transparent 70%)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '20%',
              left: '-10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 26, 31, 0.1) 0%, transparent 70%)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <Container maxWidth="xl">
        <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center', mb: { xs: 5, sm: 6, md: 8 } }}>
          <Typography 
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '3.5rem' },
              fontWeight: 800,
              mb: { xs: 2, sm: 2.5 },
              // White text on dark mode for better readability; keep gradient on light
              ...(isDark
                ? { color: '#ffffff' }
                : {
                    background: 'linear-gradient(135deg, #e50914 0%, #ff1a1f 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }),
              letterSpacing: '-0.02em',
            }}
          >
            Trusted by Millions Worldwide
          </Typography>
          <Typography 
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              maxWidth: '48rem',
              mx: 'auto',
              color: isDark ? '#b3b3b3' : '#495057',
              transition: 'color 0.5s',
              lineHeight: 1.6,
            }}
          >
            Join millions of entertainment lovers who choose NextFlix for unparalleled streaming quality and endless content
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', zIndex: 10 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: { xs: 1.5, sm: 3, md: 4 },
              alignItems: 'flex-start',
              justifyContent: 'center',
              flexWrap: 'nowrap',
              px: { xs: 1, sm: 0 }
            }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  flex: '1 1 0',
                  minWidth: { xs: '90px', sm: '140px', md: '180px' },
                  px: { xs: 0.5, sm: 1, md: 2 },
                }}
              >
                <StatCard {...stat} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
