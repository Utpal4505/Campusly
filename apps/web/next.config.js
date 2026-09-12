/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/club',
        destination: '/clubs',
        permanent: true,
      },
      {
        source: '/club/:slug*',
        destination: '/clubs/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
