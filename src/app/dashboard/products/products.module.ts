import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { FeaturedProductItemComponent } from './featured-product-item/featured-product-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    FormsModule
  ],
  declarations: [ProductsPage, FeaturedProductItemComponent],
})
export class ProductsPageModule {}
