import { Injectable } from '@angular/core';

// !! import Contentful createClient and type for `Entry`
import { createClient, Entry } from 'contentful';
// !! configure the service with tokens and content type ids
const CONFIG = {
  space: 'wl1z0pal05vy',
  accessToken:
    '0e3ec801b5af550c8a1257e8623b1c77ac9b3d8fcfc1b2b7494e3cb77878f92a',

  contentTypeIds: {
    product: '2PqfXUJwE8qSYKuM0U6w8M',
  },
};

@Injectable({
  providedIn: 'root',
})
export class ContentfulService {
  private readonly _contentfulCLient = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken,
  });

  constructor() {}

  getProducts(query?: object): Promise<Entry[]> {
    return this._contentfulCLient
      .getEntries({
        content_type: CONFIG.contentTypeIds.product,
        ...query,
      })
      .then((res) => res.items);
  }
}
