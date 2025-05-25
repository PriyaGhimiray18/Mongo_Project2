/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // Disable font optimization temporarily
  optimizeFonts: false,
  // Add transpilePackages if needed
  transpilePackages: ['@prisma/client'],
}

export default nextConfig
