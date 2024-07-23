import { Component, OnInit } from '@angular/core';
import { DeliveryOptions } from './delivery-options.model';
import { DeliveryOptionsService } from './delivery-options.service';

@Component({
  selector: 'app-delivery-options',
  templateUrl: './delivery-options.page.html',
  styleUrls: ['./delivery-options.page.scss'],
})
export class DeliveryOptionsPage implements OnInit {
  delivery: DeliveryOptions[];

  directory = '../../../assets/landing_page/delivery_options/store/';
  images = [
    this.directory + 'store_1.jpg',
    this.directory + 'store_2.jpg',
    this.directory + 'store_3.jpg',
    this.directory + 'store_4.jpg',
    this.directory + 'store_5.jpg',
    this.directory + 'store_6.jpg',
    this.directory + 'store_7.jpg',
    this.directory + 'store_8.jpg',
    this.directory + 'store_9.jpg',
    this.directory + 'store_10.jpg',
    this.directory + 'store_11.jpg',
    this.directory + 'store_12.jpg',
    this.directory + 'store_13.jpg',
    this.directory + 'store_14.jpg'
  ];

  constructor(private deliveryService: DeliveryOptionsService) { }

  ngOnInit() {
    this.delivery = this.deliveryService.deliveryOptions;
  }

}
