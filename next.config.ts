import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    // Keep `domains` for compatibility; `remotePatterns` is preferred in newer Next.js.
    domains: ['media.licdn.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        pathname: '/**',
      },
    ],
  },
  // Enable server-side features for API routes
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Turbopack config (Next.js 16+)
  turbopack: {},
};

export default nextConfig;
