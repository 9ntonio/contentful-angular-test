// scripts/generate-routes.ts
import { createClient } from "contentful";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

/**
 * Simple script to generate static routes for Angular prerendering
 * For this ecommerce template, we're just generating the home and products route
 */

// Load environment variables
dotenv.config();

const CONFIG = {
  space: process.env["CONTENTFUL_SPACE_ID"],
  accessToken: process.env["CONTENTFUL_ACCESS_TOKEN"],
  environment: process.env["CONTENTFUL_ENVIRONMENT"],
  homePageId: process.env["HOME_PAGE_ID"],
};

async function generateRoutes() {
  const client = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken,
    environment: CONFIG.environment,
  });

  try {
    // Get homepage data
    const homepage = await client.getEntry(CONFIG.homePageId);
    const routes = ["/"];

    // Write routes to a JSON file
    const routesConfig = {
      routes: routes,
    };

    const outputPath = path.join(process.cwd(), "src", "assets", "routes.json");
    fs.writeFileSync(outputPath, JSON.stringify(routesConfig, null, 2));
    console.log("Routes generated successfully:", routes);
  } catch (error) {
    console.error("Error generating routes:", error);
    process.exit(1);
  }
}

// Run the generator
generateRoutes();
