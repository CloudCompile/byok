/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['bcryptjs', '@aws-sdk/client-bedrock-runtime'],
};

module.exports = nextConfig;
