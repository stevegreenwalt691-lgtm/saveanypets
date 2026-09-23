import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // A resized 1600px webp photo is normally well under 1MB, but leave headroom
      // for multipart overhead and the occasional larger source image.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
