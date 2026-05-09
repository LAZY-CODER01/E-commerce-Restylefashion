/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  /** API is proxied by `app/api/[[...path]]/route.js` (external rewrites are unreliable on Next.js 16 in prod). */
};

export default nextConfig;
