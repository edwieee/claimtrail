/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // pdfjs-dist relies on Node built-ins and optional worker assets; loading it
  // from node_modules at runtime avoids server-bundle parse failures.
  serverExternalPackages: ['pdfjs-dist'],
};

module.exports = nextConfig;
