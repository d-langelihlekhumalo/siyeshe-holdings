import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingProductDetailPage } from './landing-product-detail.page';

const routes: Routes = [
  {
    path: '',
    component: LandingProductDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingProductDetailPageRoutingModule {}
