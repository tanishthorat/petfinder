import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack (Next.js 16 default)
  turbopack: {},
  
  // Disable source maps in development to avoid parsing errors
  productionBrowserSourceMaps: false,
  
  // Image configuration for external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'dl5zpyw5k3jeb.cloudfront.net', // Petfinder images
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc', // Petfinder images
      },
    ],

  },
};

export default nextConfig;
