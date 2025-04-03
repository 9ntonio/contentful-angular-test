import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContentfulService } from "../services/contentful.service";
// Import the generated types
import {
  TypePageLanding,
  TypePageProduct,
} from "../models/contentful-types.ts";
import { Asset, ChainModifiers } from "contentful";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class ProductListComponent implements OnInit {
  // Use specific types instead of generic Entry[]
  public products: TypePageProduct<ChainModifiers>[] = [];
  public homePage: TypePageLanding<ChainModifiers> | null = null;

  constructor(private readonly _contentfulService: ContentfulService) {}

  ngOnInit() {
    // Get home page data with products
    this._contentfulService.getEntries();
    this._contentfulService
      .getHomePage()
      .then((data: TypePageLanding<ChainModifiers>) => {
        this.homePage = data;
        // Extract products from the home page
        if (data.fields.products && Array.isArray(data.fields.products)) {
          // !! Type assertion to handle Contentful's complex typing
          // !! Double type assertion with 'unknown' as intermediate step is used because:
          // !! 1. Contentful's nested reference structure creates complex typing challenges
          // !! 2. Direct type assertion might not be allowed by TypeScript
          // !! 3. Using 'unknown' as intermediate step is more type-safe than direct assertion
          this.products = data.fields.products.map(
            (entry) => entry as unknown as TypePageProduct<ChainModifiers>
          );
        }
      });
  }

  /**
   * Get URL for product image
   * @param product The product entry
   * @returns Image URL or null if not available
   */
  getProductImageUrl(product: TypePageProduct<ChainModifiers>): string | null {
    if (
      !product?.fields?.productImages ||
      !Array.isArray(product.fields.productImages) ||
      product.fields.productImages.length === 0
    ) {
      return null;
    }

    const asset = product.fields.productImages[0] as Asset<ChainModifiers>;
    return asset?.fields?.file?.url ? asset.fields.file.url.toString() : null;
  }

  /**
   * Get URL for featured product image
   * @param product The product entry
   * @returns Image URL or null if not available
   */
  getFeaturedProductImageUrl(
    product: TypePageProduct<ChainModifiers>
  ): string | null {
    if (!product?.fields?.featuredProductImage) {
      return null;
    }

    const asset = product.fields.featuredProductImage as Asset<ChainModifiers>;
    return asset?.fields?.file?.url ? asset.fields.file.url.toString() : null;
  }

  /**
   * Get URL for hero banner image
   * @param homePage The home page entry
   * @returns Image URL or null if not available
   */
  getHeroImageUrl(homePage: TypePageLanding<ChainModifiers>): string | null {
    if (!homePage?.fields?.heroBannerImage) {
      return null;
    }

    const asset = homePage.fields.heroBannerImage as Asset<ChainModifiers>;
    return asset?.fields?.file?.url ? asset.fields.file.url.toString() : null;
  }
}
