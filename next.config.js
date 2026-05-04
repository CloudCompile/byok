/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', '@aws-sdk/client-bedrock-runtime'],
  },
};

module.exports = nextConfig;
