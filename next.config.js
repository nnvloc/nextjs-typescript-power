const path = require('path');
console.log(__dirname);
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles'),
      path.join(__dirname, 'src/components/**/*.module.scss')
    ],
  },
  // experimental: {
  //   images: {
  //     allowFutureImage: true,
  //   }
  // },
  // images: {
  //   domains: ['tailwindui.com'],
  //   // formats: ["image/webp"],
  // },
}

module.exports = nextConfig
