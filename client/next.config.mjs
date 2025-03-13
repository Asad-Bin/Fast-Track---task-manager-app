// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["localhost", "avatars.githubusercontent.com"],
//   },
// };

// export default nextConfig;

export const images = {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      pathname: '/**',
    },
    {
      protocol: 'http',
      hostname: 'avatars.githubusercontent.com',
      pathname: '/**',
    },
  ],
};
