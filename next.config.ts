import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: false,
  /* config options here */
  serverExternalPackages: ['@tailwindcss/cli'],
};

export default nextConfig;
