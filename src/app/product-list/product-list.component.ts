import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentfulService } from "../services/contentful.service";
import { Entry } from "contentful";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class ProductListComponent implements OnInit {
  public products: Entry<any>[] = [];
  public homePage: Entry<any> | null = null;
  public isLoading = true;
  public hasError = false;

  constructor(private readonly _contentfulService: ContentfulService) {
    console.log("ProductListComponent initialized");
  }

  ngOnInit() {
    console.log("ProductListComponent ngOnInit");
    this._contentfulService
      .getHomePage()
      .then((data: Entry<any>) => {
        console.log("Data received in component:", data);
        this.homePage = data;

        // Extract products from the homepage fields
        const fields = data.fields as Record<string, any>;
        if (fields["products"] && Array.isArray(fields["products"])) {
          this.products = fields["products"];
          console.log("Products loaded:", this.products.length);

          // Log details of each product
          this.products.forEach((product, index) => {
            console.log(`Product ${index + 1}:`, product.fields);
          });
        } else {
          console.warn("No products array found in data:", fields);
        }

        this.isLoading = false;
      })
      .catch((error) => {
        console.error("Error in component:", error);
        this.hasError = true;
        this.isLoading = false;
      });
  }

  // Safer getters for product fields with null checks
  getProductName(product: any): string {
    return (
      product?.fields?.internalName ||
      product?.fields?.name ||
      "Unnamed Product"
    );
  }

  getProductDescription(product: any): string {
    return product?.fields?.description || "No description available";
  }

  getProductPrice(product: any): string {
    return product?.fields?.price
      ? `$${product.fields.price}`
      : "Price not available";
  }

  getFeaturedProductImageUrl(product: any): string | null {
    // First try featuredProductImage
    if (product?.fields?.featuredProductImage?.fields?.file?.url) {
      return product.fields.featuredProductImage.fields.file.url;
    }

    // Then try productImages array
    if (
      product?.fields?.productImages &&
      Array.isArray(product.fields.productImages) &&
      product.fields.productImages[0]?.fields?.file?.url
    ) {
      return product.fields.productImages[0].fields.file.url;
    }

    return null;
  }

  getHeroImageUrl(homePage: any): string | null {
    // Safe access to nested properties
    try {
      const bannerImage = homePage?.fields?.["heroBannerImage"];
      if (
        bannerImage &&
        typeof bannerImage === "object" &&
        bannerImage.fields &&
        bannerImage.fields.file
      ) {
        return bannerImage.fields.file.url;
      }
    } catch (error) {
      console.error("Error accessing hero image:", error);
    }
    return null;
  }
}
