import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { Route } from "./+types/root";
import "./tailwind.css";

const convex = new ConvexReactClient(
  typeof window !== "undefined" 
    ? (window as any).ENV.CONVEX_DEPLOYMENT 
    : ""
);

export function loader() {
  return {
    ENV: {
      CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
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
  return (
    <ConvexProvider client={convex}>
      <Outlet />
    </ConvexProvider>
  );
}