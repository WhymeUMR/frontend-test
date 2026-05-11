import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Запросы к tablecrm API идут из браузера напрямую — прокси не нужен.
  // Если потребуется серверный прокси — раскомментируйте rewrites ниже.
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/tablecrm/:path*",
  //       destination: "https://app.tablecrm.com/api/v1/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
