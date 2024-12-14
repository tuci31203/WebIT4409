import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: config => {
    config.externals = config.externals || []
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil'
    })
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/9.x/**'
      }
    ]
    // domains: ["uploadthing.com"],
  },
  transpilePackages: ['next-auth']
  // productionBrowserSourceMaps: false,
}

export default nextConfig
