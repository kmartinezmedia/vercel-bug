import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['tailwindcss', '@tailwindcss/cli'],
  outputFileTracingIncludes: {
    '/*': ['./node_modules/.bin/tailwindcss', './node_modules/@tailwindcss/**'],
  },
};

export default nextConfig;
