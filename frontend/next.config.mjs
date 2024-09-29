/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    /*
      Disable Next.js client side router cache.
      Learn more about Next.js cache:
        https://nextjs.org/docs/app/building-your-application/caching#client-side-router-cache
    */
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
  async headers() {
    return [
      {
        // have the browser cache static assets (our map & boundary files)
        source: "/cacheable/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Add the images configuration here to allow external domains
  images: {
    domains: ['avatars.githubusercontent.com'], // Allow GitHub avatar domain
  },
};

export default nextConfig;
