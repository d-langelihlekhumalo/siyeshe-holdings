import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { CartService } from '../../../../services/cart.service';
import { BuildingMaterial } from '../../../../modals/building-materials-product.modal';

@Component({
  selector: 'app-product-cart-item',
  templateUrl: './product-cart-item.component.html',
  styleUrls: ['./product-cart-item.component.scss'],
})
export class ProductCartItemComponent implements OnInit {
  @Input() productItem: BuildingMaterial;

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
  }

  incrementQuantity(productId: string, productName: string, price: number) {
    const quantityCanvas = document.getElementById(productId);
    const quantity = +quantityCanvas.innerText + 1;

    document.getElementById(productId).innerHTML = (quantity).toString();
    this.calculatePrice(productName, price, quantity);
  }

  decrementQuantity(productId: string, productName: string, price: number) {
    const quantityCanvas = document.getElementById(productId);
    let quantity = +quantityCanvas.innerText;
    if (quantity !== 1) {
      quantity--;
      document.getElementById(productId).innerHTML = (quantity).toString();
      this.calculatePrice(productName, price, quantity);
    } else {
      this.presentToastWithOptions('Quantity can\'t be below 1');
    }
  }

  calculatePrice(productName: string, price: number, quantity: number) {
    document.getElementById(productName).innerHTML = 'R ' + (price * quantity).toFixed(2).toString();
  }

  async presentToastWithOptions(toastMessage: string) {
    const toast = await this.toastController.create({
      message: toastMessage,
      icon: 'information-circle',
      position: 'bottom',
      color: 'dark',
      buttons: [
          {
          icon: 'close-outline',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ],
      duration: 3000
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
  }

  addItemToCart(productTitle: string, productImage: string) {
    const priceCanvas = document.getElementById(productImage);
    const quantityCanvas = document.getElementById(productTitle);
    const productQuantity = +quantityCanvas.innerText;
    const productPrice = priceCanvas.innerText.substring(1).trim();

    this.cartService.addToCart(productTitle, productImage, +productPrice, productQuantity);
    this.presentToast('Item successfully added to cart');
    console.log(productTitle, '-', productImage, 'Price', productPrice, 'Product Quantity', productQuantity);
    console.log(this.cartService.productTitles);
  }

  removeItemFromCart(productTitle: string) {
    if (this.cartService.isItemInCart(productTitle)) {
      this.presentAlertConfirm('Are you sure you want to remove this item:', productTitle);
    } else {
      this.presentToast('Item not in cart');
    }
  }

  async presentToast(toastMessage: string) {
    const toast = await this.toastController.create({
      message: toastMessage,
      icon: 'information-circle',
      position: 'bottom',
      color: 'dark',
      duration: 2000
    });
    toast.present();
  }

  async presentAlertConfirm(alertMessage: string, productTitle: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: alertMessage,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button'
        }, {
          text: 'Remove',
          id: 'confirm-button',
          handler: () => {
            this.cartService.removeFromCart(productTitle);
            this.presentToast('Item successfully removed from cart');
          }
        }
      ]
    });

    await alert.present();
  }

}
