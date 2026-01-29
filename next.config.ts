import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  trailingSlash: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.mainFields = ["browser", "module", "main"];
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
