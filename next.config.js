// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')

module.exports = withPWA({
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  //   disable: process.env.NODE_ENV === 'development',
  // },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/create',
  //       permanent: false,
  //     },
  //   ]
  // },
})
