import { TestBed } from '@angular/core/testing';

import { DeliveryOptionsService } from './delivery-options.service';

describe('DeliveryOptionsService', () => {
  let service: DeliveryOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
