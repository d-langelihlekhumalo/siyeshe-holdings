/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscriber } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ShoppingCart } from '../modals/shopping-cart.modal';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  counter = 0;
  private _productTitles = [];
  private _productImages = [];
  private _productPrices = [];
  private _productQuantities = [];

  private _cart = new BehaviorSubject<ShoppingCart[]>([]);
  private _cartItemCount = new BehaviorSubject(0);

  constructor() { }

  get productTitles() {
    return {...this._productTitles};
  }

  get productImages() {
    return {...this._productImages};
  }

  get productPrices() {
    return {...this._productPrices};
  }

  get productQuantities() {
    return {...this._productQuantities};
  }

  get cartItems(){
    return this._cart.asObservable();
  }

  get cartTotalItems(){
    return this._cartItemCount.asObservable();
  }

  addToCart(productTitle: string, productImage: string, productPrice: number, productQuantity: number) {
    let hasBeenAdded = false;
    let index = 0;
    for (const product of this._productTitles) {
      if (product === productTitle) {
        console.log(productQuantity[index], Object.values(this._productQuantities[index]));
        this._productQuantities[index] = productQuantity;
        this._productPrices[index] = productPrice;
        hasBeenAdded = true;
        break;
      }
      index++;
    }

    if (!hasBeenAdded) {
      this._productTitles.push(productTitle);
      this._productImages.push(productImage);
      this._productPrices.push(productPrice);
      this._productQuantities.push(productQuantity);
      this._cartItemCount.next(this._cartItemCount.value + 1);
    }

  }

  isItemInCart(productTitle: string) {
    let isFound = false;
    for (const product of this._productTitles) {
      if (product === productTitle) {
        isFound = true;
        break;
      }
    }

    return isFound;
  }

  removeFromCart(productTitle: string) {
    let index = 0;
    for (const product of this._productTitles) {
      if (product === productTitle) {
        console.log('Removing:', product);
        this._productTitles.splice(index, 1);
        this._productImages.splice(index, 1);
        this._productQuantities.splice(index, 1);
        this._productPrices.splice(index, 1);
        this._cartItemCount.next(this._cartItemCount.value - 1);
        break;
      }
      index++;
    }
  }

  emptyCart() {
    for (const i of this._productTitles) {
      this._productTitles.pop();
      this._productImages.pop();
      this._productPrices.pop();
      this._productQuantities.pop();
    }
  }
}

