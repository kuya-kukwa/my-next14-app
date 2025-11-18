import { useThemeContext } from "@/contexts/ThemeContext";

export default function SpotlightEffect() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Radial spotlight from top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(229, 9, 20, 0.4) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 26, 31, 0.3) 0%, transparent 70%)',
          animationDuration: '4s',
        }}
      />
      
      {/* Side spotlights */}
      <div
        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(229, 9, 20, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 140, 0, 0.2) 0%, transparent 70%)',
        }}
      />
      
      <div
        className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full blur-3xl opacity-10"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(178, 7, 16, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(229, 9, 20, 0.2) 0%, transparent 70%)',
        }}
      />

      {/* Animated light rays */}
      <div className="absolute inset-0">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 w-1 h-full origin-top animate-spin-slow opacity-5"
            style={{
              background: isDark
                ? 'linear-gradient(to bottom, rgba(229, 9, 20, 0.5) 0%, transparent 50%)'
                : 'linear-gradient(to bottom, rgba(255, 26, 31, 0.4) 0%, transparent 50%)',
              transform: `rotate(${i * 36}deg)`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '20s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
