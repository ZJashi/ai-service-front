import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl)
      throw new Error("BACKEND_URL environment variable is not set");

    return [
      {
        source: "/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;