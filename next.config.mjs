/** @type {import('next').NextConfig} */
import envsConfig from './envs.js';
const envs = envsConfig[process.env.MODE];
if (envs) {
  Object.keys(envs).forEach((key) => {
    process.env[key] = envs[key];
  });
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        // hostname: '*.overtrade.pro',
      },
    ],
  },
  webpack: (config, { webpack }) => {
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
