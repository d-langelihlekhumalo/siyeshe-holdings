import { TestBed } from '@angular/core/testing';

import { BuildingMaterialsService } from './building-materials.service';

describe('BuildingMaterialsService', () => {
  let service: BuildingMaterialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingMaterialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
