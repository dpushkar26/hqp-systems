import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["motion", "framer-motion", "motion-dom"],
  webpack: (config) => {
    // Ensure Webpack can resolve packages hoisted to the monorepo root
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "../../node_modules"),
      "node_modules",
    ];
    return config;
  },
};

export default nextConfig;
