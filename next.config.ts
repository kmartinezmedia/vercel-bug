import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['tailwindcss', '@tailwindcss/cli'],
  outputFileTracingIncludes: {
    '/*': [
      // Required for tailwindcss CLI
      './node_modules/.bin/tailwindcss',
      './node_modules/@tailwindcss/**',
      './node_modules/mri/**',
      './node_modules/@parcel/watcher/**',
      './node_modules/picocolors/**',
      './node_modules/enhanced-resolve/**',
    ],
  },
};

export default nextConfig;
