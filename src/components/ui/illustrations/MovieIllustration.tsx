import { useThemeContext } from "@/contexts/ThemeContext";

export default function MovieIllustration() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <svg
      className="absolute right-0 top-1/2 -translate-y-1/2 w-3/5 h-auto opacity-25 hidden lg:block"
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Movie reel with rotation animation */}
      <g transform="translate(300, 300)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 300 300"
          to="360 300 300"
          dur="30s"
          repeatCount="indefinite"
        />
        
        {/* Outer circle with glow */}
        <circle
          r="200"
          fill="none"
          stroke={isDark ? "#e50914" : "#ff1a1f"}
          strokeWidth="8"
          opacity="0.8"
        >
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        
        {/* Film holes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
          const x = Math.cos((angle * Math.PI) / 180) * 180;
          const y = Math.sin((angle * Math.PI) / 180) * 180;
          return (
            <circle
              key={angle}
              cx={x}
              cy={y}
              r="20"
              fill={isDark ? "#1f1f1f" : "#ffffff"}
              stroke={isDark ? "#e50914" : "#ff1a1f"}
              strokeWidth="3"
            >
              <animate
                attributeName="r"
                values="18;22;18"
                dur="2s"
                begin={`${index * 0.25}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
        
        {/* Center hub */}
        <circle
          r="60"
          fill={isDark ? "#141414" : "#f5f5f5"}
          stroke={isDark ? "#e50914" : "#ff1a1f"}
          strokeWidth="6"
        />
        
        {/* Animated play button */}
        <polygon
          points="-15,-20 -15,20 25,0"
          fill={isDark ? "#e50914" : "#ff1a1f"}
        >
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </polygon>
        
        {/* Decorative rings */}
        <circle
          r="220"
          fill="none"
          stroke={isDark ? "#e50914" : "#ff1a1f"}
          strokeWidth="2"
          opacity="0.3"
          strokeDasharray="10 5"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="30"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}
