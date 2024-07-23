import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FeaturedDepartmentsService } from '../../services/featured-departments.service';
import { FeaturedDepartmentProducts } from '../../modals/featured-departments-product.modal';

@Component({
  selector: 'app-landing-product-detail',
  templateUrl: './landing-product-detail.page.html',
  styleUrls: ['./landing-product-detail.page.scss'],
})
export class LandingProductDetailPage implements OnInit, OnDestroy {
  product: FeaturedDepartmentProducts;
  featuredProductSubscription: Subscription;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private featuredDepartmentsService: FeaturedDepartmentsService
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if(!paramMap.has('productId')) {
        this.navController.navigateBack('/landing');
        return;
      }

      this.isLoading = true;

      this.featuredProductSubscription = this.featuredDepartmentsService.getProduct(paramMap.get('productId')).subscribe(product => {
        this.product = product;
        this.isLoading = false;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.featuredProductSubscription) {
      this.featuredProductSubscription.unsubscribe();
    }
  }

}
