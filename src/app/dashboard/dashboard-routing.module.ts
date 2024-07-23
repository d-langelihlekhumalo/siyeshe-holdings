import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: DashboardPage,
    children: [
      {
        path: 'calculator',
        loadChildren: () => import('./calculator/calculator.module').then( m => m.CalculatorPageModule)
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
          },
          {
            path: 'cart/:productId',
            loadChildren: () => import('./products/product-cart/product-cart.module').then(m => m.ProductCartPageModule)
          },
          {
            path: ':productId',
            loadChildren: () => import('./products/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
          }
        ]
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
          },
          {
            path: 'edit/:orderId',
            loadChildren: () => import('./orders/edit/edit.module').then( m => m.EditPageModule)
          }
        ]
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
          },
          // {
          //   path: ':productId',
          //   loadChildren: () => import('./cart/cart-item/cart-item.component').then( m => m.CartItemComponent)
          // }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
          },
          {
            path: 'edit/:profileId',
            loadChildren: () => import('./user-profile/edit/edit.module').then( m => m.EditPageModule)
          }
        ]
      },
      {
        path: 'faqs',
        children: [
          {
            path: '',
            loadChildren: () => import('./faqs/faqs.module').then( m => m.FaqsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/dashboard/tabs/products',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard/tabs/products',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
