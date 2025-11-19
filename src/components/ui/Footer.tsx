import React, { memo } from "react";
import Link from "next/link";
import { useThemeContext } from "@/contexts/ThemeContext";

const Footer = memo(() => {
  const { mode } = useThemeContext();
  const isDark = mode === 'dark';

  return (
    <footer 
      className="relative z-10 overflow-hidden pb-0 pt-20 lg:pb-0 lg:pt-[100px] transition-colors duration-500"
      style={{
        backgroundColor: isDark ? 'rgb(28, 17, 17)' : '#f8f9fa'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-wrap justify-between gap-8 lg:gap-0">
          {/* Logo and Description - Left Side */}
          <div className="w-full lg:w-1/3 mb-6 lg:mb-0 text-center">
            <Link href="/" className="mb-6 inline-block hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <div 
                  className="w-8 h-8 sm:w-12 sm:h-12 bg-primary rounded-sm flex items-center justify-center font-bold text-lg sm:text-2xl shadow-lg shadow-primary/40"
                  style={{ color: '#ffffff' }}
                ></div>
                <span className="text-xl sm:text-3xl font-bold tracking-tight">
                  <span style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}>NextFlix</span>
                </span>
              </div>
            </Link>
            <p 
              className="mb-5 sm:mb-7 text-sm sm:text-base transition-colors duration-500"
              style={{
                color: isDark ? '#b3b3b3' : '#495057'
              }}
            >
              Your ultimate destination for cinematic entertainment. Stream thousands of movies and shows in stunning quality, anytime, anywhere.
            </p>
          </div>

          {/* Navigation Links - Center/Right Side */}
          <div className="w-full lg:w-2/3 grid grid-cols-3 gap-8">
            <LinkGroup header="Streaming" isDark={isDark}>
              <NavLink link="/#" label="Watch Now" isDark={isDark} />
              <NavLink link="/#" label="Movie Library" isDark={isDark} />
              <NavLink link="/#" label="TV Shows" isDark={isDark} />
              <NavLink link="/#" label="Genres" isDark={isDark} />
            </LinkGroup>

            <LinkGroup header="Support" isDark={isDark}>
              <NavLink link="/#" label="Help Center" isDark={isDark} />
              <NavLink link="/#" label="Contact Us" isDark={isDark} />
              <NavLink link="/#" label="Device Setup" isDark={isDark} />
              <NavLink link="/#" label="Account Settings" isDark={isDark} />
            </LinkGroup>

            <LinkGroup header="Legal" isDark={isDark}>
              <NavLink link="/#" label="Terms of Service" isDark={isDark} />
              <NavLink link="/#" label="Privacy Policy" isDark={isDark} />
              <NavLink link="/#" label="Cookie Policy" isDark={isDark} />
              <NavLink link="/#" label="DMCA" isDark={isDark} />
            </LinkGroup>
          </div>
        </div>

        {/* Social Links and Copyright - Bottom */}
        <div 
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 transition-colors duration-500"
          style={{
            borderTop: isDark 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p 
              className="text-xs sm:text-sm order-2 md:order-1 transition-colors duration-500"
              style={{
                color: isDark ? '#808080' : '#9e9e9e'
              }}
            >
              &copy; {new Date().getFullYear()} NextFlix. All cinematic rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;

const LinkGroup = ({ children, header, isDark }: { children: React.ReactNode; header: string; isDark: boolean }) => {
  return (
    <div className="w-full text-center">
      <h4 
        className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold transition-colors duration-500"
        style={{
          color: isDark ? '#9ca3af' : '#616161'
        }}
      >
        {header}
      </h4>
      <ul className="space-y-2 sm:space-y-3">{children}</ul>
    </div>
  );
};

const NavLink = ({ link, label, isDark }: { link: string; label: string; isDark: boolean }) => {
  return (
    <li>
      <a
        href={link}
        className="inline-block text-sm sm:text-base leading-loose transition-colors"
        style={{
          color: isDark ? '#6b7280' : '#9e9e9e'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#e50914';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = isDark ? '#6b7280' : '#9e9e9e';
        }}
      >
        {label}
      </a>
    </li>
  );
};