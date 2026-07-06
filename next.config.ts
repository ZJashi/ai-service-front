import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '');
    if (!backendUrl)
      throw new Error("BACKEND_URL environment variable is not set");
    if (!/^https?:\/\//.test(backendUrl))
      throw new Error(`BACKEND_URL must start with http:// or https://, got: ${backendUrl}`);

    return [
      {
        source: "/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;