import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["assets.aceternity.com", "images.unsplash.com","plus.unsplash.com"],
  },
};

export default nextConfig;
