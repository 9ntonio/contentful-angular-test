const { createClient } = require("contentful");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Contentful configuration
const CONFIG = {
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  homePageId: process.env.CONTENTFUL_HOME_PAGE_ID,
};

// Verify required environment variables
if (!CONFIG.space || !CONFIG.accessToken || !CONFIG.homePageId) {
  console.error("Error: Missing required environment variables in .env file");
  console.error(
    "Make sure CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN, and CONTENTFUL_HOME_PAGE_ID are set"
  );
  process.exit(1);
}

// Define paths
const ASSETS_DIR = path.join(__dirname, "../src/assets/contentful");
const DATA_DIR = path.join(__dirname, "../src/assets/data");

// Create directories if they don't exist
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Download an image from a URL to local filesystem
async function downloadImage(url, filename) {
  // Ensure URL has protocol
  if (url.startsWith("//")) {
    url = `https:${url}`;
  }

  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(path.join(ASSETS_DIR, filename));

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading image ${url}:`, error);
    throw error;
  }
}

// Create a Map to track already seen objects
const seen = new Map();

// Extract just the data we need for a product
function extractProductData(product) {
  if (!product || !product.sys || !product.sys.id) {
    return null;
  }

  // Check if we've already processed this product
  if (seen.has(product.sys.id)) {
    return seen.get(product.sys.id);
  }

  // Create a base object to avoid circular references
  const extractedProduct = {
    sys: {
      id: product.sys.id,
      type: product.sys.type,
    },
    fields: {},
  };

  // Store in seen map to handle circular references
  seen.set(product.sys.id, extractedProduct);

  if (product.fields) {
    // Copy simple fields
    extractedProduct.fields.internalName = product.fields.internalName;
    extractedProduct.fields.name = product.fields.name;
    extractedProduct.fields.description = product.fields.description;
    extractedProduct.fields.price = product.fields.price;

    // Handle main product image
    if (product.fields.featuredProductImage) {
      extractedProduct.fields.featuredProductImage = {
        sys: {
          id: product.fields.featuredProductImage.sys.id,
          type: "Asset",
        },
        fields: {
          file: {
            url: product.fields.featuredProductImage.fields?.file?.url || "",
          },
        },
      };
    }

    // Handle product images array
    if (
      product.fields.productImages &&
      Array.isArray(product.fields.productImages)
    ) {
      extractedProduct.fields.productImages = product.fields.productImages.map(
        (img) => ({
          sys: {
            id: img.sys.id,
            type: "Asset",
          },
          fields: {
            file: {
              url: img.fields?.file?.url || "",
            },
          },
        })
      );
    }
  }

  return extractedProduct;
}

// Extract homepage data
function extractHomepageData(homepage) {
  if (!homepage || !homepage.fields) {
    return null;
  }

  return {
    sys: {
      id: homepage.sys.id,
      type: homepage.sys.type,
    },
    fields: {
      internalName: homepage.fields.internalName,
      heroBannerHeadline: homepage.fields.heroBannerHeadline,
      heroBannerImage: homepage.fields.heroBannerImage
        ? {
            sys: {
              id: homepage.fields.heroBannerImage.sys.id,
              type: "Asset",
            },
            fields: {
              file: {
                url: homepage.fields.heroBannerImage.fields?.file?.url || "",
              },
            },
          }
        : null,
    },
  };
}

async function main() {
  try {
    // Create client
    const client = createClient({
      space: CONFIG.space,
      accessToken: CONFIG.accessToken,
    });

    console.log("Fetching homepage data from Contentful...");

    // Get homepage data
    const homepage = await client.getEntry(CONFIG.homePageId, { include: 5 });

    console.log("Processing data...");

    // Extract list of products
    const products = homepage.fields.products || [];
    console.log(`Found ${products.length} products`);

    // Extract asset URLs from homepage
    const assetUrls = new Map();
    const assetNames = new Map();

    // Add hero banner image if it exists
    if (
      homepage.fields.heroBannerImage &&
      homepage.fields.heroBannerImage.fields &&
      homepage.fields.heroBannerImage.fields.file &&
      homepage.fields.heroBannerImage.fields.file.url
    ) {
      const id = homepage.fields.heroBannerImage.sys.id;
      const url = homepage.fields.heroBannerImage.fields.file.url;
      const filename =
        homepage.fields.heroBannerImage.fields.file.fileName || "image.jpg";
      assetUrls.set(id, url);
      assetNames.set(id, filename);
    }

    // Add product images
    products.forEach((product) => {
      // Featured image
      if (
        product.fields.featuredProductImage &&
        product.fields.featuredProductImage.fields &&
        product.fields.featuredProductImage.fields.file &&
        product.fields.featuredProductImage.fields.file.url
      ) {
        const id = product.fields.featuredProductImage.sys.id;
        const url = product.fields.featuredProductImage.fields.file.url;
        const filename =
          product.fields.featuredProductImage.fields.file.fileName ||
          "image.jpg";
        assetUrls.set(id, url);
        assetNames.set(id, filename);
      }

      // Product images array
      if (
        product.fields.productImages &&
        Array.isArray(product.fields.productImages)
      ) {
        product.fields.productImages.forEach((img) => {
          if (img.fields && img.fields.file && img.fields.file.url) {
            const id = img.sys.id;
            const url = img.fields.file.url;
            const filename = img.fields.file.fileName || "image.jpg";
            assetUrls.set(id, url);
            assetNames.set(id, filename);
          }
        });
      }
    });

    console.log(`Found ${assetUrls.size} unique assets to download`);

    // Download all assets
    const assetMap = new Map();
    for (const [id, url] of assetUrls.entries()) {
      const filename = `${id}_${assetNames.get(id)}`;
      try {
        await downloadImage(url, filename);
        assetMap.set(id, `/assets/contentful/${filename}`);
        console.log(`Downloaded: ${filename}`);
      } catch (error) {
        console.error(`Failed to download asset ${id}:`, error);
        assetMap.set(id, url.startsWith("//") ? `https:${url}` : url);
      }
    }

    // Extract and simplify data
    const extractedHomepage = extractHomepageData(homepage);
    const extractedProducts = products.map(extractProductData).filter(Boolean);

    // Update asset URLs to local paths
    if (
      extractedHomepage.fields.heroBannerImage &&
      assetMap.has(extractedHomepage.fields.heroBannerImage.sys.id)
    ) {
      extractedHomepage.fields.heroBannerImage.fields.file.url = assetMap.get(
        extractedHomepage.fields.heroBannerImage.sys.id
      );
    }

    extractedProducts.forEach((product) => {
      if (
        product.fields.featuredProductImage &&
        assetMap.has(product.fields.featuredProductImage.sys.id)
      ) {
        product.fields.featuredProductImage.fields.file.url = assetMap.get(
          product.fields.featuredProductImage.sys.id
        );
      }

      if (
        product.fields.productImages &&
        Array.isArray(product.fields.productImages)
      ) {
        product.fields.productImages.forEach((img) => {
          if (assetMap.has(img.sys.id)) {
            img.fields.file.url = assetMap.get(img.sys.id);
          }
        });
      }
    });

    // Create export data
    const dataExport = {
      homepage: extractedHomepage,
      products: extractedProducts,
      meta: {
        exportDate: new Date().toISOString(),
        assetCount: assetUrls.size,
        productCount: extractedProducts.length,
      },
    };

    // Save data
    fs.writeFileSync(
      path.join(DATA_DIR, "data.json"),
      JSON.stringify(dataExport, null, 2)
    );

    console.log("Contentful data and assets downloaded successfully!");
    console.log(`Full data saved to: ${path.join(DATA_DIR, "data.json")}`);
  } catch (error) {
    console.error("Error fetching or processing Contentful data:", error);
    process.exit(1);
  }
}

// Run the script
main();
