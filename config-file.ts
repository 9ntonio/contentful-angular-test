import { Config } from 'contentful-ts-generator';

// Configuration for contentful-ts-generator
const config: Config = {
  // Your Contentful space ID - using the same one from your service
  spaceId: 'zm7rtuyvkdw4',
  
  // Your Contentful management token (different from your delivery/preview token)
  // You need to create this in the Contentful web app under Settings > API Keys
  managementToken: 'YOUR_CONTENTFUL_MANAGEMENT_TOKEN',
  
  // Output directory for generated types relative to project root
  outputPath: './src/app/models',
  
  // Base file name for the generated types
  filename: 'contentful-types',
  
  // Include rich text fields
  includeTags: true,
  includeRichTextReferences: true,
  
  // Generate more readable interface names
  cleanupNames: true,
  
  // Add field descriptions as JSDoc comments
  addJSDocDescriptions: true,
  
  // Include content type IDs in the generated types
  includeContentTypeIdInEnum: true,
};

export default config;
