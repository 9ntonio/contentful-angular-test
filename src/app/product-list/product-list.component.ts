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
  public products: Entry[] = [];
  public homePage: Entry | null = null;

  constructor(private readonly _contentfulService: ContentfulService) {}

  ngOnInit() {
    this._contentfulService.getEntries();
    this._contentfulService.getHomePage().then((data: Entry) => {
      this.homePage = data;
      this.products = (data.fields as Record<string, any>)["products"];
    });
  }

  getProductImageUrl(product: Entry): string | null {
    const fields = product?.fields as Record<string, any>;
    const image = fields?.["productImages"];
    return image[0]?.fields?.file?.url || null;
  }

  getFeaturedProductImageUrl(product: Entry): string | null {
    const fields = product?.fields as Record<string, any>;
    const productImage = fields?.["featuredProductImage"];
    return productImage?.fields?.file?.url || null;
  }

  getHeroImageUrl(homePage: Entry): string | null {
    const fields = homePage?.fields as Record<string, any>;
    const heroImage = fields?.["heroBannerImage"];
    return heroImage?.fields?.file?.url || null;
  }
}
