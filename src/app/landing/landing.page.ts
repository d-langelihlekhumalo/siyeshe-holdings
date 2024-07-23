import { AfterContentChecked, Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import SwiperCore, { SwiperOptions, Pagination, Autoplay } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { FeaturedDepartmentsService } from '../services/featured-departments.service';
import { FeaturedDepartmentProducts } from '../modals/featured-departments-product.modal';

SwiperCore.use([Pagination, Autoplay]);

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('swiper') swiper: SwiperComponent;
  config: SwiperOptions = {
    slidesPerView: 1,
    pagination: true,
    autoplay: true
  };

  products: FeaturedDepartmentProducts[];
  isLoading = false;
  private featuredProductsSubscription: Subscription;

  constructor(
    private productService: FeaturedDepartmentsService ,
    private router: Router,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.featuredProductsSubscription = this.productService.products.subscribe(products => {
      this.products = products;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.productService.fetchFeaturedProducts().subscribe(() => {
    this.isLoading = false;
    });
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  displayDeliveryOptions() {
    this.router.navigateByUrl('/landing/delivery-options');
  }

  displayLoginPage() {
    this.router.navigateByUrl('/auth');
  }

  displayProductDetails(productId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl('/landing/' + productId);
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Siyeshe Holdings',
      subHeader: 'Monthly Catalogue Update',
      message: 'This months issue is currently unavailable, we will notify you once it\'s available for viewing!',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  ngOnDestroy(): void {
    if (this.featuredProductsSubscription) {
      this.featuredProductsSubscription.unsubscribe();
    }
  }

}
