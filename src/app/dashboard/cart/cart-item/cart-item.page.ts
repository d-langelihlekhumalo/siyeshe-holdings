import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.page.html',
  styleUrls: ['./cart-item.page.scss'],
})
export class CartItemPage implements OnInit {
  @Input() selectedItem: string[];
  itemQuantity = 0;
  itemPrice = 0;
  originalPrice = 0;

  constructor(
    private modalCtrl: ModalController,
    private cartService: CartService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,) { }

  ngOnInit() {
    this.itemQuantity = +this.selectedItem[3];
    this.itemPrice = +this.selectedItem[2];
    this.originalPrice = (this.itemPrice / this.itemQuantity);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  incrementQuantity() {
    this.itemQuantity++;
    console.log('increment Quantity', this.itemQuantity);
    this.calculatePrice();
  }

  decrementQuantity() {
    if (this.itemQuantity !== 1) {
      this.itemQuantity--;
      this.calculatePrice();
    } else {
      this.presentToastWithOptions('Quantity can\'t be below 1');
    }
  }

  calculatePrice() {
    this.itemPrice = parseFloat((this.originalPrice * this.itemQuantity).toFixed(2));
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

  addItemToCart() {
    this.cartService.addToCart(this.selectedItem[0], this.selectedItem[1], this.itemPrice, this.itemQuantity);
    this.presentToast('Item successfully edited to cart');
  }

  removeItemFromCart() {
    if (this.cartService.isItemInCart(this.selectedItem[0])) {
      this.presentAlertConfirm('Are you sure you want to remove this item:', this.selectedItem[0]);
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
