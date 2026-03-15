import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const isDev = process.env.NODE_ENV !== 'production';
    return [
      {
        source: '/api/:path*',
        destination: isDev 
          ? 'http://localhost:5001/api/:path*' 
          : 'https://job-listing-portal-ten-omega.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
