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
  /** Same-origin `/api` → Express. On Vercel set `BACKEND_URL` if API host changes; fallback matches legacy deploy. */
  async rewrites() {
    const local = "http://127.0.0.1:5001";
    const vercelFallback = "https://e-commerce-restylefashion-3325.vercel.app";
    const backend =
      process.env.BACKEND_URL?.replace(/\/$/, "") ||
      (process.env.VERCEL ? vercelFallback : local);
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
