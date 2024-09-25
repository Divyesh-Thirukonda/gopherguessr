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
};

export default nextConfig;
