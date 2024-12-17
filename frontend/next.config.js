/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'gateway.pinata.cloud',  // 添加 IPFS 网关域名
    ],
  },
}

module.exports = nextConfig
