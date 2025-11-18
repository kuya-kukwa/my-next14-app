import { useThemeContext } from "@/contexts/ThemeContext";

export default function GeometricPattern() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-10"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke={isDark ? "#ffffff" : "#212121"}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
        <linearGradient id="rectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? "#e50914" : "#ff1a1f"} stopOpacity="0.6" />
          <stop offset="100%" stopColor={isDark ? "#b20710" : "#e50914"} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {/* Animated geometric shapes */}
      <rect
        x="100"
        y="150"
        width="120"
        height="120"
        fill="url(#rectGradient)"
        stroke={isDark ? "#e50914" : "#ff1a1f"}
        strokeWidth="3"
        opacity="0.4"
        transform="rotate(15 160 210)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="15 160 210"
          to="375 160 210"
          dur="20s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0.6;0.3"
          dur="4s"
          repeatCount="indefinite"
        />
      </rect>
      
      <circle
        cx="1200"
        cy="200"
        r="80"
        fill="none"
        stroke={isDark ? "#e50914" : "#ff1a1f"}
        strokeWidth="3"
        opacity="0.3"
      >
        <animate
          attributeName="r"
          values="70;90;70"
          dur="5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.2;0.5;0.2"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      
      <polygon
        points="300,600 400,700 200,700"
        fill="none"
        stroke={isDark ? "#b20710" : "#e50914"}
        strokeWidth="3"
        opacity="0.4"
      >
        <animate
          attributeName="opacity"
          values="0.3;0.6;0.3"
          dur="6s"
          repeatCount="indefinite"
        />
      </polygon>
      
      {/* Additional decorative shapes */}
      <circle
        cx="400"
        cy="300"
        r="50"
        fill="none"
        stroke={isDark ? "#ffd700" : "#ffaa00"}
        strokeWidth="2"
        opacity="0.2"
        strokeDasharray="5 5"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="20"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      
      <rect
        x="1000"
        y="500"
        width="100"
        height="100"
        fill="none"
        stroke={isDark ? "#e50914" : "#ff1a1f"}
        strokeWidth="2"
        opacity="0.3"
        transform="rotate(45 1050 550)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="45 1050 550"
          to="405 1050 550"
          dur="15s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}
