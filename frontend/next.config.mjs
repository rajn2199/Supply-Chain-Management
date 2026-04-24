// next.config.mjs
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // ✅ Fix MetaMask async-storage error
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': 
        path.resolve(__dirname, './mocks/async-storage-mock.js'),
    };

    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;