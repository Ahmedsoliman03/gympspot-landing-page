import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  // Enable gzip/brotli compression for all responses
  compress: true,
  // Remove the X-Powered-By: Next.js header (minor security + perf)
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Use modern image formats when supported
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        // Cache all static Next.js assets for 1 year (they're content-hashed)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache public images/videos/fonts for 7 days
        source: '/:path(.*\\.(?:ico|png|jpg|jpeg|webp|avif|svg|mp4|woff|woff2|ttf))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
