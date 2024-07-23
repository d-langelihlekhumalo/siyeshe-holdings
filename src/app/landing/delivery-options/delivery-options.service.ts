import { Injectable } from '@angular/core';
import { DeliveryOptions } from './delivery-options.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryOptionsService {
  private directory = '../../../assets/landing_page/delivery_options/';

  private _deliveryOptions: DeliveryOptions[] = [
    new DeliveryOptions('d1', 'Click & Collect',
      this.directory + 'collect.jpg',
      'Skip the queues and cut down on delivery time with Click & Collect. Collect your order at our Click & Collect Counters in-store.',
      'walk-outline'),

    new DeliveryOptions('d2', 'Get it Delivered',
      this.directory + 'deliver.jpg',
      // eslint-disable-next-line max-len
      'Our fleet of trucks are ready to bring the build directly to your site. This is valid for in-store and online purchases. We offer free deliveries on all online orders that are over R2000 and within 5km from the our store you ordered from.',
      'bicycle-outline')
  ];

  constructor() { }

  get deliveryOptions() {
    // eslint-disable-next-line no-underscore-dangle
    return [...this._deliveryOptions];
  }

  getDeliveryOption(deliveryId: string) {
    // eslint-disable-next-line no-underscore-dangle
    return {...this._deliveryOptions.find(delivery => delivery.id === deliveryId)};
  }
}
