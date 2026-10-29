/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Required for Cloudflare
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // Forces the browser to always fetch the latest HTML on reload
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

// Initialize Cloudflare environment context for local dev
const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
initOpenNextCloudflareForDev();

module.exports = nextConfig;
