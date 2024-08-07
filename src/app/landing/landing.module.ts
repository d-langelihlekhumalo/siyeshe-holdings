import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LandingPageRoutingModule } from './landing-routing.module';

import { LandingPage } from './landing.page';
import { SwiperModule } from 'swiper/angular';
import { ProductItemComponent } from './product-item/product-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingPageRoutingModule,
    SwiperModule
  ],
  declarations: [LandingPage, ProductItemComponent]
})
export class LandingPageModule {}
