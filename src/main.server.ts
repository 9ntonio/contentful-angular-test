/**
 * Server-side Application Entry Point
 *
 * This file serves as the entry point for Angular's server-side rendering (SSR) functionality.
 * SSR is particularly important when working with Contentful as it provides:
 *
 * - Improved SEO: Server-rendered content is fully available to search engines, ensuring
 *   Contentful-managed content is properly indexed
 *
 * - Faster initial load: Visitors see content immediately while the client-side app bootstraps,
 *   improving Core Web Vitals for content-rich Contentful pages
 *
 * - Better social media sharing: Open Graph and other social preview data renders properly
 *   when pages are accessed via social media links
 */

import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { config } from "./app/app.config.server";

// Bootstrap function that initializes the Angular application on the server
// This function will be used by the Angular Universal engine to render the application
const bootstrap = () => bootstrapApplication(AppComponent, config);

// Export the bootstrap function as the default export
// This allows Angular Universal to import and use it for server-side rendering
export default bootstrap;
