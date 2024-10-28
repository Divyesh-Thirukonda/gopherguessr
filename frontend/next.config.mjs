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
    // limit uploads to 20 mb
    serverActions: {
      bodySizeLimit: "20mb",
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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/a/e9dxf42twp/*",
      },
    ],
  },
};

export default nextConfig;
