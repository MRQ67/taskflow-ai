import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { Route } from "./+types/root";
import "./app.css";

export function loader() {
  return {
    ENV: {
      VITE_CONVEX_URL: process.env.VITE_CONVEX_URL,
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const convexUrl = typeof window !== "undefined" 
    ? (window as any).ENV?.VITE_CONVEX_URL 
    : loaderData?.ENV?.VITE_CONVEX_URL || "";

  if (!convexUrl) {
    throw new Error("Missing VITE_CONVEX_URL environment variable");
  }

  const convex = new ConvexReactClient(convexUrl);

  return (
    <ConvexProvider client={convex}>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(loaderData?.ENV || {})};`,
        }}
      />
      <Outlet />
    </ConvexProvider>
  );
}