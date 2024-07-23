import { TestBed } from '@angular/core/testing';

import { FeaturedDepartmentsService } from './featured-departments.service';

describe('FeaturedDepartmentsService', () => {
  let service: FeaturedDepartmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedDepartmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
