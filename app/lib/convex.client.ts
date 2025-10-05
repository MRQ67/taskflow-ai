import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.CONVEX_DEPLOYMENT || "";

if (!convexUrl) {
  throw new Error("Missing CONVEX_DEPLOYMENT environment variable");
}

export const convex = new ConvexReactClient(convexUrl);