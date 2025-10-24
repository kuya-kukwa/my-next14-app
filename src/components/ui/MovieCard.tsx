import React from "react";
import Image from "next/image";
import { Movie } from "@/types";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  priority?: boolean;
}

const MovieCardComponent = React.forwardRef<HTMLDivElement, MovieCardProps>(({
  movie,
  className,
  priority = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative group rounded-2xl overflow-hidden bg-black/30 border border-white/10 hover:border-[#e50914] transition-all duration-300 hover:shadow-xl hover:shadow-[#e50914]/25",
        className
      )}
      style={{ borderRadius: 'var(--radius-2xl)' }}
      {...props}
    >
      <div className="aspect-[3/4] relative">
        <Image
          src={movie.thumbnail}
          alt={`${movie.title} - ${movie.genre} movie poster`}
          fill
          sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
          className="object-cover group-hover:opacity-80 transition-opacity duration-300"
          style={{ borderRadius: 'var(--radius-2xl)' }}
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
        />
      </div>
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{ borderRadius: 'var(--radius-2xl)' }}
      >
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base font-bold text-white line-clamp-2 leading-tight">{movie.title}</h3>
          <p className="text-sm text-[#e50914] font-medium mt-1">{movie.genre}</p>
          <div className="flex items-center justify-between mt-2">
            <span 
              className="text-xs text-gray-300 bg-black/60 px-2 py-1 backdrop-blur-sm"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {movie.year}
            </span>
            <span 
              className="text-xs text-yellow-400 bg-black/60 px-2 py-1 backdrop-blur-sm font-medium"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              ★ {movie.rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

MovieCardComponent.displayName = "MovieCard";

export default React.memo(MovieCardComponent);