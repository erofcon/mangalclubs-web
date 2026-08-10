import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiRemotePattern = apiUrl ? new URL(apiUrl) : null;

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: apiRemotePattern
        ? [
            {
              protocol: apiRemotePattern.protocol.replace(":", "") as "http" | "https",
              hostname: apiRemotePattern.hostname,
              port: apiRemotePattern.port,
              pathname: "/**",
            },
          ]
        : [],
  },
  async rewrites() {
    if (!apiUrl) {
      return [];
    }

    return [
      {
        source: "/health",
        destination: `${apiUrl.replace(/\/+$/, "")}/health`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl.replace(/\/+$/, "")}/api/v1/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${apiUrl.replace(/\/+$/, "")}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
