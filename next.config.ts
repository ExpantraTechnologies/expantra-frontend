import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force Next.js to treat THIS folder as the real project root
    root: __dirname,
  },
};

export default nextConfig;
