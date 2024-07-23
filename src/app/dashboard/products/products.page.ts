/* eslint-disable max-len */
import { AfterContentInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, LoadingController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FeaturedDepartmentProducts } from 'src/app/modals/featured-departments-product.modal';
import { BuildingMaterialsService } from '../../services/building-materials.service';
import { FeaturedDepartmentsService } from '../../services/featured-departments.service';
import { BuildingMaterial } from '../../modals/building-materials-product.modal';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy{
  status = 'Building Material';
  isLoading = false;
  isBuildingMaterialLoading = false;
  isDisplayList = true;
  loadedProducts: BuildingMaterial[];
  loadedFeaturedProducts: FeaturedDepartmentProducts[];

  private featuredProductsSubscription: Subscription;
  private buildingMaterialSubscription: Subscription;

  constructor(
    private buildingMaterialService: BuildingMaterialsService,
    private featuredProducts: FeaturedDepartmentsService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {

    this.featuredProductsSubscription = this.featuredProducts.products.subscribe(products => {
      this.loadedFeaturedProducts = products;
      this.isLoading = false;
    });

    this.buildingMaterialSubscription = this.buildingMaterialService.products.subscribe(products => {
      this.loadedProducts = products;
      this.isBuildingMaterialLoading = false;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.isBuildingMaterialLoading = true;

    this.featuredProducts.fetchFeaturedProducts().subscribe();
    this.buildingMaterialService.fetchBuildingMaterials().subscribe();
  }

  toggleView() {
    this.isDisplayList = !this.isDisplayList;
  }

  displayDetailedProducts(productId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl('/dashboard/tabs/products/' + productId);
  }

  displayProductsCart(productId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl('/dashboard/tabs/products/cart/' + productId);
  }

  displayProductDetails(productId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl('/landing/' + productId);
  }

  // addFeaturedDepartmentProduct() {
    // This code adds a product to the database
  // const directory = '../../assets/landing_page/coming_soon/';
  //  const featuredProducts: FeaturedDepartmentProducts[] = [
  //  ];

  //  featuredProducts.forEach(element => {
  //    this.loadingCtrl.create({
  //     message: 'Adding a product'
  //   }).then(loadingEl => {
  //     loadingEl.present();
  //     this.featuredProducts.addFeaturedProduct(element).subscribe(() => {
  //       loadingEl.dismiss();
  //     });
  //   });
  //  });
  // }

  //   addBuildingMaterialProduct() {
  //   // This code adds a product to the database
  //   const directory = '../../assets/products/building_materials/';
  //   const imgDir = '../../assets/products/details/';
  //   const buildingMaterial: BuildingMaterial[] = [

  //   ];

  //   buildingMaterial.forEach(element => {
  //     this.loadingCtrl.create({
  //       message: 'Adding a product'
  //     }).then(loadingEl => {
  //       loadingEl.present();
  //       this.buildingMaterialService.addFeaturedProduct(element).subscribe(() => {
  //         loadingEl.dismiss();
  //       });
  //     });
  //   });
  // }

  ngOnDestroy(): void {
    if (this.featuredProductsSubscription) {
      this.featuredProductsSubscription.unsubscribe();
    }

    if (this.buildingMaterialSubscription) {
      this.buildingMaterialSubscription.unsubscribe();
    }
  }
}
