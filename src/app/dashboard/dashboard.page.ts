import { AfterContentChecked, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../modals/order.modal';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit{
  cartItemsCount = 0;
  orderItemsCount = 0;
  loggedInUserEmail: string;
  loadedOrders: Order[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private orderCart: OrderService) { }

  ngOnInit() {
    this.loggedInUserEmail = this.authService.loggedInUserEmail;

    // this.cartService.cartTotalItems.subscribe(totalItems => {
    //   this.cartItemsCount = totalItems;
    //   this.loadedOrders = Object.values(totalItems);
    // });

    this.orderCart.orders.subscribe(orders => {
      this.loadedOrders = Object.values(orders);
      // cart counter!

    });

  }

  ionViewDidEnter() {
    this.orderCart.fetchOrders().subscribe(() => {
      this.displayOrderTotal();
    });
  }

  displayOrderTotal() {
    this.orderItemsCount = 0;
    this.orderCart.orders.subscribe(orders => {


    });
  }
}
