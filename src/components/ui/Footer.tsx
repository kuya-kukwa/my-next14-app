import React, { memo } from "react";
import Link from "next/link";

const Footer = memo(() => {
  return (
    <footer className="relative z-10 bg-[rgb(28,17,17)] overflow-hidden pb-0 pt-20 lg:pb-0 lg:pt-[100px]">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-wrap justify-between gap-8 lg:gap-0">
          {/* Logo and Description - Left Side */}
          <div className="w-full lg:w-1/3 mb-6 lg:mb-0 text-center">
            <Link href="/" className="mb-6 inline-block">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary rounded-sm flex items-center justify-center text-white font-bold text-lg sm:text-2xl shadow-lg shadow-primary/40"></div>
                <span className="text-xl sm:text-3xl font-bold tracking-tight">
                  <span className="text-primary">Next</span>
                  <span className="text-primary">Flix</span>
                </span>
              </div>
            </Link>
            <p className="mb-5 sm:mb-7 text-sm sm:text-base text-gray-500 sm:text-secondary">
              Your ultimate destination for cinematic entertainment. Stream thousands of movies and shows in stunning quality, anytime, anywhere.
            </p>
          </div>

          {/* Navigation Links - Center/Right Side */}
          <div className="w-full lg:w-2/3 grid grid-cols-3 gap-8">
            <LinkGroup header="Streaming">
              <NavLink link="/#" label="Watch Now" />
              <NavLink link="/#" label="Movie Library" />
              <NavLink link="/#" label="TV Shows" />
              <NavLink link="/#" label="Genres" />
            </LinkGroup>

            <LinkGroup header="Support">
              <NavLink link="/#" label="Help Center" />
              <NavLink link="/#" label="Contact Us" />
              <NavLink link="/#" label="Device Setup" />
              <NavLink link="/#" label="Account Settings" />
            </LinkGroup>

            <LinkGroup header="Legal">
              <NavLink link="/#" label="Terms of Service" />
              <NavLink link="/#" label="Privacy Policy" />
              <NavLink link="/#" label="Cookie Policy" />
              <NavLink link="/#" label="DMCA" />
            </LinkGroup>
          </div>
        </div>

        {/* Social Links and Copyright - Bottom */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border-light">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs sm:text-sm text-gray-400 sm:text-muted order-2 md:order-1">
              &copy; {new Date().getFullYear()} <span className="text-primary">NextFlix</span>. All cinematic rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;

const LinkGroup = ({ children, header }: { children: React.ReactNode; header: string }) => {
  return (
    <div className="w-full text-center">
      <h4 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-[#9ca3af]">
        {header}
      </h4>
      <ul className="space-y-2 sm:space-y-3">{children}</ul>
    </div>
  );
};

const NavLink = ({ link, label }: { link: string; label: string }) => {
  return (
    <li>
      <a
        href={link}
        className="inline-block text-sm sm:text-base leading-loose text-[#6b7280] transition-colors hover:text-primary"
      >
        {label}
      </a>
    </li>
  );
};