import { Injectable } from "@angular/core";
import {
  createClient,
  ContentfulCollection,
  Entry,
  ChainModifiers,
} from "contentful";
// Import the types generated by contentful-ts-generator
import {
  TypePageLanding,
  TypePageProduct,
  TypePageLandingSkeleton,
  TypePageProductSkeleton,
} from "../models/contentful-types.ts";
import { environment } from "../../environments/environment";

// Get configuration from Angular environment
const CONFIG = {
  space: environment.contentful.space,
  accessToken: environment.contentful.accessToken,
  homePageId: environment.contentful.homePageId,
};

@Injectable({
  providedIn: "root",
})
export class ContentfulService {
  // Create Contentful client with space and access token
  private readonly _contentfulClient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken,
  });

  constructor() {}

  /**
   * Get the home page entry from Contentful
   * @param query Optional query parameters
   * @returns Promise with typed HomePage entry
   */
  getHomePage(query?: object): Promise<TypePageLanding<ChainModifiers>> {
    // Get entry by ID for homePage with proper typing
    return this._contentfulClient
      .getEntry<TypePageLandingSkeleton>(CONFIG.homePageId)
      .then((res) => res as unknown as TypePageLanding<ChainModifiers>);
  }

  /**
   * Get all products from Contentful
   * @returns Promise with collection of typed Product entries
   */
  getProducts(): Promise<
    ContentfulCollection<TypePageProduct<ChainModifiers>>
  > {
    // Get entries with content type filter for products
    return this._contentfulClient.getEntries<TypePageProductSkeleton>({
      content_type: "pageProduct", // Match the contentTypeId from the skeleton
    });
  }

  /**
   * Log home page entry to console (for debugging)
   */
  getEntries(): void {
    this._contentfulClient
      .getEntry<TypePageLandingSkeleton>(CONFIG.homePageId)
      .then((response) => console.log(response))
      .catch(console.error);
  }
}
