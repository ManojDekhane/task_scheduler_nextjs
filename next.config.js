/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  // Force Webpack instead of Turbopack (required for next-pwa)
  experimental: {
    forceSwcTransforms: true,
  },
  // Optional: silence Turbopack warning
  turbopack: {},
};

module.exports = withPWA(nextConfig);
