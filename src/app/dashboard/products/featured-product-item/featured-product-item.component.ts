import { Component, Input, OnInit } from '@angular/core';
import { FeaturedDepartmentProducts } from '../../../modals/featured-departments-product.modal';

@Component({
  selector: 'app-featured-product-item',
  templateUrl: './featured-product-item.component.html',
  styleUrls: ['./featured-product-item.component.scss'],
})
export class FeaturedProductItemComponent implements OnInit {
  @Input() product: FeaturedDepartmentProducts;

  constructor() { }

  ngOnInit() {}

}
