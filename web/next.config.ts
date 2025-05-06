import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.50.24',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ai-visa.oss-ap-southeast-1.aliyuncs.com',
        port: '',
        pathname: '/cms/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.anyconverters.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'osscdn.anyconverters.com',
        port: '',
        pathname: '/cms/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: "/:locale/markdown-to-html",
        destination: "/:locale/products/markdown-to-html",
        permanent: true
      },
      {
        source: "/:locale/images-to-pdf",
        destination: "/:locale/products/images-to-pdf",
        permanent: true
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  webpack: (config, {isServer}) => {
    // If client-side (browser), provide empty module fallbacks for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        http2: false,
        path: false,
        os: false,
        stream: false,
        zlib: false,
      };
    }

    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
