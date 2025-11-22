import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    domains: [
      "lh3.googleusercontent.com", // allow Google-hosted images
      "images.unsplash.com",       // optional if you use Unsplash later
      "cdn-icons-png.flaticon.com", // optional for icons
      "d33wubrfki0l68.cloudfront.net",
      "res.cloudinary.com"
    ],
  },
};

export default nextConfig;
