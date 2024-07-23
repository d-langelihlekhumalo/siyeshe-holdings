import { Component, Input, OnInit } from '@angular/core';
import { FeaturedDepartmentProducts } from '../../modals/featured-departments-product.modal';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() product: FeaturedDepartmentProducts;

  constructor() { }

  ngOnInit() {}

}
