import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        port: "8080",
        pathname: "/api/files/**",
        protocol: "http",
        search: "",
      },
    ],
    // domains: ["localhost"],
  },
};

export default nextConfig;
