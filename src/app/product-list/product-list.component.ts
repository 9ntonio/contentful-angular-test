import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentfulService } from '../services/contentful.service';
import { Entry } from 'contentful';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ProductListComponent implements OnInit {
  public products: Entry<any>[] = [];

  constructor(private readonly _contentfulService: ContentfulService) {}

  // !! Contentful data on init
  ngOnInit() {
    this._contentfulService.getProducts().then((products) => {
      this.products = products;
    });
  }
}
