/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  serverExternalPackages: ['@electric-sql/pglite'],
};

module.exports = nextConfig;
