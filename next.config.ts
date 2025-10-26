import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['tailwindcss', '@tailwindcss/postcss', 'postcss'],
};

export default nextConfig;
