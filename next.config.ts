import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dummyjson.com',
        pathname: '/icon/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        pathname: '/product-images/**',
      },
    ],
  },
};

export default nextConfig;
