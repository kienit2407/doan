// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     experimental: {
//     },
//   };

//   export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "cdn.tgdd.vn",
      "sakos.vn",
      "cdn.unityfitness.vn",
      "img-global.cpcdn.com",
      "bizweb.dktcdn.net",
      "tiki.vn",
      "vietfood.org.vn",
    ],
    unoptimized: true, // Thêm option này để tránh lỗi với external images
  },
};

export default nextConfig;
