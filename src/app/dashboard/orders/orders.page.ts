import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from '../../modals/order.modal';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {
  hasPreviousOrders = false;
  isLoading = false;
  loggedInUserEmail: string;
  loadedOrders: Order[] = [];
  currentUserOrders: Order[] = [];
  ordersSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private orderCart: OrderService
  ) { }

  ionViewWillEnter() {
    this.orderCart.fetchOrders().subscribe();
    this.displayUsersOrders();
  }

  ngOnInit() {

  }

  displayUsersOrders() {
    this.loggedInUserEmail = this.authService.loggedInUserEmail;
    this.isLoading = true;

    this.ordersSubscription = this.orderCart.orders.subscribe(orders => {
      for (const order of orders) {
        if ((this.loadedOrders.length === 0) && (order.userEmail === this.loggedInUserEmail)) {
          this.loadedOrders = orders;
          this.hasPreviousOrders = true;
        } else {
          let isUniqueOrder = true;
          for (const loadedOrder of this.loadedOrders) {
            if (order.orderId === loadedOrder.orderId) {
              isUniqueOrder = false;
              break;
            }
          }

          if (isUniqueOrder && (order.userEmail === this.loggedInUserEmail)) {
            this.loadedOrders = orders;
          }
        }
      }

    });

    this.isLoading = false;
    // this.hasPreviousOrders = this.loadedOrders.length > 0;
    // console.log(this.loadedOrders.length);
  }

  ngOnDestroy(): void {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

}
