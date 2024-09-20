/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // disable next.js client side router cache
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
};

export default nextConfig;
