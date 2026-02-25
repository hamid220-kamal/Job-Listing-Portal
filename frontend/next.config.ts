import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://job-listing-portal-ten-omega.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
