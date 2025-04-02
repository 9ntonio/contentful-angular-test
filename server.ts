/**
 * Server-side Rendering Configuration for Contentful Integration
 *
 * This file sets up a Node.js Express server with Angular Universal for server-side rendering.
 * SSR is crucial for Contentful-backed sites to ensure:
 *  - Content is fully indexable by search engines (better SEO for Contentful content)
 *  - Faster initial page loads for content-heavy pages with Contentful assets
 *  - Social media sharing shows proper previews of Contentful content
 */

import { APP_BASE_HREF } from "@angular/common";
import { CommonEngine } from "@angular/ssr";
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import bootstrap from "./src/main.server";

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, "../browser");
  const indexHtml = join(serverDistFolder, "index.server.html");

  const commonEngine = new CommonEngine();

  server.set("view engine", "html");
  server.set("views", browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Potential use: Create proxy endpoints to Contentful API to protect access tokens

  // Serve static files from /browser
  // This handles Contentful assets that have been downloaded during build
  // or are referenced by the application
  server.get(
    "*.*",
    express.static(browserDistFolder, {
      maxAge: "1y", // Long cache time for Contentful assets improves performance
    })
  );

  // All regular routes use the Universal engine
  // This ensures Contentful content is pre-rendered on the server for:
  // - SEO optimization (search engines can index Contentful content)
  // - Faster initial load times for content-heavy pages
  // - Social media sharing with proper meta tags
  server.get("*", (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env["PORT"] ?? 4000;

  // Start up the Node server
  // This enables delivery of pre-rendered Contentful content to clients
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
