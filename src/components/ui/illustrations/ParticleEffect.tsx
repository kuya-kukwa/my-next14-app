import { useThemeContext } from "@/contexts/ThemeContext";

export default function ParticleEffect() {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  // Generate random particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float-particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: isDark ? 'rgba(229, 9, 20, 0.6)' : 'rgba(255, 26, 31, 0.5)',
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      
      {/* Larger glowing particles */}
      {Array.from({ length: 8 }, (_, i) => ({
        id: i,
        size: Math.random() * 20 + 10,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
      })).map((particle) => (
        <div
          key={`large-${particle.id}`}
          className="absolute rounded-full blur-sm animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: isDark ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 140, 0, 0.15)',
            animationDelay: `${particle.delay}s`,
            animationDuration: '4s',
          }}
        />
      ))}
    </div>
  );
}
