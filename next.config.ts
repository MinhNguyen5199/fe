import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.77','local-origin.dev', '*.local-origin.dev'],
};

export default nextConfig;