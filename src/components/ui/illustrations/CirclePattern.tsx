import { useThemeContext } from "@/contexts/ThemeContext";

export default function CirclePattern() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-30"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Large decorative circles with animations */}
      <circle
        cx="200"
        cy="150"
        r="120"
        fill={isDark ? "#e50914" : "#ff1a1f"}
        opacity="0.08"
      >
        <animate
          attributeName="r"
          values="120;140;120"
          dur="8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.06;0.12;0.06"
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>
      
      <circle
        cx="1300"
        cy="200"
        r="180"
        fill={isDark ? "#e50914" : "#ff1a1f"}
        opacity="0.06"
      >
        <animate
          attributeName="r"
          values="180;200;180"
          dur="10s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.04;0.10;0.04"
          dur="10s"
          repeatCount="indefinite"
        />
      </circle>
      
      <circle
        cx="1200"
        cy="650"
        r="150"
        fill={isDark ? "#b20710" : "#e50914"}
        opacity="0.07"
      >
        <animate
          attributeName="r"
          values="150;170;150"
          dur="9s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.05;0.11;0.05"
          dur="9s"
          repeatCount="indefinite"
        />
      </circle>
      
      <circle
        cx="100"
        cy="700"
        r="100"
        fill={isDark ? "#b20710" : "#e50914"}
        opacity="0.09"
      >
        <animate
          attributeName="r"
          values="100;120;100"
          dur="7s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.07;0.13;0.07"
          dur="7s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Medium circles with glow effect */}
      <circle
        cx="600"
        cy="100"
        r="60"
        fill={isDark ? "#ffffff" : "#212121"}
        opacity="0.04"
      >
        <animate
          attributeName="r"
          values="60;75;60"
          dur="6s"
          repeatCount="indefinite"
        />
      </circle>
      
      <circle
        cx="800"
        cy="700"
        r="80"
        fill={isDark ? "#ffffff" : "#212121"}
        opacity="0.03"
      >
        <animate
          attributeName="r"
          values="80;95;80"
          dur="7s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Additional animated circles for depth */}
      <circle
        cx="500"
        cy="400"
        r="40"
        fill={isDark ? "#ffd700" : "#ffaa00"}
        opacity="0.05"
      >
        <animate
          attributeName="cx"
          values="500;520;500"
          dur="12s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="cy"
          values="400;420;400"
          dur="10s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.03;0.08;0.03"
          dur="5s"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="900"
        cy="350"
        r="50"
        fill={isDark ? "#e50914" : "#ff1a1f"}
        opacity="0.06"
      >
        <animate
          attributeName="cx"
          values="900;920;900"
          dur="14s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="cy"
          values="350;370;350"
          dur="11s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
