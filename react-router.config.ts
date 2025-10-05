// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  // App directory
  appDirectory: "app",
  
  // Ignore route files starting with .
  ignoredRouteFiles: ["**/*.css", "**/*.test.{ts,tsx}"],
  
  // Server build directory
  serverBuildFile: "index.js",
  
  // Tailwind support
  tailwind: true,
} satisfies Config;