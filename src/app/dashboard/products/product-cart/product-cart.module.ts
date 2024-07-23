import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductCartPageRoutingModule } from './product-cart-routing.module';

import { ProductCartPage } from './product-cart.page';
import { ProductCartItemComponent } from './product-cart-item/product-cart-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductCartPageRoutingModule
  ],
  declarations: [ProductCartPage, ProductCartItemComponent]
})
export class ProductCartPageModule {}
