import { Injectable } from "@angular/core";

// !! import Contentful createClient and type for `Entry`
import { createClient, Entry } from "contentful";
// !! configure the service with tokens and content type ids

// https://contentful.github.io/contentful.js/contentful/4.5.0/index.html
const CONFIG = {
  space: "zm7rtuyvkdw4",
  accessToken: "lG_hunxKompS9qkl0dskL-W1zo7QURER4p3ta3FetDU",
};

@Injectable({
  providedIn: "root",
})
export class ContentfulService {
  private readonly _contentfulClient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken,
  });

  constructor() {}

  getHomePage(query?: object): Promise<Entry<any>> {
    // !! entry by id for homePage
    return this._contentfulClient
      .getEntry("2cayfg7wVF5WezADCHgSgL")
      .then((res) => res);
  }

  getEntries() {
    this._contentfulClient
      .getEntry("2cayfg7wVF5WezADCHgSgL")
      .then((response) => console.log(response))
      .catch(console.error);
  }
}
