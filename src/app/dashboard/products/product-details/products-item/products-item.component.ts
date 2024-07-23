import { Component, Input, OnInit } from '@angular/core';
import { BuildingMaterial } from '../../../../modals/building-materials-product.modal';

@Component({
  selector: 'app-products-item',
  templateUrl: './products-item.component.html',
  styleUrls: ['./products-item.component.scss'],
})
export class ProductsItemComponent implements OnInit {
  @Input() productsItem: BuildingMaterial;

  constructor() { }

  ngOnInit() {}

}
