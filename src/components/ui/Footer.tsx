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
    <footer className="relative z-10 overflow-hidden pb-0 pt-20 lg:pb-0 lg:pt-[100px] transition-colors duration-500 footer-bg">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-wrap justify-between gap-4 lg:gap-0">
          {/* Logo and Description */}
          <div className="w-full lg:w-1/3 mb-6 lg:mb-0 text-center">
            <Link
              href="/"
              className="mb-2 inline-block hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary rounded-sm flex items-center justify-center font-bold text-lg sm:text-2xl shadow-lg shadow-primary/40"></div>
                <span className="text-xl sm:text-3xl font-bold tracking-tight">
                  NextFlix
                </span>
              </div>
            </Link>
            <p className="mb-0 sm:mb-1 text-sm sm:text-base transition-colors duration-500 text-muted">
              Your ultimate destination for cinematic entertainment.
            </p>
          </div>
        </div>

        {/* Social Links */}

        <div className="flex justify-center mt-10 mb-6">
          <div className="flex space-x-6 sm:space-x-8">
            <a
              href="#"
              className="text-muted hover:text-primary transition-colors duration-300"
              aria-label="Facebook"
            >
              <FacebookIcon sx={{ fontSize: 40 }} />
            </a>
            <a
              href="#"
              className="text-muted hover:text-primary transition-colors duration-300"
              aria-label="Twitter"
            >
              <TwitterIcon sx={{ fontSize: 40 }} />
            </a>
            <a
              href="#"
              className="text-muted hover:text-primary transition-colors duration-300"
              aria-label="Instagram"
            >
              <InstagramIcon sx={{ fontSize: 40 }} />
            </a>
            <a
              href="#"
              className="text-muted hover:text-primary transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <LinkedInIcon sx={{ fontSize: 40 }} />
            </a>
            <a
              href="#"
              className="text-muted hover:text-primary transition-colors duration-300"
              aria-label="YouTube"
            >
              <YouTubeIcon sx={{ fontSize: 40 }} />
            </a>
            <a
              href="#"
              className="text-muted hover:text-primary transition-colors duration-300"
              aria-label="GitHub"
            >
              <GitHubIcon sx={{ fontSize: 40 }} />
            </a>
          </div>
        </div>

        {/*  Copyright - Bottom */}
        <div className="mt-2 sm:mt-3 pt-4 sm:pt-6 transition-colors duration-500 border-top-muted">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs sm:text-sm order-2 md:order-1 transition-colors duration-500 text-muted">
              &copy; {new Date().getFullYear()} NextFlix. All cinematic rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
