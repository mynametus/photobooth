import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
  experimental: { workerThreads: true, cpus: 2, useTypeScriptCli: false },
};

export default nextConfig;
