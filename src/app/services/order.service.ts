/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { Order } from '../modals/order.modal';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';

interface OrderData {
  userEmail: string;
  totalItems: number;
  totalPrice: number;
  paymentMethod: string;
  productTitles: string[];
  productImages: string[];
  productPrices: number[];
  productQuantities: number[];
  orderDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private _orders = new BehaviorSubject<Order[]>([]);

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService) { }

  get orders() {
    return this._orders.asObservable();
  }

  fetchOrders() {
    return this.http
    .get<{[key: string]: OrderData}>('https://siyeshe-holdings-cd67e-default-rtdb.firebaseio.com/orders.json')
    .pipe(map(responseData => {
      const orders = [];
      for(const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          orders.push(
            new Order(
              key,
              responseData[key].userEmail,
              responseData[key].totalItems,
              responseData[key].totalPrice,
              responseData[key].paymentMethod,
              responseData[key].productTitles,
              responseData[key].productImages,
              responseData[key].productPrices,
              responseData[key].productQuantities ,
              new Date(responseData[key].orderDate)
            ));
          }
        }
        return orders;
    }), tap(orders => {
      this._orders.next(orders);
    }));
  }

  getOrder(orderId: string) {
    return this.http
      .get<OrderData>(`https://siyeshe-holdings-cd67e-default-rtdb.firebaseio.com/orders/${orderId}.json`)
      .pipe(
        map(orderData => new Order(
          orderId,
          orderData.userEmail,
          orderData.totalItems,
          orderData.totalPrice,
          orderData.paymentMethod,
          orderData.productTitles,
          orderData.productImages,
          orderData.productPrices,
          orderData.productQuantities,
          new Date(orderData.orderDate)
      ))
    );
  }

  addOrder(paymentMethod: string, totalPrice: number) {
    let generatedId: string;
    let totalItems: number;
    let newOrder: Order;
    const userEmail = this.authService.loggedInUserEmail;

    this.cartService.cartTotalItems.subscribe(total => {
      totalItems = total;
    });

    // eslint-disable-next-line prefer-const
    newOrder = new Order(
      '',
      userEmail,
      totalItems,
      totalPrice,
      paymentMethod,
      Object.values(this.cartService.productTitles),
      Object.values(this.cartService.productImages),
      Object.values(this.cartService.productPrices),
      Object.values(this.cartService.productQuantities),
      new Date()
    );

    return this.http
      .post<{name: string}>('https://siyeshe-holdings-cd67e-default-rtdb.firebaseio.com/orders.json',
      {... newOrder, orderId: null}).pipe(switchMap(responseData => {
        generatedId = responseData.name;
        return this.orders;
      }), take(1),
      tap(orders => {
        newOrder.orderId = generatedId;
        this._orders.next(orders.concat(newOrder));
      }));
  }

  // updateOrder(orderId: string, title: string, description: string) {
  //   let updatedPlaces: Order[];
  //   return this.places.pipe(
  //     take(1), switchMap(places => {
  //       if (!places || places.length < 0) {
  //         return this.fetchPlaces();
  //       } else {
  //         return of(places);
  //       }
  //     }),
  //     switchMap(places => {
  //       const updatedPlaceIndex = places.findIndex(pl => pl.id === orderId);
  //       updatedPlaces = [...places];
  //       const oldPlace = updatedPlaces[updatedPlaceIndex];
  //       updatedPlaces[updatedPlaceIndex] = new Place(
  //         oldPlace.id,
  //         title,
  //         description,
  //         oldPlace.imageUrl,
  //         oldPlace.price,
  //         oldPlace.availableFrom,
  //         oldPlace.availableTo,
  //         oldPlace.userId
  //       );
  //       return this.http.put(
  //         `https://ionic-angular-6b431-default-rtdb.firebaseio.com/offered-places/${orderId}.json`,
  //         {...updatedPlaces[updatedPlaceIndex], id: null});
  //     }), tap(() => {
  //       this._orders.next(updatedPlaces);
  //     })
  //   );
  // }
}
