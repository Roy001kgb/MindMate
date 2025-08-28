/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    loader: 'custom',
    loaderFile: './lib/imageLoader.js'
  },
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  assetPrefix: '',
  basePath: '',
  experimental: {
    esmExternals: false
  }
};

module.exports = nextConfig;