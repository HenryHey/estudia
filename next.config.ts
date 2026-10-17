import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/flashcards", destination: "/", permanent: true },
      { source: "/comarques", destination: "/geografia/comarques", permanent: true },
      {
        source: "/comarques/:provincia",
        destination: "/geografia/comarques/:provincia",
        permanent: true,
      },
      { source: "/geografia/barcelona", destination: "/geografia/comarques/barcelona", permanent: true },
      { source: "/geografia/lleida", destination: "/geografia/comarques/lleida", permanent: true },
      {
        source: "/geografia/tarragona",
        destination: "/geografia/comarques/tarragona",
        permanent: true,
      },
      { source: "/geografia/girona", destination: "/geografia/comarques/girona", permanent: true },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
