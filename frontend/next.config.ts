import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  //when building the app, create a smaller self-contained server folder
  //that folder only include what app need to run
  output: "standalone",
};

export default nextConfig;