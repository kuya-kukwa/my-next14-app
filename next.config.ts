import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/signin',
        destination: '/auths/signin',
      },
      {
        source: '/signup',
        destination: '/auths/signup',
      },
      {
        source: '/home',
        destination: '/authenticated/home',
      },
      {
        source: '/watchlist',
        destination: '/authenticated/watchlist',
      },
    ];
  },
};

export default nextConfig;
