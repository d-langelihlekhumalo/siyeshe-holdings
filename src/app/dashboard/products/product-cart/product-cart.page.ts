import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingMaterialsService } from '../../../services/building-materials.service';
import { BuildingMaterial } from '../../../modals/building-materials-product.modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.page.html',
  styleUrls: ['./product-cart.page.scss'],
})
export class ProductCartPage implements OnInit, OnDestroy {
  loadedProduct: BuildingMaterial;
  buildingMaterialsSubscription: Subscription;
  isLoading = false;

  constructor(
    private buildingMaterialService: BuildingMaterialsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('productId')) {
        this.router.navigateByUrl('dashboard/tabs/products');
        return;
      }

      this.isLoading = true;

      this.buildingMaterialsSubscription = this.buildingMaterialService.getProduct(paramMap.get('productId')).subscribe(product => {
        this.loadedProduct = product;
        this.isLoading = false;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.buildingMaterialsSubscription) {
      this.buildingMaterialsSubscription.unsubscribe();
    }
  }

}
