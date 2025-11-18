import { useThemeContext } from "@/contexts/ThemeContext";

export default function FloatingElements() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating popcorn */}
      <div className="absolute top-1/4 left-1/4 animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }}>
        <svg width="90" height="120" viewBox="0 0 60 80" className="opacity-25">
          <g>
            {/* Popcorn container */}
            <path
              d="M 15 40 L 10 80 L 50 80 L 45 40 Z"
              fill={isDark ? "#e50914" : "#ff1a1f"}
              stroke={isDark ? "#ffffff" : "#212121"}
              strokeWidth="2"
            />
            {/* Popcorn pieces */}
            {[
              { cx: 25, cy: 30, r: 8 },
              { cx: 35, cy: 28, r: 7 },
              { cx: 30, cy: 20, r: 9 },
              { cx: 22, cy: 15, r: 7 },
              { cx: 38, cy: 18, r: 8 },
            ].map((piece, i) => (
              <circle
                key={i}
                cx={piece.cx}
                cy={piece.cy}
                r={piece.r}
                fill="#fffacd"
                stroke="#f4e4a1"
                strokeWidth="1.5"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Floating film strip */}
      <div className="absolute top-1/3 right-1/4 animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}>
        <svg width="120" height="150" viewBox="0 0 80 100" className="opacity-20">
          <rect x="10" y="0" width="60" height="100" fill={isDark ? "#1f1f1f" : "#ffffff"} stroke={isDark ? "#e50914" : "#ff1a1f"} strokeWidth="2"/>
          {[10, 30, 50, 70, 90].map((y) => (
            <g key={y}>
              <rect x="10" y={y - 5} width="10" height="10" fill={isDark ? "#e50914" : "#ff1a1f"}/>
              <rect x="60" y={y - 5} width="10" height="10" fill={isDark ? "#e50914" : "#ff1a1f"}/>
            </g>
          ))}
        </svg>
      </div>

      {/* Floating movie ticket */}
      <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}>
        <svg width="140" height="84" viewBox="0 0 100 60" className="opacity-25">
          <rect x="0" y="10" width="100" height="40" rx="5" fill={isDark ? "#e50914" : "#ff1a1f"}/>
          <circle cx="25" cy="30" r="15" fill={isDark ? "#1f1f1f" : "#ffffff"} opacity="0.3"/>
          <circle cx="75" cy="30" r="15" fill={isDark ? "#1f1f1f" : "#ffffff"} opacity="0.3"/>
          <text x="50" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ADMIT ONE</text>
        </svg>
      </div>

      {/* Floating camera */}
      <div className="absolute top-2/3 right-1/3 animate-float" style={{ animationDelay: '3s', animationDuration: '9s' }}>
        <svg width="120" height="105" viewBox="0 0 80 70" className="opacity-20">
          <rect x="10" y="20" width="40" height="35" rx="3" fill={isDark ? "#1f1f1f" : "#ffffff"} stroke={isDark ? "#e50914" : "#ff1a1f"} strokeWidth="2"/>
          <circle cx="30" cy="37" r="12" fill={isDark ? "#e50914" : "#ff1a1f"} opacity="0.6"/>
          <polygon points="50,25 70,15 70,45 50,35" fill={isDark ? "#e50914" : "#ff1a1f"}/>
        </svg>
      </div>

      {/* Floating stars */}
      {[
        { top: '15%', left: '10%', delay: '0s', size: 40 },
        { top: '25%', right: '15%', delay: '1.5s', size: 35 },
        { bottom: '20%', left: '20%', delay: '3s', size: 38 },
        { bottom: '30%', right: '10%', delay: '4s', size: 32 },
      ].map((star, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            right: star.right,
            bottom: star.bottom,
            animationDelay: star.delay,
            animationDuration: '3s',
          }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 24 24" className="opacity-25">
            <path
              d="M12 2 L15 9 L22 9 L17 14 L19 21 L12 17 L5 21 L7 14 L2 9 L9 9 Z"
              fill={isDark ? "#ffd700" : "#ffaa00"}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
