import type { NextConfig } from 'next';
import tailwindDeps from './tailwind-transitive-deps.json';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['tailwindcss', '@tailwindcss/postcss'],
  outputFileTracingIncludes: {
    '/*': tailwindDeps,
  },
};

export default nextConfig;
