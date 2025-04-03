// Load environment variables from .env file
require("dotenv").config();

const { execSync } = require("child_process");

// Get the management token from environment variables
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN || "";
// Use your space ID from the ContentfulService
const spaceId = process.env.CONTENTFUL_SPACE_ID || "";
// Output file path
const outputPath = "src/app/models/contentful-types.ts";

// Construct command with proper quotes around the token
const command = `npx cf-content-types-generator -s ${spaceId} -t "${managementToken}" -o ${outputPath}`;

console.log("Generating Contentful types...");
try {
  execSync(command, { stdio: "inherit" });
  console.log("Types generated successfully!");
} catch (error) {
  console.error("Error generating types:", error.message);
  process.exit(1);
}
