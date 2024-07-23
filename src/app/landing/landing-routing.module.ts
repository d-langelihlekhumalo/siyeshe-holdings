import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPage } from './landing.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'delivery-options',
    loadChildren: () => import('./delivery-options/delivery-options.module').then( m => m.DeliveryOptionsPageModule)
  },
  {
    path: ':productId',
    loadChildren: () => import('./landing-product-detail/landing-product-detail.module').then( m => m.LandingProductDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
