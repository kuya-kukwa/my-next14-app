import { useThemeContext } from "@/contexts/ThemeContext";

export default function WaveBackground() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#e50914" : "#ff1a1f"} stopOpacity="0.1" />
          <stop offset="100%" stopColor={isDark ? "#b20710" : "#e50914"} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="waveGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#141414" : "#f5f5f5"} stopOpacity="0.8" />
          <stop offset="100%" stopColor={isDark ? "#1f1f1f" : "#ffffff"} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      
      <path
        d="M0,400 C240,450 480,350 720,400 C960,450 1200,350 1440,400 L1440,800 L0,800 Z"
        fill="url(#waveGradient1)"
      />
      <path
        d="M0,500 C360,550 600,450 840,500 C1080,550 1320,450 1440,500 L1440,800 L0,800 Z"
        fill="url(#waveGradient2)"
      />
    </svg>
  );
}
