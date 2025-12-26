import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  output: 'export',   // <--- ⭐ 이 줄을 반드시 추가하세요! (안드로이드 필수)
  images: {
    unoptimized: true, // <--- ⭐ 이미지 최적화 끄기 (안드로이드에서 이미지 엑박 방지)
  }
};

export default withPWA(nextConfig);