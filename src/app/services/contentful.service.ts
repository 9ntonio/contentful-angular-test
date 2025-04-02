import { Injectable } from "@angular/core";
import { createClient, Entry } from "contentful";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ContentfulService {
  private readonly _contentfulClient = createClient({
    space: environment.contentful.space,
    accessToken: environment.contentful.accessToken,
  });

  constructor(private readonly http: HttpClient) {
    console.log("ContentfulService initialized");
  }

  async getHomePage(): Promise<Entry<any>> {
    console.log("Fetching homepage data...");

    try {
      // First try to get local data (for production/static builds)
      const data = await this.getLocalData();

      // Reconstruct homepage with products
      const homepageWithProducts = {
        ...data.homepage,
        fields: {
          ...data.homepage.fields,
          products: data.products,
        },
      };

      console.log(
        `Loaded homepage with ${data.products.length} products from local data`
      );
      return homepageWithProducts as Entry<any>;
    } catch (error) {
      console.log("Local data not available, fetching from Contentful API");

      // Fallback to API (for development)
      return this._contentfulClient
        .getEntry(environment.contentful.homePageId, {
          include: 10,
        })
        .then((entry) => {
          console.log("Homepage data received from API");
          return entry;
        });
    }
  }

  private async getLocalData(): Promise<any> {
    try {
      // Load the complete data file that has homepage and products
      const data = await firstValueFrom(
        this.http.get<any>("/assets/data/data.json")
      );
      console.log("Data loaded from local file");
      return data;
    } catch (error) {
      console.error("Error loading local data:", error);
      throw error;
    }
  }

  // We'll let the component handle URLs instead of processing them in the service
}
