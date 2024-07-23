import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LandingProductDetailPageRoutingModule } from './landing-product-detail-routing.module';

import { LandingProductDetailPage } from './landing-product-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingProductDetailPageRoutingModule
  ],
  declarations: [LandingProductDetailPage]
})
export class LandingProductDetailPageModule {}
