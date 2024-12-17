/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'gateway.pinata.cloud',  // 添加 IPFS 网关域名
    ],
  },
  // ... 其他配置
}

module.exports = nextConfig 