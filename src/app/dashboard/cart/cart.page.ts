import { CartItemPage } from './cart-item/cart-item.page';
/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { AlertController, IonItemSliding, LoadingController, ModalController } from '@ionic/angular';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  productTitles = [];
  productImages = [];
  productPrices = [];
  productQuantity = [];
  isCartEmpty = true;
  totalPrice = 0;

  status = 'PayPal';

  customActionSheetOptions: any = {
    header: 'Payment Method',
    subHeader: 'Please select your preffered payment method'
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  displayCart() {
     // this.productTitles = this.cartService.productTitles;
    this.productTitles = Object.values(this.cartService.productTitles);
    this.productImages = this.cartService.productImages;
    this.productPrices = this.cartService.productPrices;
    this.productQuantity = this.cartService.productQuantities;

    this.totalPrice = 0;

    if (this.productTitles.length > 0) {
      this.isCartEmpty = false;
      Object.values(this.productPrices).forEach(price => {
        this.totalPrice += price;
      });
    } else {
      this.isCartEmpty = true;
    }
  }

  ionViewDidEnter() {
    this.displayCart();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Checkout Confirmation Required',
      message: 'Are you sure you want to checkout your cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          // handler: (blah) => {
          //   console.log('Confirm Cancel: blah');
          // }
        }, {
          text: 'Yes',
          id: 'confirm-button',
          handler: () => {
            this.checkout();
          }
        }
      ]
    });

    await alert.present();
  }

  checkout() {
    this.loadingController.create({
      spinner: 'bubbles',
      message: 'Processing checkout request...',
    }).then(loadingEl => {
      loadingEl.present();
      this.orderService.addOrder(this.status, this.totalPrice).subscribe(() => {
        loadingEl.dismiss();
        this.presentAlert();
      });
    });

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cart Checkout Point',
      subHeader: 'Checkout Confirmation',
      message: 'You have successfully checked out your cart. Your payment information will be processed!',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async presentModal(productTitle: string, productImage: string, productPrice: string, productQuantity: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    const itemSelectedArray = [productTitle, productImage, productPrice, productQuantity];
    const modal = await this.modalCtrl.create({
      component: CartItemPage,
      breakpoints: [0, 0.3, 0.5, 0.8, 1],
      initialBreakpoint: 0.5,
      componentProps: {
        selectedItem: itemSelectedArray
      }
    });

    await modal.present();
    const { role } = await modal.onDidDismiss();
    this.displayCart();
  }

}
