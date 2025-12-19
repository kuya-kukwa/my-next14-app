import React, { memo } from 'react';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = memo(() => {
  return (
    <footer className="relative z-10 overflow-hidden py-12 sm:py-16 lg:py-20 transition-colors duration-500 footer-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo and Description */}
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-block mb-4 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center font-bold text-xl sm:text-2xl shadow-lg shadow-primary/40 transition-transform hover:scale-105"></div>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight">
                  NextFlix
                </span>
              </div>
            </Link>
            <p className="text-sm sm:text-base leading-relaxed transition-colors duration-500 text-muted max-w-sm mx-auto">
              Your ultimate destination for cinematic entertainment. Discover, watch, and enjoy the best movies.
            </p>
          </div>

          {/* Social Links */}
          <div className="w-full">
            <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap">
              <a
                href="#"
                className="text-muted hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <FacebookIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
              </a>
              <a
                href="#"
                className="text-muted hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <TwitterIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
              </a>
              <a
                href="#"
                className="text-muted hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <InstagramIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
              </a>
              <a
                href="#"
                className="text-muted hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <LinkedInIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
              </a>
              <a
                href="#"
                className="text-muted hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <YouTubeIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
              </a>
              <a
                href="#"
                className="text-muted hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <GitHubIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="w-full pt-6 border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
            <p className="text-xs sm:text-sm text-muted">
              © {new Date().getFullYear()} NextFlix. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
