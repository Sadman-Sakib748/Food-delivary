// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['i.ibb.co', 'example.com', 'i.ibb.co.com'],
  },
};

export default nextConfig;